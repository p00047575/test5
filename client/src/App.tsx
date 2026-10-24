import { useEffect, useRef, useState, type FormEvent } from "react";
import Markdown from "react-markdown";
import { askWhy, fetchCategories, fetchHealth, fetchWhys, type Category, type Market, type Why } from "./api";

const MARKET_OPTIONS: { value: Market; label: string }[] = [
  { value: "ALL", label: "India + US" },
  { value: "IN", label: "India" },
  { value: "US", label: "US" },
];

const MARKET_BADGE: Record<Why["market"], string> = { IN: "India", US: "US", GLOBAL: "Global" };

interface Answer {
  question: string;
  text: string;
  status?: string;
  error?: string;
  loading: boolean;
}

export function App() {
  const [market, setMarket] = useState<Market>("ALL");
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string>();
  const [search, setSearch] = useState("");
  const [whys, setWhys] = useState<Why[]>([]);
  const [openId, setOpenId] = useState<string>();
  const [askEnabled, setAskEnabled] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<Answer>();
  const abortRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
    fetchHealth()
      .then((h) => setAskEnabled(h.askEnabled))
      .catch(() => setAskEnabled(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWhys({ category, market, q: search }).then(setWhys).catch(console.error);
    }, 200);
    return () => clearTimeout(timer);
  }, [category, market, search]);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAnswer({ question: trimmed, text: "", loading: true });

    try {
      await askWhy(
        trimmed,
        market,
        (event) => {
          setAnswer((prev) => {
            if (!prev) return prev;
            switch (event.type) {
              case "status":
                return { ...prev, status: event.message };
              case "text":
                return { ...prev, status: undefined, text: prev.text + event.text };
              case "done":
                return { ...prev, status: undefined, loading: false };
              case "error":
                return { ...prev, status: undefined, error: event.message, loading: false };
            }
          });
        },
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        setAnswer((prev) => prev && { ...prev, error: "Could not reach the server.", loading: false });
      }
      return;
    }
    setAnswer((prev) => prev && { ...prev, loading: false });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(question);
  }

  return (
    <div className="page">
      <header className="hero">
        <h1>
          Why <span>Market</span>
        </h1>
        <p>Every market move has a reason. Ask why - about any stock, index, sector or concept, in India and the US.</p>
      </header>

      <div className="market-toggle" role="radiogroup" aria-label="Market">
        {MARKET_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            role="radio"
            aria-checked={market === opt.value}
            className={market === opt.value ? "active" : ""}
            onClick={() => setMarket(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <form className="ask" onSubmit={onSubmit}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Why did Nifty fall today?  Why do banks love rate hikes?"
          maxLength={500}
          aria-label="Your why question"
          disabled={!askEnabled}
        />
        <button type="submit" disabled={!askEnabled || !question.trim() || answer?.loading}>
          {answer?.loading ? "Thinking..." : "Ask why"}
        </button>
      </form>
      {!askEnabled && (
        <p className="notice">Live answers are off: set ANTHROPIC_API_KEY on the server. You can still browse the library below.</p>
      )}

      {answer && (
        <section className="answer" aria-live="polite">
          <h2>{answer.question}</h2>
          {answer.status && <p className="status">{answer.status}</p>}
          {answer.loading && !answer.text && !answer.status && <p className="status">Working out the why...</p>}
          {answer.text && <Markdown>{answer.text}</Markdown>}
          {answer.error && <p className="error">{answer.error}</p>}
          <p className="disclaimer">For learning only, not investment advice.</p>
        </section>
      )}

      <section className="library">
        <div className="library-head">
          <h2>Library of whys</h2>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the library"
            aria-label="Search the library"
          />
        </div>
        <div className="chips">
          <button className={!category ? "active" : ""} onClick={() => setCategory(undefined)}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              title={c.description}
              className={category === c.id ? "active" : ""}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {whys.length === 0 && <p className="empty">No whys match yet - try asking it above.</p>}
        <ul className="cards">
          {whys.map((why) => {
            const open = openId === why.id;
            return (
              <li key={why.id} className={open ? "card open" : "card"}>
                <button className="card-q" aria-expanded={open} onClick={() => setOpenId(open ? undefined : why.id)}>
                  <span className={`badge ${why.market.toLowerCase()}`}>{MARKET_BADGE[why.market]}</span>
                  {why.question}
                </button>
                {open && (
                  <div className="card-a">
                    <p>{why.answer}</p>
                    <div className="tags">
                      {why.tags.map((t) => (
                        <span key={t}>#{t}</span>
                      ))}
                    </div>
                    {askEnabled && (
                      <button className="link" onClick={() => void ask(`${why.question} Explain in more depth with current examples.`)}>
                        Go deeper with current examples
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
