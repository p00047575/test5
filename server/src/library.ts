export type Market = "IN" | "US" | "GLOBAL";

export interface Category {
  id: string;
  label: string;
  description: string;
}

export interface Why {
  id: string;
  question: string;
  category: string;
  market: Market;
  answer: string;
  tags: string[];
}

export const categories: Category[] = [
  { id: "price-moves", label: "Price moves", description: "Why a stock or index rises or falls" },
  { id: "macro", label: "Macro & policy", description: "Interest rates, inflation, currency and central banks" },
  { id: "flows", label: "Money flows", description: "Who is buying, who is selling, and why it matters" },
  { id: "valuation", label: "Valuation", description: "Why a company is priced the way it is" },
  { id: "events", label: "Events", description: "Results, IPOs, splits, budgets and other market events" },
  { id: "derivatives", label: "F&O and derivatives", description: "Options, futures, expiry and volatility" },
];

export const whys: Why[] = [
  {
    id: "good-results-stock-falls",
    question: "Why does a stock sometimes fall after reporting good results?",
    category: "price-moves",
    market: "GLOBAL",
    answer:
      "Prices reflect expectations, not just outcomes. If analysts and investors expected even better numbers, or the outlook (guidance) for the next quarters was weak, the stock can fall on a 'good' quarter. Often the rise already happened before the results as traders bought in anticipation - 'buy the rumour, sell the news'.",
    tags: ["earnings", "expectations", "guidance"],
  },
  {
    id: "rate-hike-stocks-fall",
    question: "Why do stock markets usually fall when interest rates go up?",
    category: "macro",
    market: "GLOBAL",
    answer:
      "Higher rates raise borrowing costs for companies, which can squeeze profits. They also make safer assets like bonds and fixed deposits more attractive, so some money moves out of equities. And the future profits that a stock's price is based on are worth less today when discounted at a higher rate - this hits high-growth, high-valuation stocks the hardest.",
    tags: ["RBI", "Fed", "interest rates", "discounting"],
  },
  {
    id: "fed-moves-nifty",
    question: "Why does a US Federal Reserve decision move the Indian market?",
    category: "macro",
    market: "IN",
    answer:
      "When US rates rise, US assets pay more and the dollar tends to strengthen, so foreign portfolio investors (FPIs) often pull money out of emerging markets like India. That selling pressure, plus a weaker rupee, can drag the Nifty and Sensex lower. Rate cuts in the US tend to have the opposite effect.",
    tags: ["FPI", "Fed", "rupee", "Nifty"],
  },
  {
    id: "fii-dii",
    question: "Why do FII and DII flows matter so much for Indian stocks?",
    category: "flows",
    market: "IN",
    answer:
      "Foreign institutional investors (FIIs/FPIs) and domestic institutional investors (DIIs - mutual funds, insurers) are the biggest buyers and sellers in the market. Heavy FII selling can push prices down; in recent years steady SIP inflows have let DIIs absorb much of that selling, which is why Indian markets have become less dependent on foreign money than before.",
    tags: ["FII", "DII", "SIP", "mutual funds"],
  },
  {
    id: "rupee-it-stocks",
    question: "Why do Indian IT stocks often rise when the rupee weakens?",
    category: "macro",
    market: "IN",
    answer:
      "Companies like TCS, Infosys and Wipro earn most of their revenue in dollars but pay most of their costs (salaries) in rupees. A weaker rupee means each dollar earned converts into more rupees, which improves margins. Importers such as oil marketing companies see the reverse effect.",
    tags: ["rupee", "IT", "exports", "currency"],
  },
  {
    id: "crude-oil-india",
    question: "Why is a rise in crude oil prices bad for the Indian market?",
    category: "macro",
    market: "IN",
    answer:
      "India imports most of its oil, so higher crude widens the trade deficit, weakens the rupee and pushes up inflation - which can delay RBI rate cuts. Paint, tyre, aviation and oil-marketing companies see their costs rise. Upstream producers like ONGC can benefit.",
    tags: ["crude", "inflation", "trade deficit"],
  },
  {
    id: "high-pe-tech",
    question: "Why do some tech stocks trade at very high P/E ratios?",
    category: "valuation",
    market: "US",
    answer:
      "A P/E ratio compares price to current earnings, but investors are paying for expected future earnings. If a company is expected to grow profits fast for many years, a high P/E today can still be justified. The risk is that if growth slows, the multiple can shrink sharply even when profits keep rising.",
    tags: ["P/E", "growth", "valuation"],
  },
  {
    id: "magnificent-seven",
    question: "Why does the S&P 500 depend so much on a handful of big tech stocks?",
    category: "price-moves",
    market: "US",
    answer:
      "The S&P 500 is market-cap weighted, so the largest companies have the biggest influence. A small group of mega-cap tech companies now makes up a large share of the index, which means their moves can lift or drag the whole index even when most other stocks are moving the other way. The equal-weight S&P 500 shows how the 'average' stock is doing.",
    tags: ["S&P 500", "market cap", "concentration"],
  },
  {
    id: "ipo-listing-pop",
    question: "Why do some IPOs list at a big premium and then fall?",
    category: "events",
    market: "GLOBAL",
    answer:
      "IPOs are often priced to leave something on the table so the issue gets fully subscribed. Heavy oversubscription and grey market buzz create a listing-day premium. After listing, short-term investors book profits, and once the lock-in period for anchor investors and promoters ends, extra supply of shares can push the price down.",
    tags: ["IPO", "listing gains", "lock-in"],
  },
  {
    id: "stock-split",
    question: "Why does a stock split not change what the company is worth?",
    category: "events",
    market: "GLOBAL",
    answer:
      "A split just divides each share into more pieces - a 1:5 split turns one ₹1,000 share into five ₹200 shares. Your total holding value is unchanged. Prices sometimes rise around a split because lower per-share prices attract more retail buyers and improve liquidity, not because the business changed.",
    tags: ["split", "bonus", "corporate action"],
  },
  {
    id: "budget-day-volatility",
    question: "Why is the Indian market so volatile on Union Budget day?",
    category: "events",
    market: "IN",
    answer:
      "The Budget sets taxes (including capital gains tax and STT on trades), government spending and borrowing for the year. Sectors like infrastructure, defence, railways and rural consumption can gain or lose depending on allocations, and any change in investor taxation hits the whole market at once. Traders position before the speech and react to every announcement.",
    tags: ["budget", "tax", "STT", "capital gains"],
  },
  {
    id: "expiry-volatility",
    question: "Why does the market get volatile around F&O expiry?",
    category: "derivatives",
    market: "IN",
    answer:
      "On expiry, traders must close or roll over their futures and options positions. Large open interest at certain strike prices creates pressure as option writers hedge, and the price can be pulled towards or pushed away from those strikes. Heavy rollover activity also adds to volumes and short-term swings.",
    tags: ["expiry", "open interest", "options"],
  },
  {
    id: "vix-spike",
    question: "Why does the VIX (fear index) jump when markets fall?",
    category: "derivatives",
    market: "GLOBAL",
    answer:
      "The VIX (US) and India VIX measure the volatility implied by option prices. When markets fall, investors rush to buy put options for protection, pushing up option prices and therefore implied volatility. That is why the VIX tends to spike during sell-offs and drift lower during calm, rising markets.",
    tags: ["VIX", "India VIX", "implied volatility"],
  },
  {
    id: "gap-up-open",
    question: "Why does a stock open much higher or lower than it closed yesterday?",
    category: "price-moves",
    market: "GLOBAL",
    answer:
      "News that arrives after market hours - results, global market moves, a policy change, or a company announcement - is priced in at the next open. In India, overnight moves in the US market and GIFT Nifty give an early signal; in the US, pre-market trading shows where a stock is likely to open.",
    tags: ["gap up", "gap down", "GIFT Nifty", "pre-market"],
  },
  {
    id: "dividend-drop",
    question: "Why does a stock price drop on the ex-dividend date?",
    category: "events",
    market: "GLOBAL",
    answer:
      "On the ex-dividend date, new buyers are no longer entitled to the upcoming dividend, so the share is worth roughly the dividend amount less. The exchange adjusts for this, and the price typically opens lower by about the dividend per share. Shareholders aren't worse off - the value moves from the share price into their bank account.",
    tags: ["dividend", "ex-date", "record date"],
  },
  {
    id: "smallcap-fall-harder",
    question: "Why do small-cap stocks fall harder than large-caps in a correction?",
    category: "flows",
    market: "GLOBAL",
    answer:
      "Small-caps have fewer shares trading each day, so selling pressure moves their prices more. They are also more sensitive to economic slowdowns and higher borrowing costs, and they tend to run up more in bull markets on optimism. When sentiment turns, investors move to the relative safety of large, established companies.",
    tags: ["small cap", "liquidity", "risk"],
  },
];

export interface WhyFilter {
  category?: string;
  market?: string;
  q?: string;
}

export function filterWhys(filter: WhyFilter): Why[] {
  const q = filter.q?.trim().toLowerCase();
  const market = filter.market?.toUpperCase();
  return whys.filter((why) => {
    if (filter.category && why.category !== filter.category) return false;
    // Global whys apply to every market.
    if (market && market !== "ALL" && why.market !== market && why.market !== "GLOBAL") return false;
    if (q) {
      const haystack = [why.question, why.answer, ...why.tags].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
