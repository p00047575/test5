import Anthropic from "@anthropic-ai/sdk";

export type AskMarket = "IN" | "US" | "ALL";

export type AskEvent =
  | { type: "status"; message: string }
  | { type: "text"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

const MODEL = "claude-opus-5-5";
// Server tools can pause a long turn; resume it this many times at most.
const MAX_CONTINUATIONS = 3;

const SYSTEM_PROMPT = `You are Why Market, a guide who explains the "why" behind stock market behaviour in India (NSE/BSE, Nifty, Sensex) and the US (NYSE, Nasdaq, S&P 500, Dow).

People ask every kind of why: why a stock or index moved, why markets react to rates, inflation, currency or oil, why money flows in or out, why a company is valued the way it is, why events like results, IPOs, budgets, splits or F&O expiry matter, and why core concepts work as they do.

How to answer:
- Lead with the direct answer in one or two sentences, then explain the cause-and-effect chain behind it.
- When the question is about something recent (a move today, this week's news, a specific stock's price), search the web for current information and say what date the facts are from. Never invent prices, figures or news.
- Use the right local context: rupees, RBI, SEBI, FII/DII flows for India; dollars, the Fed, SEC for the US. If the question spans both, compare them.
- Explain jargon in plain words the first time you use it.
- Keep it concise: short paragraphs or a few bullets, under about 300 words unless the question needs more.
- Explain; do not give personalised buy or sell recommendations. If asked whether to buy or sell, explain the factors to weigh instead.`;

const MARKET_HINT: Record<AskMarket, string> = {
  IN: "The user is focused on the Indian market.",
  US: "The user is focused on the US market.",
  ALL: "The user is interested in both the Indian and US markets.",
};

export function hasCredentials(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

let client: Anthropic | undefined;
function getClient(): Anthropic {
  client ??= new Anthropic();
  return client;
}

export async function askWhy(
  question: string,
  market: AskMarket,
  emit: (event: AskEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    { role: "user", content: `${MARKET_HINT[market]}\n\nQuestion: ${question}` },
  ];

  for (let attempt = 0; attempt <= MAX_CONTINUATIONS; attempt++) {
    const stream = getClient().beta.messages.stream(
      {
        model: MODEL,
        max_tokens: 64000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "medium" },
        system: SYSTEM_PROMPT,
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }],
        messages,
      },
      { signal },
    );

    for await (const event of stream) {
      if (event.type === "content_block_start" && event.content_block.type === "server_tool_use") {
        emit({ type: "status", message: "Searching the web for the latest information..." });
      } else if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        emit({ type: "text", text: event.delta.text });
      }
    }

    const final = await stream.finalMessage();
    if (final.stop_reason === "refusal") {
      emit({ type: "error", message: "This question can't be answered. Try rephrasing it." });
      return;
    }
    if (final.stop_reason !== "pause_turn") {
      emit({ type: "done" });
      return;
    }
    // Resume a paused server-tool turn by sending its content back.
    messages.push({ role: "assistant", content: final.content });
  }

  emit({ type: "done" });
}

export function describeError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return "The server's Claude API credentials are invalid.";
  }
  if (error instanceof Anthropic.RateLimitError) {
    return "Too many questions right now. Please try again in a minute.";
  }
  if (error instanceof Anthropic.APIError) {
    return `The answer service returned an error (${error.status ?? "network"}).`;
  }
  return "Something went wrong while answering.";
}
