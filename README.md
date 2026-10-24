# Why Market

Every market move has a reason. **Why Market** is a full-stack app where you can ask *why* about anything in the stock market, for both **India** (NSE/BSE, Nifty, Sensex) and the **US** (NYSE, Nasdaq, S&P 500), for example:

- Why did Nifty fall today?
- Why do IT stocks rise when the rupee weakens?
- Why does a Fed decision move the Indian market?
- Why does the VIX jump when markets fall?

## Features

- **Ask any why:** Claude answers the question and streams the response. It searches the web for anything recent, such as today's moves or news.
- **Library of whys:** a curated set of explained questions you can browse by category (price moves, macro & policy, money flows, valuation, events, F&O) and search.
- **Market toggle:** India, US, or both. Answers use local context (RBI and FII/DII flows for India, the Fed for the US).

## Stack

| Part | Tech |
|---|---|
| `client/` | React 19, Vite, TypeScript |
| `server/` | Node, Express 5, TypeScript, Anthropic SDK |

## Getting started

```bash
npm install
cp .env.example .env            # then set ANTHROPIC_API_KEY
export $(grep -v '^#' .env | xargs)
npm run dev                     # client on http://localhost:5173, API on :3001
```

The library works without an API key. The "Ask why" box needs `ANTHROPIC_API_KEY` set on the server.

> If `npm install` fails with `Cannot read properties of null (reading 'edgesOut')`, that is a bug in npm 10. Use `npx npm@11 install` instead.

### Other scripts

```bash
npm test            # server unit and API tests
npm run typecheck   # typecheck server and client
npm run build       # build both; then `npm start` serves the app on :3001
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Server status and whether live answers are enabled |
| GET | `/api/categories` | Library categories |
| GET | `/api/whys?market=IN\|US\|ALL&category=&q=` | Search the library |
| GET | `/api/whys/:id` | One library entry |
| POST | `/api/ask` `{ question, market }` | Streams an answer as server-sent events |

Answers are for learning only and are not investment advice.
