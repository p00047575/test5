import express from "express";
import { askWhy, describeError, hasCredentials, type AskEvent, type AskMarket } from "./ask.js";
import { categories, filterWhys, whys } from "./library.js";

const MARKETS: AskMarket[] = ["IN", "US", "ALL"];
const MAX_QUESTION_LENGTH = 500;

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, askEnabled: hasCredentials() });
  });

  app.get("/api/categories", (_req, res) => {
    res.json(categories);
  });

  app.get("/api/whys", (req, res) => {
    const str = (value: unknown) => (typeof value === "string" ? value : undefined);
    res.json(filterWhys({ category: str(req.query.category), market: str(req.query.market), q: str(req.query.q) }));
  });

  app.get("/api/whys/:id", (req, res) => {
    const why = whys.find((w) => w.id === req.params.id);
    if (!why) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(why);
  });

  app.post("/api/ask", async (req, res) => {
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
    const market: AskMarket = MARKETS.includes(req.body?.market) ? req.body.market : "ALL";

    if (!question) {
      res.status(400).json({ error: "Please enter a question." });
      return;
    }
    if (question.length > MAX_QUESTION_LENGTH) {
      res.status(400).json({ error: `Questions can be at most ${MAX_QUESTION_LENGTH} characters.` });
      return;
    }
    if (!hasCredentials()) {
      res.status(503).json({ error: "Asking new questions needs ANTHROPIC_API_KEY to be set on the server." });
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    const send = (event: AskEvent) => res.write(`data: ${JSON.stringify(event)}\n\n`);

    const abort = new AbortController();
    res.on("close", () => abort.abort());

    try {
      await askWhy(question, market, send, abort.signal);
    } catch (error) {
      if (!abort.signal.aborted) {
        console.error("ask failed:", error);
        send({ type: "error", message: describeError(error) });
      }
    }
    res.end();
  });

  return app;
}
