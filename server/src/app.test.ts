import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp } from "./app.js";
import { filterWhys, whys } from "./library.js";

describe("filterWhys", () => {
  it("includes global whys for a specific market", () => {
    const results = filterWhys({ market: "US" });
    expect(results.every((w) => w.market === "US" || w.market === "GLOBAL")).toBe(true);
    expect(results.some((w) => w.market === "IN")).toBe(false);
  });

  it("filters by category", () => {
    const results = filterWhys({ category: "macro" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((w) => w.category === "macro")).toBe(true);
  });

  it("searches question, answer and tags case-insensitively", () => {
    expect(filterWhys({ q: "RUPEE" }).map((w) => w.id)).toContain("rupee-it-stocks");
    expect(filterWhys({ q: "no such topic zzz" })).toEqual([]);
  });
});

describe("API", () => {
  const app = createApp();

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("lists whys", async () => {
    const res = await request(app).get("/api/whys");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(whys.length);
  });

  it("returns 404 for an unknown why", async () => {
    const res = await request(app).get("/api/whys/unknown");
    expect(res.status).toBe(404);
  });

  it("rejects an empty question", async () => {
    const res = await request(app).post("/api/ask").send({ question: "  " });
    expect(res.status).toBe(400);
  });

  it("reports when asking is not configured", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("ANTHROPIC_AUTH_TOKEN", "");
    const res = await request(app).post("/api/ask").send({ question: "Why did Nifty fall today?" });
    expect(res.status).toBe(503);
  });
});
