/* global process */

import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();

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
const SMDT_BRANCH_CACHE_MS = 15 * 60 * 1000;

let smdtBranchCache = null;
let smdtBranchCacheTime = 0;

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

const SYMBOLS = [
  { name: "VNINDEX", symbol: "VNIndex" },
  { name: "HNXINDEX", symbol: "HNXIndex" },
  { name: "UPINDEX", symbol: "HNXUPCOMINDEX" },
];

const today = "16/06/2026";

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

function buildIndexUrl(symbol) {
  return (
    "https://fc-data.ssi.com.vn/api/v2/Market/IntradayOhlc" +
    `?symbol=${symbol}` +
    `&fromDate=${today}` +
    `&toDate=${today}` +
    "&pageIndex=1" +
    "&pageSize=2" +
    "&ascending=false" +
    "&resollution=1"
  );
}

async function requestIndexRows(symbol, token) {
  const url = buildIndexUrl(symbol);

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

async function fetchIndex(item, token) {
  let lastUrl = "";

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { url, rows } = await requestIndexRows(item.symbol, token);
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

    const indexes = [];

    for (const item of SYMBOLS) {
      const indexData = await fetchIndex(item, token);
      indexes.push(indexData);
      await sleep(500);
    }

    res.json({
      status: "success",
      data: indexes,
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

      if (age < SMDT_BRANCH_CACHE_MS) {
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

app.get("/api/test-index", async (req, res) => {
  try {
    const token = await getAccessToken();
    const symbol = req.query.symbol || "HNXIndex";

    const { url, rows, raw } = await requestIndexRows(symbol, token);

    res.json({
      status: "success",
      symbol,
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