import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import SMDTBranchPage from "./pages/SMDTBranchPage";

const SMDT_REFRESH_MS = 15 * 60 * 1000;

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [smdtBranchData, setSmdtBranchData] = useState([]);
  const [smdtBranchLoading, setSmdtBranchLoading] = useState(false);
  const [smdtBranchError, setSmdtBranchError] = useState("");

  async function loadSMDTBranch() {
    try {
      setSmdtBranchLoading(true);
      setSmdtBranchError("");

      const res = await fetch("http://localhost:4005/api/smdt-branch", {
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

  useEffect(() => {
    const firstLoadTimer = setTimeout(() => {
      loadSMDTBranch();
    }, 0);

    const intervalTimer = setInterval(() => {
      loadSMDTBranch();
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
        smdtBranchLoading={smdtBranchLoading}
        smdtBranchError={smdtBranchError}
        reloadSMDTBranch={loadSMDTBranch}
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