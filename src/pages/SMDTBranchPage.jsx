import { useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Search,
  CalendarDays,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CORE_BRANCHES = [
  "Ngân hàng",
  "Chứng khoán",
  "BĐS Dân cư",
  "Thép",
  "Xây dựng",
  "Dầu khí",
];

const PAGE_SIZE = 25;

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getValueClass(value) {
  if (value === null || value === undefined || value === "") {
    return "bg-slate-200 text-slate-500";
  }

  const number = Number(value);

  // >= 70 xanh
  if (number >= 70) {
    return "bg-green-100 text-green-800";
  }

  // 60-69 vàng
  if (number >= 60) {
    return "bg-yellow-100 text-yellow-800";
  }

  // < 60 đỏ
  return "bg-red-100 text-red-700";
}

export default function SMDTBranchPage({
  activePage,
  setActivePage,
  smdtBranchData,
  smdtBranchLoading,
  smdtBranchError,
  reloadSMDTBranch,
}) {
  const rawData = smdtBranchData || [];

  const [activeTab, setActiveTab] = useState("core");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("2024-12-31");
  const [toDate, setToDate] = useState("2025-05-07");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");

  const branches = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return rawData
      .filter((item) => {
        const isCore = CORE_BRANCHES.includes(item.keyName);

        if (activeTab === "core" && !isCore) return false;
        if (activeTab === "sub" && isCore) return false;

        if (!keyword) return true;

        return item.keyName.toLowerCase().includes(keyword);
      })
      .sort((a, b) => {
        const aIndex = CORE_BRANCHES.indexOf(a.keyName);
        const bIndex = CORE_BRANCHES.indexOf(b.keyName);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        return a.keyName.localeCompare(b.keyName);
      });
  }, [rawData, activeTab, search]);

  const allDates = useMemo(() => {
    const dateSet = new Set();

    branches.forEach((branch) => {
      branch.smdts?.forEach((item) => {
        if (item.date >= fromDate && item.date <= toDate) {
          dateSet.add(item.date);
        }
      });
    });

    return Array.from(dateSet).sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [branches, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(allDates.length / PAGE_SIZE));

  const pageDates = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allDates.slice(start, start + PAGE_SIZE);
  }, [allDates, page]);

  const valueMap = useMemo(() => {
    const map = {};

    branches.forEach((branch) => {
      map[branch.keyName] = {};

      branch.smdts?.forEach((item) => {
        map[branch.keyName][item.date] = item.smdt;
      });
    });

    return map;
  }, [branches]);

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Header />

      <div className="flex min-h-[calc(100vh-80px)]">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <div className="flex flex-1 flex-col">
          <main className="flex-1 bg-white p-6 text-slate-950">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black tracking-wide">
                    BẢNG SMDT NGÀNH
                  </h1>

                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-purple-500 text-sm font-bold text-purple-600">
                    i
                  </span>
                </div>

                <button
                  onClick={reloadSMDTBranch}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  {smdtBranchLoading ? "Đang tải..." : "Làm mới"}
                </button>
              </div>

              <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="flex overflow-hidden rounded-lg border border-slate-200">
                  <button
                    onClick={() => {
                      setActiveTab("core");
                      resetPage();
                    }}
                    className={[
                      "px-7 py-3 text-sm font-bold",
                      activeTab === "core"
                        ? "bg-purple-700 text-white"
                        : "bg-white text-slate-900",
                    ].join(" ")}
                  >
                    Chủ lực{" "}
                    <span className="ml-2 rounded-full bg-white/20 px-2">
                      6
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("sub");
                      resetPage();
                    }}
                    className={[
                      "px-7 py-3 text-sm font-bold",
                      activeTab === "sub"
                        ? "bg-purple-700 text-white"
                        : "bg-white text-slate-900",
                    ].join(" ")}
                  >
                    Ngành phụ{" "}
                    <span className="ml-2 rounded-full bg-slate-100 px-2 text-slate-700">
                      {Math.max(0, rawData.length - 6)}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
                  <CalendarDays size={18} />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      resetPage();
                    }}
                    className="outline-none"
                  />
                  <span>→</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      resetPage();
                    }}
                    className="outline-none"
                  />
                </div>

                <div className="rounded-lg border border-slate-200 px-4 py-3 text-sm">
                  Hiển thị: <b>{PAGE_SIZE} phiên</b>
                </div>

                <div className="flex overflow-hidden rounded-lg border border-slate-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={[
                      "px-4 py-3",
                      viewMode === "grid" ? "bg-purple-100 text-purple-700" : "",
                    ].join(" ")}
                  >
                    <LayoutGrid size={20} />
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={[
                      "px-4 py-3",
                      viewMode === "list" ? "bg-purple-100 text-purple-700" : "",
                    ].join(" ")}
                  >
                    <List size={20} />
                  </button>
                </div>

                <div className="ml-auto flex min-w-65 items-center gap-2 rounded-lg border border-slate-200 px-4 py-3">
                  <Search size={18} />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                    placeholder="Tìm ngành..."
                    className="w-full outline-none"
                  />
                </div>
              </div>

              {smdtBranchError && (
                <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {smdtBranchError}
                </div>
              )}

              <div className="overflow-auto rounded-xl border border-slate-200">
                <table className="min-w-full border-collapse text-center">
                  <thead>
                    <tr className="bg-white">
                      <th className="sticky left-0 z-10 border-b border-r border-slate-200 bg-white px-8 py-5 text-base font-black">
                        DATE ↓
                      </th>

                      {branches.map((branch) => (
                        <th
                          key={branch.keyName}
                          className="min-w-45 border-b border-r border-slate-200 px-8 py-5 text-base font-black uppercase"
                        >
                          {branch.keyName}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {pageDates.map((date) => (
                      <tr key={date}>
                        <td className="sticky left-0 z-10 border-r border-slate-100 bg-white px-8 py-5 text-xl font-medium">
                          {formatDate(date)}
                        </td>

                        {branches.map((branch) => {
                          const value = valueMap[branch.keyName]?.[date];

                          return (
                            <td
                              key={`${branch.keyName}-${date}`}
                              className="border-r border-slate-100 px-8 py-4"
                            >
                              <span
                                className={[
                                  "inline-flex min-w-23 justify-center rounded-md px-4 py-2 text-lg font-bold",
                                  getValueClass(value),
                                ].join(" ")}
                              >
                                {value === null || value === undefined
                                  ? "-"
                                  : Number(value).toFixed(2)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600">
                    <span className="font-medium">CHÚ THÍCH:</span>
                    <span className="flex items-center gap-2">
                        <i className="h-4 w-4 rounded bg-green-100"></i>
                        <span>≥ 70</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <i className="h-4 w-4 rounded bg-yellow-100"></i>
                        <span>60 - 69</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <i className="h-4 w-4 rounded bg-red-100"></i>
                        <span>&lt; 60</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <i className="h-4 w-4 rounded bg-slate-300"></i>
                        <span>NULL / Không có dữ liệu</span>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="rounded-lg px-3 py-2 disabled:opacity-40"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <span className="rounded-lg bg-purple-700 px-4 py-2 font-bold text-white">
                    {page}
                  </span>

                  <span className="px-2 text-slate-500">/ {totalPages}</span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    className="rounded-lg px-3 py-2 disabled:opacity-40"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}