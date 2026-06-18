import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import SMDTBranchPage from "./pages/SMDTBranchPage";
import SMDTTickerPage from "./pages/SMDTTickerPage";

const SMDT_REFRESH_MS = 3 * 60 * 1000;

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [smdtBranchData, setSmdtBranchData] = useState([]);
  const [, setSmdtBranchLoading] = useState(false);
  const [smdtBranchError, setSmdtBranchError] = useState("");
  const [smdtTickerData, setSmdtTickerData] = useState([]);
  const [, setSmdtTickerLoading] = useState(false);
  const [smdtTickerError, setSmdtTickerError] = useState("");
  const [branchPaths, setBranchPaths] = useState([]);
  const [branchPathError, setBranchPathError] = useState("");

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

  async function loadBranchPath() {
    try {
      setBranchPathError("");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/branch-path`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Cannot load branch path data");
      }

      setBranchPaths(Array.isArray(json.data) ? json.data : []);
    } catch (error) {
      setBranchPathError(error.message || "Cannot load branch path data");
    }
  }

  useEffect(() => {
    const firstLoadTimer = setTimeout(() => {
      loadSMDTBranch();
      loadSMDTTicker();
      loadBranchPath();
    }, 0);

    const intervalTimer = setInterval(() => {
      loadSMDTBranch();
      loadSMDTTicker();
      loadBranchPath();
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
        smdtTickerError={smdtTickerError || branchPathError}
        branchPaths={branchPaths}
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
