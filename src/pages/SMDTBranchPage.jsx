import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useMemo, useState } from "react";
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
  "Sóng ngành Vin",
];

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatInputDateInVietnam(date) {
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

  return `${values.year}-${values.month}-${values.day}`;
}

function getDefaultDateRange() {
  const to = new Date();
  const from = new Date(to);

  from.setFullYear(from.getFullYear() - 1);

  return {
    fromDate: formatInputDateInVietnam(from),
    toDate: formatInputDateInVietnam(to),
  };
}

function getValueClass(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const number = Number(value);

  if (number >= 100) {
    return "bg-green-200 text-green-800";
  }

  if (number >= 70) {
    return "bg-green-100 text-green-700";
  }

  if (number >= 20) {
    return "bg-yellow-100 text-yellow-800";
  }

  return "bg-red-100 text-red-700";
}

export default function SMDTBranchPage({
  activePage,
  setActivePage,
  smdtBranchData,
  smdtBranchError,
}) {
  const rawData = useMemo(() => smdtBranchData || [], [smdtBranchData]);
  const defaultDateRange = useMemo(() => getDefaultDateRange(), []);

  const [activeTab, setActiveTab] = useState("core");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState(defaultDateRange.fromDate);
  const [toDate, setToDate] = useState(defaultDateRange.toDate);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [dateSort, setDateSort] = useState("desc");
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

    return Array.from(dateSet).sort((a, b) => b.localeCompare(a));
  }, [branches, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(allDates.length / pageSize));

  const pageDates = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allDates
      .slice(start, start + pageSize)
      .sort((a, b) =>
        dateSort === "desc" ? b.localeCompare(a) : a.localeCompare(b)
      );
  }, [allDates, page, pageSize, dateSort]);

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

  const isCompactTable = branches.length <= CORE_BRANCHES.length;

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Header />

      <div className="app-shell flex bg-[#020817] overflow-hidden max-[900px]:flex-col">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-hidden bg-[#020817] px-2 pb-3 pt-0 md:px-3 md:pb-4 md:pt-0 lg:px-3 lg:pb-5 lg:pt-0 text-slate-950 max-[1536px]:px-2 max-[1536px]:pb-3 max-[1536px]:pt-0 max-[1280px]:px-2 max-[1280px]:pb-3 max-[1280px]:pt-0">
            <div className="w-full max-w-full overflow-hidden rounded-2xl lg:rounded-3xl border border-slate-200 bg-white p-3 md:p-4 lg:p-5 shadow-sm max-[1536px]:rounded-2xl max-[1536px]:p-3 max-[1280px]:p-3">
              <div className="mb-4 md:mb-5 flex items-center justify-between gap-3 md:gap-4 max-[1536px]:mb-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-[18px] md:text-[21px] lg:text-[23px] font-[700] leading-none tracking-wide max-[1536px]:text-[19px] max-[1280px]:text-[18px]">
                    BẢNG SMDT NGÀNH
                  </h1>

                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-purple-500 text-[10px] font-bold text-purple-600">
                    i
                  </span>
                </div>
              </div>

              <div className="mb-4 md:mb-5 flex flex-wrap xl:flex-nowrap items-center gap-3 md:gap-4 max-[1536px]:mb-3 max-[1536px]:gap-2">
                <div className="flex w-full md:w-auto overflow-hidden rounded-2xl border border-slate-200 bg-white max-[1536px]:rounded-xl">
                  <button
                    onClick={() => {
                      setActiveTab("core");
                      resetPage();
                    }}
                    className={[
                      "flex-1 md:flex-none px-4 md:px-7 py-3 text-sm font-bold max-[1536px]:px-5 max-[1536px]:py-2.5 max-[1536px]:text-xs",
                      activeTab === "core"
                        ? "bg-purple-700 text-white rounded-2xl"
                        : "bg-white text-slate-900"
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
                      "flex-1 md:flex-none px-4 md:px-7 py-3 text-sm font-bold max-[1536px]:px-5 max-[1536px]:py-2.5 max-[1536px]:text-xs",
                      activeTab === "sub"
                        ? "bg-purple-700 text-white rounded-2xl"
                        : "bg-white text-slate-900"
                    ].join(" ")}
                  >
                    Ngành phụ{" "}
                    <span className="ml-2 rounded-full bg-slate-100 px-2 text-slate-700">
                      {Math.max(0, rawData.length - 6)}
                    </span>
                  </button>
                </div>

                <div className="flex w-full md:w-auto shrink-0 items-center gap-2 rounded-2xl border border-slate-200 px-3 md:px-4 py-3 max-[1536px]:rounded-xl max-[1536px]:px-3 max-[1536px]:py-2 max-[1536px]:text-xs">
                  <CalendarDays size={18} />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      resetPage();
                    }}
                    className="w-[128px] shrink-0 text-center outline-none text-sm md:text-base max-[1536px]:w-[112px] max-[1536px]:text-xs"
                  />
                  <span className="shrink-0">→</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      resetPage();
                    }}
                    className="w-[128px] shrink-0 text-center outline-none text-sm md:text-base max-[1536px]:w-[112px] max-[1536px]:text-xs"
                  />
                </div>

                <div className="flex w-full md:w-auto items-center gap-2 rounded-2xl border border-slate-200 px-3 md:px-4 py-3 text-sm max-[1536px]:rounded-xl max-[1536px]:px-3 max-[1536px]:py-2.5 max-[1536px]:text-xs">
                  <span>Hiển thị</span>

                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={pageSize}
                    onChange={(e) => {
                      const nextPageSize = Math.min(
                        500,
                        Math.max(1, Number(e.target.value) || 25)
                      );

                      setPageSize(nextPageSize);
                      setPage(1);
                    }}
                    className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-center outline-none max-[1536px]:w-16"
                  />

                  <span>phiên</span>
                </div>

                <div className="flex w-full md:w-auto overflow-hidden rounded-2xl border border-slate-200 max-[1536px]:rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={[
                      "flex-1 md:flex-none px-4 py-3 max-[1536px]:px-3 max-[1536px]:py-2.5",
                      viewMode === "grid" ? "bg-purple-100 text-purple-700" : "",
                    ].join(" ")}
                  >
                    <LayoutGrid size={20} />
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={[
                      "flex-1 md:flex-none px-4 py-3 max-[1536px]:px-3 max-[1536px]:py-2.5",
                      viewMode === "list" ? "bg-purple-100 text-purple-700" : "",
                    ].join(" ")}
                  >
                    <List size={20} />
                  </button>
                </div>

                <div className="flex w-full md:ml-0 md:w-48 xl:ml-auto items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 max-[1536px]:w-42 max-[1536px]:rounded-xl max-[1536px]:px-3 max-[1536px]:py-2 max-[1180px]:w-auto">
                  <Search size={18} className="shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                    placeholder="Tìm ngành..."
                    className="min-w-0 flex-1 outline-none max-[1180px]:hidden"
                  />
                </div>
              </div>

              {smdtBranchError && (
                <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-600">
                  {smdtBranchError}
                </div>
              )}

              <div className="w-full max-w-full overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-200 max-[1536px]:rounded-xl">
                <table
                  className={[
                    "smdt-table border-collapse text-center",
                    isCompactTable ? "smdt-table-fit" : "smdt-table-scroll",
                  ].join(" ")}
                >
                  <thead>
                    <tr className="bg-white">
                      <th className="smdt-date-cell sticky left-0 z-10 border-b border-r border-slate-200 bg-white px-4 md:px-6 lg:px-8 py-4 lg:py-5 text-[11px] md:text-xs font-black max-[1536px]:px-1.5 max-[1536px]:py-2 max-[1536px]:text-[9px] max-[1280px]:text-[8px]">
                        <button
                          type="button"
                          onClick={() => {
                            setDateSort((current) =>
                              current === "desc" ? "asc" : "desc"
                            );
                            setPage(1);
                          }}
                          className="mx-auto flex items-center justify-center gap-1 font-black leading-none"
                          title="Sắp xếp ngày"
                        >
                          <span>DATE</span>
                          <span>{dateSort === "desc" ? "↓" : "↑"}</span>
                        </button>
                      </th>

                      {branches.map((branch) => (
                        <th
                          key={branch.keyName}
                          className="smdt-branch-cell border-b border-r border-slate-200 px-3 md:px-4 lg:px-5 py-3 lg:py-4 text-[10px] md:text-[11px] lg:text-xs font-[700] leading-snug normal-case max-[1536px]:px-1 max-[1536px]:py-1.5 max-[1536px]:text-[8px] max-[1280px]:text-[7px]"
                        >
                          {branch.keyName}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {pageDates.map((date) => (
                      <tr key={date}>
                        <td className="smdt-date-cell sticky left-0 z-10 border-r border-slate-100 bg-white px-4 md:px-6 lg:px-8 py-4 lg:py-5 text-[11px] md:text-xs lg:text-sm font-[700] leading-none max-[1536px]:px-1.5 max-[1536px]:py-2 max-[1536px]:text-[9px] max-[1280px]:text-[8px]">
                          {formatDate(date)}
                        </td>

                        {branches.map((branch) => {
                          const value = valueMap[branch.keyName]?.[date];

                          return (
                            <td
                              key={`${branch.keyName}-${date}`}
                              className="smdt-branch-cell border-r border-slate-100 px-4 md:px-6 lg:px-8 py-3 lg:py-4 max-[1536px]:px-1.5 max-[1536px]:py-1.5"
                            >
                              <span
                                className={[
                                  "inline-flex min-w-[60px] md:min-w-[68px] lg:min-w-[76px] justify-center rounded-xl px-2.5 lg:px-3 py-1.5 lg:py-2 text-[11px] md:text-xs lg:text-sm font-[700] leading-none max-[1536px]:min-w-[40px] max-[1536px]:rounded-md max-[1536px]:px-1.5 max-[1536px]:py-1 max-[1536px]:text-[9px] max-[1280px]:min-w-[36px] max-[1280px]:text-[8px]",
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

              <div className="mt-5 md:mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs md:text-sm text-slate-600">
                  <span className="font-medium">CHÚ THÍCH:</span>
                  <span className="flex items-center gap-2">
                    <i className="h-4 w-4 rounded bg-green-200"></i>
                    <span>≥ 100</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="h-4 w-4 rounded bg-green-100"></i>
                    <span>70 - 99</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="h-4 w-4 rounded bg-yellow-100"></i>
                    <span>20 - 69</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="h-4 w-4 rounded bg-red-100"></i>
                    <span>&lt; 20</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="rounded-2xl px-3 py-2 disabled:opacity-40"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <span className="rounded-2xl bg-purple-700 px-4 py-2 font-bold text-white">
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
