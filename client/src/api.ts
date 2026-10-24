export type Market = "IN" | "US" | "ALL";

export interface Category {
  id: string;
  label: string;
  description: string;
}

export interface Why {
  id: string;
  question: string;
  category: string;
  market: "IN" | "US" | "GLOBAL";
  answer: string;
  tags: string[];
}

export type AskEvent =
  | { type: "status"; message: string }
  | { type: "text"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const fetchHealth = () => getJson<{ ok: boolean; askEnabled: boolean }>("/api/health");
export const fetchCategories = () => getJson<Category[]>("/api/categories");

export function fetchWhys(params: { category?: string; market: Market; q?: string }) {
  const search = new URLSearchParams({ market: params.market });
  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  return getJson<Why[]>(`/api/whys?${search}`);
}

export async function askWhy(
  question: string,
  market: Market,
  onEvent: (event: AskEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, market }),
    signal,
  });
  if (!res.ok || !res.body) {
    const body = await res.json().catch(() => ({}));
    onEvent({ type: "error", message: body.error ?? `Request failed: ${res.status}` });
    return;
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) {
      if (frame.startsWith("data: ")) onEvent(JSON.parse(frame.slice(6)) as AskEvent);
    }
  }
}
