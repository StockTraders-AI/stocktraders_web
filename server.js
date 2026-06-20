/* global process */

import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

dotenv.config();

const app = express();
const execFileAsync = promisify(execFile);

app.disable("x-powered-by");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://45.251.114.164:5173",
    ],
  })
);
app.use(express.json());

const PORT = 4005;

const CACHE_FILE = path.resolve("cache/smdt-branch.json");
const TICKER_CACHE_FILE = path.resolve("cache/smdt-ticker.json");
const CASH_FLOW_BRANCH_CACHE_FILE = path.resolve("cache/cash-flow-branch.json");
const CASH_FLOW_TICKER_CACHE_FILE = path.resolve("cache/cash-flow-ticker.json");
const TOTAL_TRADE_REAL_CACHE_FILE = path.resolve("cache/total-trade-real.json");
const STOCK_TOTALS_DB_CANDIDATES = [
  process.env.STOCK_TOTALS_DB_PATH,
  "stock_totals.db",
  "../re-api/stock_totals.db",
  "../re-api/re-api/stock_totals.db",
  "../../re-api/stock_totals.db",
  "../../re-api/re-api/stock_totals.db",
  "/root/re-api/stock_totals.db",
  "/root/re-api/re-api/stock_totals.db",
].filter(Boolean);
const SMDT_CACHE_MS = 3 * 60 * 1000;

let smdtBranchCache = null;
let smdtBranchCacheTime = 0;
let smdtTickerCache = null;
let smdtTickerCacheTime = 0;
let cashFlowBranchCache = null;
let cashFlowBranchCacheTime = 0;
let cashFlowTickerCache = null;
let cashFlowTickerCacheTime = 0;
let totalTradeRealCache = null;
let totalTradeRealCacheTime = 0;

try {
  if (fs.existsSync(CACHE_FILE)) {
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));

    smdtBranchCache = cache.data;
    smdtBranchCacheTime = new Date(cache.updatedAt).getTime();

    console.log("Loaded SMDT Branch cache:", cache.updatedAt);
  }
} catch (error) {
  console.error("Load SMDT Branch cache error:", error.message);
}

try {
  if (fs.existsSync(TICKER_CACHE_FILE)) {
    const cache = JSON.parse(fs.readFileSync(TICKER_CACHE_FILE, "utf8"));

    smdtTickerCache = cache.data;
    smdtTickerCacheTime = new Date(cache.updatedAt).getTime();

    console.log("Loaded SMDT Ticker cache:", cache.updatedAt);
  }
} catch (error) {
  console.error("Load SMDT Ticker cache error:", error.message);
}

try {
  if (fs.existsSync(CASH_FLOW_BRANCH_CACHE_FILE)) {
    const cache = JSON.parse(
      fs.readFileSync(CASH_FLOW_BRANCH_CACHE_FILE, "utf8")
    );

    cashFlowBranchCache = cache.data;
    cashFlowBranchCacheTime = new Date(cache.updatedAt).getTime();

    console.log("Loaded Cash Flow Branch cache:", cache.updatedAt);
  }
} catch (error) {
  console.error("Load Cash Flow Branch cache error:", error.message);
}

try {
  if (fs.existsSync(CASH_FLOW_TICKER_CACHE_FILE)) {
    const cache = JSON.parse(
      fs.readFileSync(CASH_FLOW_TICKER_CACHE_FILE, "utf8")
    );

    cashFlowTickerCache = cache.data;
    cashFlowTickerCacheTime = new Date(cache.updatedAt).getTime();

    console.log("Loaded Cash Flow Ticker cache:", cache.updatedAt);
  }
} catch (error) {
  console.error("Load Cash Flow Ticker cache error:", error.message);
}

try {
  if (fs.existsSync(TOTAL_TRADE_REAL_CACHE_FILE)) {
    const cache = JSON.parse(
      fs.readFileSync(TOTAL_TRADE_REAL_CACHE_FILE, "utf8")
    );

    totalTradeRealCache = cache.data;
    totalTradeRealCacheTime = new Date(cache.updatedAt).getTime();

    console.log("Loaded Total Trade Real cache:", cache.updatedAt);
  }
} catch (error) {
  console.error("Load Total Trade Real cache error:", error.message);
}


const SYMBOLS = [
  { name: "VNINDEX", symbol: "VNIndex" },
  { name: "HNXINDEX", symbol: "HNXIndex" },
  { name: "UPINDEX", symbol: "HNXUPCOMINDEX" },
];

const lastGoodData = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAccessToken() {
  const res = await axios.post(
    "https://fc-data.ssi.com.vn/api/v2/Market/AccessToken",
    {
      consumerID: process.env.SSI_CONSUMER_ID,
      consumerSecret: process.env.SSI_CONSUMER_SECRET,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  return res.data.accessToken || res.data.data?.accessToken;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatChange(value) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

function getVietnamDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return `${values.day}/${values.month}/${values.year}`;
}

function buildIndexUrl(symbol, tradingDate) {
  return (
    "https://fc-data.ssi.com.vn/api/v2/Market/IntradayOhlc" +
    `?symbol=${symbol}` +
    `&fromDate=${tradingDate}` +
    `&toDate=${tradingDate}` +
    "&pageIndex=1" +
    "&pageSize=2" +
    "&ascending=false" +
    "&resollution=1"
  );
}

function getStockTotalsDbPath() {
  const foundPath = STOCK_TOTALS_DB_CANDIDATES.map((candidate) =>
    path.resolve(candidate)
  ).find((candidate) => fs.existsSync(candidate));

  return foundPath || path.resolve(STOCK_TOTALS_DB_CANDIDATES[0]);
}

function getPythonCommands() {
  const commands = [];

  if (process.env.PYTHON_BIN) {
    commands.push({
      command: process.env.PYTHON_BIN,
      argsPrefix: [],
    });
  }

  commands.push(
    {
      command: "python3",
      argsPrefix: [],
    },
    {
      command: "python",
      argsPrefix: [],
    },
    {
      command: "py",
      argsPrefix: ["-3"],
    }
  );

  [
    "C:\\Users\\gmt\\AppData\\Local\\Programs\\Python\\Python313\\python.exe",
    "C:\\Users\\gmt\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
  ].forEach((command) => {
    if (fs.existsSync(command)) {
      commands.push({
        command,
        argsPrefix: [],
      });
    }
  });

  return commands;
}

async function readHistoricalPrices(tickers, date) {
  if (!tickers.length) return [];

  const dbPath = getStockTotalsDbPath();

  const script = `
import json
import sqlite3
import sys

db_path = sys.argv[1]
date_filter = sys.argv[2]
tickers = json.loads(sys.argv[3])

con = sqlite3.connect(db_path)
con.row_factory = sqlite3.Row
cur = con.cursor()
rows = []

for ticker in tickers:
    if date_filter:
        row = cur.execute(
            """
            SELECT ticker, date, open, high, low, close, vol
            FROM stock_totals
            WHERE ticker = ? AND date <= ?
            ORDER BY date DESC
            LIMIT 1
            """,
            (ticker, date_filter),
        ).fetchone()
    else:
        row = cur.execute(
            """
            SELECT ticker, date, open, high, low, close, vol
            FROM stock_totals
            WHERE ticker = ?
            ORDER BY date DESC
            LIMIT 1
            """,
            (ticker,),
        ).fetchone()

    if row:
        rows.append(dict(row))

print(json.dumps(rows, ensure_ascii=False))
`;

  let stdout = "";
  const errors = [];

  for (const pythonCommand of getPythonCommands()) {
    try {
      const result = await execFileAsync(
        pythonCommand.command,
        [
          ...pythonCommand.argsPrefix,
          "-c",
          script,
          dbPath,
          date || "",
          JSON.stringify(tickers),
        ],
        {
          maxBuffer: 1024 * 1024 * 16,
          timeout: 30000,
        }
      );

      stdout = result.stdout;
      break;
    } catch (error) {
      errors.push(
        `${pythonCommand.command} ${pythonCommand.argsPrefix.join(" ")}: ${
          error.stderr || error.message
        }`
      );
    }
  }

  if (!stdout) {
    throw new Error(`Cannot run Python sqlite reader. ${errors.join(" | ")}`);
  }

  return JSON.parse(stdout || "[]");
}

async function requestIndexRows(symbol, token, tradingDate) {
  const url = buildIndexUrl(symbol, tradingDate);

  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000,
  });

  return {
    url,
    rows: res.data.data || [],
    raw: res.data,
  };
}

function buildIndexResult(item, rows) {
  const current = Number(rows[0]?.Close || rows[0]?.Value || 0);
  const previous = Number(rows[1]?.Close || rows[1]?.Value || current);

  const change = current - previous;
  const percent = previous ? (change / previous) * 100 : 0;

  return {
    name: item.name,
    value: formatNumber(current),
    change: `${formatChange(change)} (${formatChange(percent)}%)`,
    isUp: change >= 0,
    raw: {
      symbol: item.symbol,
      current,
      previous,
      change,
      percent,
      time: rows[0]?.Time,
      tradingDate: rows[0]?.TradingDate,
      fromCache: false,
    },
  };
}

async function fetchIndex(item, token, tradingDate) {
  let lastUrl = "";

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { url, rows } = await requestIndexRows(
        item.symbol,
        token,
        tradingDate
      );
      lastUrl = url;

      if (rows.length > 0) {
        const result = buildIndexResult(item, rows);
        lastGoodData.set(item.name, result);
        return result;
      }

      await sleep(300);
    } catch (error) {
      console.error(
        `${item.name} ${item.symbol} error:`,
        error.response?.data || error.message
      );

      await sleep(300);
    }
  }

  const cached = lastGoodData.get(item.name);

  if (cached) {
    return {
      ...cached,
      raw: {
        ...cached.raw,
        fromCache: true,
        message: "Using last good data because SSI returned empty",
      },
    };
  }

  return {
    name: item.name,
    value: "--",
    change: "--",
    isUp: true,
    raw: {
      symbol: item.symbol,
      url: lastUrl,
      message: "No data from SSI and no cache yet",
    },
  };
}

app.get("/api/indexes", async (req, res) => {
  try {
    const token = await getAccessToken();
    const tradingDate = getVietnamDate();

    const indexes = [];

    for (const item of SYMBOLS) {
      const indexData = await fetchIndex(item, token, tradingDate);
      indexes.push(indexData);
      await sleep(500);
    }

    res.json({
      status: "success",
      data: indexes,
      tradingDate,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("SSI API error:", error.response?.data || error.message);

    res.status(500).json({
      status: "error",
      message: "Cannot load SSI index data",
      detail: error.response?.data || error.message,
    });
  }
});

app.post("/api/smdt-branch", async (req, res) => {
  const now = Date.now();

  try {
    if (smdtBranchCache) {
      const age = now - smdtBranchCacheTime;

      if (age < SMDT_CACHE_MS) {
        return res.json({
          ...smdtBranchCache,
          cache: true,
          cacheAgeSeconds: Math.floor(age / 1000),
        });
      }
    }

    const response = await axios.post(
      "https://stocktraders.vn/service/data/getSMDTBranch",
      {
        SMDTBranchRequest: {
          account: "StockTraders",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 40000,
      }
    );

    smdtBranchCache = response.data;
    smdtBranchCacheTime = now;

    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });

    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify(
        {
          updatedAt: new Date(now).toISOString(),
          data: response.data,
        },
        null,
        2
      )
    );

    return res.json({
      ...response.data,
      cache: false,
      cacheAgeSeconds: 0,
    });
  } catch (error) {
    console.error(
      "SMDT Branch API error:",
      error.response?.data || error.message
    );

    if (smdtBranchCache) {
      return res.json({
        ...smdtBranchCache,
        cache: true,
        stale: true,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Cannot load SMDT Branch data",
      detail: error.response?.data || error.message,
    });
  }
});

app.post("/api/smdt-ticker", async (req, res) => {
  const now = Date.now();

  try {
    if (smdtTickerCache) {
      const age = now - smdtTickerCacheTime;

      if (age < SMDT_CACHE_MS) {
        return res.json({
          ...smdtTickerCache,
          cache: true,
          cacheAgeSeconds: Math.floor(age / 1000),
        });
      }
    }

    const response = await axios.post(
      "https://stocktraders.vn/service/data/getSMDTTicker",
      {
        SMDTTickerRequest: {
          account: "StockTraders",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 40000,
      }
    );

    smdtTickerCache = response.data;
    smdtTickerCacheTime = now;

    fs.mkdirSync(path.dirname(TICKER_CACHE_FILE), { recursive: true });

    fs.writeFileSync(
      TICKER_CACHE_FILE,
      JSON.stringify(
        {
          updatedAt: new Date(now).toISOString(),
          data: response.data,
        },
        null,
        2
      )
    );

    return res.json({
      ...response.data,
      cache: false,
      cacheAgeSeconds: 0,
    });
  } catch (error) {
    console.error(
      "SMDT Ticker API error:",
      error.response?.data || error.message
    );

    if (smdtTickerCache) {
      return res.json({
        ...smdtTickerCache,
        cache: true,
        stale: true,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Cannot load SMDT Ticker data",
      detail: error.response?.data || error.message,
    });
  }
});

app.post("/api/cash-flow-branch", async (req, res) => {
  const now = Date.now();

  try {
    if (cashFlowBranchCache) {
      const age = now - cashFlowBranchCacheTime;

      if (age < SMDT_CACHE_MS) {
        return res.json({
          ...cashFlowBranchCache,
          cache: true,
          cacheAgeSeconds: Math.floor(age / 1000),
        });
      }
    }

    const response = await axios.post(
      "https://stocktraders.vn/service/data/getCashFlowBranch",
      {
        CashFlowBranchRequest: {
          account: "StockTraders",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 40000,
      }
    );

    cashFlowBranchCache = response.data;
    cashFlowBranchCacheTime = now;

    fs.mkdirSync(path.dirname(CASH_FLOW_BRANCH_CACHE_FILE), {
      recursive: true,
    });

    fs.writeFileSync(
      CASH_FLOW_BRANCH_CACHE_FILE,
      JSON.stringify(
        {
          updatedAt: new Date(now).toISOString(),
          data: response.data,
        },
        null,
        2
      )
    );

    return res.json({
      ...response.data,
      cache: false,
      cacheAgeSeconds: 0,
    });
  } catch (error) {
    console.error(
      "Cash Flow Branch API error:",
      error.response?.data || error.message
    );

    if (cashFlowBranchCache) {
      return res.json({
        ...cashFlowBranchCache,
        cache: true,
        stale: true,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Cannot load Cash Flow Branch data",
      detail: error.response?.data || error.message,
    });
  }
});

app.post("/api/cash-flow-ticker", async (req, res) => {
  const now = Date.now();

  try {
    if (cashFlowTickerCache) {
      const age = now - cashFlowTickerCacheTime;

      if (age < SMDT_CACHE_MS) {
        return res.json({
          ...cashFlowTickerCache,
          cache: true,
          cacheAgeSeconds: Math.floor(age / 1000),
        });
      }
    }

    const response = await axios.post(
      "https://stocktraders.vn/service/data/getCashFlowTicker",
      {
        CashFlowTickerRequest: {
          account: "StockTraders",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 40000,
      }
    );

    cashFlowTickerCache = response.data;
    cashFlowTickerCacheTime = now;

    fs.mkdirSync(path.dirname(CASH_FLOW_TICKER_CACHE_FILE), {
      recursive: true,
    });

    fs.writeFileSync(
      CASH_FLOW_TICKER_CACHE_FILE,
      JSON.stringify(
        {
          updatedAt: new Date(now).toISOString(),
          data: response.data,
        },
        null,
        2
      )
    );

    return res.json({
      ...response.data,
      cache: false,
      cacheAgeSeconds: 0,
    });
  } catch (error) {
    console.error(
      "Cash Flow Ticker API error:",
      error.response?.data || error.message
    );

    if (cashFlowTickerCache) {
      return res.json({
        ...cashFlowTickerCache,
        cache: true,
        stale: true,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Cannot load Cash Flow Ticker data",
      detail: error.response?.data || error.message,
    });
  }
});

app.post("/api/total-trade-real", async (req, res) => {
  const now = Date.now();

  try {
    if (totalTradeRealCache) {
      const age = now - totalTradeRealCacheTime;

      if (age < SMDT_CACHE_MS) {
        return res.json({
          ...totalTradeRealCache,
          cache: true,
          cacheAgeSeconds: Math.floor(age / 1000),
        });
      }
    }

    const response = await axios.post(
      "https://stocktraders.vn/service/data/getTotalTradeReal",
      {
        TotalTradeRealRequest: {
          account: "stocktraders2013",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 40000,
      }
    );

    totalTradeRealCache = response.data;
    totalTradeRealCacheTime = now;

    fs.mkdirSync(path.dirname(TOTAL_TRADE_REAL_CACHE_FILE), {
      recursive: true,
    });

    fs.writeFileSync(
      TOTAL_TRADE_REAL_CACHE_FILE,
      JSON.stringify(
        {
          updatedAt: new Date(now).toISOString(),
          data: response.data,
        },
        null,
        2
      )
    );

    return res.json({
      ...response.data,
      cache: false,
      cacheAgeSeconds: 0,
    });
  } catch (error) {
    console.error(
      "Total Trade Real API error:",
      error.response?.data || error.message
    );

    if (totalTradeRealCache) {
      return res.json({
        ...totalTradeRealCache,
        cache: true,
        stale: true,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Cannot load Total Trade Real data",
      detail: error.response?.data || error.message,
    });
  }
});

app.post("/api/stock-total-history", async (req, res) => {
  try {
    const tickers = Array.isArray(req.body?.tickers)
      ? req.body.tickers
          .map((ticker) => String(ticker || "").trim().toUpperCase())
          .filter(Boolean)
      : [];
    const uniqueTickers = Array.from(new Set(tickers)).slice(0, 500);
    const date = String(req.body?.date || "").trim();

    const dbPath = getStockTotalsDbPath();

    if (!fs.existsSync(dbPath)) {
      return res.status(500).json({
        status: "error",
        message: "stock_totals.db not found",
        dbPath,
        checkedPaths: STOCK_TOTALS_DB_CANDIDATES.map((candidate) =>
          path.resolve(candidate)
        ),
      });
    }

    const rows = await readHistoricalPrices(uniqueTickers, date);

    return res.json({
      status: "success",
      data: rows,
      dbPath,
    });
  } catch (error) {
    console.error("Stock totals DB error:", error.message);

    return res.status(500).json({
      status: "error",
      message: "Cannot load historical stock prices",
      detail: error.message,
      dbPath: getStockTotalsDbPath(),
    });
  }
});

app.get("/api/test-index", async (req, res) => {
  try {
    const token = await getAccessToken();
    const symbol = req.query.symbol || "HNXIndex";
    const tradingDate = getVietnamDate();

    const { url, rows, raw } = await requestIndexRows(
      symbol,
      token,
      tradingDate
    );

    res.json({
      status: "success",
      symbol,
      tradingDate,
      url,
      rows,
      raw,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      detail: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API proxy running at http://0.0.0.0:${PORT}`);
});
