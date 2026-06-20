import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import SMDTBranchPage from "./pages/SMDTBranchPage";
import SMDTTickerPage from "./pages/SMDTTickerPage";
import CashFlowBranchPage from "./pages/CashFlowBranchPage";
import CashFlowTickerPage from "./pages/CashFlowTickerPage";
import TopStrongStocksPage from "./pages/TopStrongStocksPage";

const SMDT_REFRESH_MS = 3 * 60 * 1000;

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [smdtBranchData, setSmdtBranchData] = useState([]);
  const [, setSmdtBranchLoading] = useState(false);
  const [smdtBranchError, setSmdtBranchError] = useState("");
  const [smdtTickerData, setSmdtTickerData] = useState([]);
  const [, setSmdtTickerLoading] = useState(false);
  const [smdtTickerError, setSmdtTickerError] = useState("");
  const [cashFlowBranchData, setCashFlowBranchData] = useState([]);
  const [, setCashFlowBranchLoading] = useState(false);
  const [cashFlowBranchError, setCashFlowBranchError] = useState("");
  const [cashFlowTickerData, setCashFlowTickerData] = useState([]);
  const [, setCashFlowTickerLoading] = useState(false);
  const [cashFlowTickerError, setCashFlowTickerError] = useState("");
  const [totalTradeRealData, setTotalTradeRealData] = useState([]);
  const [, setTotalTradeRealLoading] = useState(false);
  const [totalTradeRealError, setTotalTradeRealError] = useState("");

  async function loadSMDTBranch() {
    try {
      setSmdtBranchLoading(true);
      setSmdtBranchError("");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/smdt-branch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Cannot load SMDT Branch data");
      }

      setSmdtBranchData(json?.SMDTBranchReply?.SMDTDatas || []);
    } catch (error) {
      setSmdtBranchError(error.message || "Cannot load SMDT Branch data");
    } finally {
      setSmdtBranchLoading(false);
    }
  }

  async function loadSMDTTicker() {
    try {
      setSmdtTickerLoading(true);
      setSmdtTickerError("");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/smdt-ticker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Cannot load SMDT Ticker data");
      }

      setSmdtTickerData(json?.SMDTTickerReply?.SMDTDatas || []);
    } catch (error) {
      setSmdtTickerError(error.message || "Cannot load SMDT Ticker data");
    } finally {
      setSmdtTickerLoading(false);
    }
  }

  async function loadCashFlowBranch() {
    try {
      setCashFlowBranchLoading(true);
      setCashFlowBranchError("");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cash-flow-branch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Cannot load Cash Flow Branch data");
      }

      setCashFlowBranchData(
        json?.CashFlowBranchReply?.cashFlowBranchs || []
      );
    } catch (error) {
      setCashFlowBranchError(
        error.message || "Cannot load Cash Flow Branch data"
      );
    } finally {
      setCashFlowBranchLoading(false);
    }
  }

  async function loadCashFlowTicker() {
    try {
      setCashFlowTickerLoading(true);
      setCashFlowTickerError("");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cash-flow-ticker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Cannot load Cash Flow Ticker data");
      }

      setCashFlowTickerData(
        json?.CashFlowTickerReply?.cashFlowTickers ||
          json?.CashFlowTickerRequest?.cashFlowTickers ||
          []
      );
    } catch (error) {
      setCashFlowTickerError(
        error.message || "Cannot load Cash Flow Ticker data"
      );
    } finally {
      setCashFlowTickerLoading(false);
    }
  }

  async function loadTotalTradeReal() {
    try {
      setTotalTradeRealLoading(true);
      setTotalTradeRealError("");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/total-trade-real`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Cannot load Total Trade Real data");
      }

      setTotalTradeRealData(
        json?.TotalTradeRealReply?.stockTotalReals || []
      );
    } catch (error) {
      setTotalTradeRealError(
        error.message || "Cannot load Total Trade Real data"
      );
    } finally {
      setTotalTradeRealLoading(false);
    }
  }

  useEffect(() => {
    const firstLoadTimer = setTimeout(() => {
      loadSMDTBranch();
      loadSMDTTicker();
      loadCashFlowBranch();
      loadCashFlowTicker();
      loadTotalTradeReal();
    }, 0);

    const intervalTimer = setInterval(() => {
      loadSMDTBranch();
      loadSMDTTicker();
      loadCashFlowBranch();
      loadCashFlowTicker();
      loadTotalTradeReal();
    }, SMDT_REFRESH_MS);

    return () => {
      clearTimeout(firstLoadTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  if (activePage === "smdt-branch") {
    return (
      <SMDTBranchPage
        activePage={activePage}
        setActivePage={setActivePage}
        smdtBranchData={smdtBranchData}
        smdtBranchError={smdtBranchError}
      />
    );
  }

  if (activePage === "smdt-ticker") {
    return (
      <SMDTTickerPage
        activePage={activePage}
        setActivePage={setActivePage}
        smdtTickerData={smdtTickerData}
        smdtTickerError={smdtTickerError}
      />
    );
  }

  if (activePage === "cash-flow-branch") {
    return (
      <CashFlowBranchPage
        activePage={activePage}
        setActivePage={setActivePage}
        cashFlowBranchData={cashFlowBranchData}
        cashFlowBranchError={cashFlowBranchError}
      />
    );
  }

  if (activePage === "cash-flow-ticker") {
    return (
      <CashFlowTickerPage
        activePage={activePage}
        setActivePage={setActivePage}
        cashFlowTickerData={cashFlowTickerData}
        cashFlowTickerError={cashFlowTickerError}
      />
    );
  }

  if (activePage === "top-strong-stocks") {
    return (
      <TopStrongStocksPage
        activePage={activePage}
        setActivePage={setActivePage}
        smdtBranchData={smdtBranchData}
        smdtTickerData={smdtTickerData}
        cashFlowBranchData={cashFlowBranchData}
        cashFlowTickerData={cashFlowTickerData}
        totalTradeRealData={totalTradeRealData}
        totalTradeRealError={totalTradeRealError}
      />
    );
  }

  return (
    <Dashboard
      activePage={activePage}
      setActivePage={setActivePage}
    />
  );
}

export default App;
