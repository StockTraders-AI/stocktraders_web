import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import branchPaths from "../data/branchPaths.json";
import { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

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

function getStatusClass(content) {
  const normalized = normalizeText(content);

  if (normalized.includes("nhen nhom")) {
    return "bg-lime-100 text-lime-800";
  }

  if (normalized.includes("tiep tuc") && normalized.includes("do vao")) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalized.includes("dang") && normalized.includes("thoat ra")) {
    return "bg-orange-100 text-orange-700";
  }

  if (normalized.includes("tiep tuc") && normalized.includes("thoat ra")) {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

function getStatusLabel(content) {
  const normalized = normalizeText(content);

  if (normalized.includes("nhen nhom")) return "Nhen nhóm vào";
  if (normalized.includes("tiep tuc") && normalized.includes("do vao")) {
    return "Tiếp tục vào";
  }
  if (normalized.includes("dang") && normalized.includes("thoat ra")) {
    return "Đang thoát ra";
  }
  if (normalized.includes("tiep tuc") && normalized.includes("thoat ra")) {
    return "Tiếp tục thoát";
  }

  return content || "-";
}

function getCellTitle(value) {
  if (!value) return "";

  return [
    value.ticker,
    value.type,
    value.price !== undefined && value.price !== null ? `Giá: ${value.price}` : "",
    value.percent ? `Biến động: ${value.percent}` : "",
    value.content,
  ]
    .filter(Boolean)
    .join(" | ");
}

export default function CashFlowTickerPage({
  activePage,
  setActivePage,
  cashFlowTickerData,
  cashFlowTickerError,
}) {
  const rawData = useMemo(() => cashFlowTickerData || [], [cashFlowTickerData]);
  const defaultDateRange = useMemo(() => getDefaultDateRange(), []);

  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [fromDate, setFromDate] = useState(defaultDateRange.fromDate);
  const [toDate, setToDate] = useState(defaultDateRange.toDate);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [dateSort, setDateSort] = useState("desc");

  const tickers = useMemo(() => {
    const keyword = normalizeText(search);
    const selectedBranchData = branchPaths.find(
      (branch) => branch.name === selectedBranch
    );
    const selectedTickerSet = selectedBranchData
      ? new Set(selectedBranchData.tickers || [])
      : null;
    const tickerMap = new Map();

    rawData.forEach((dateGroup) => {
      dateGroup.cashTickerDatas?.forEach((item) => {
        if (!tickerMap.has(item.ticker)) {
          tickerMap.set(item.ticker, item);
        }
      });
    });

    return Array.from(tickerMap.values())
      .filter((item) => {
        if (selectedTickerSet && !selectedTickerSet.has(item.ticker)) {
          return false;
        }

        if (!keyword) return true;

        return [item.ticker, item.type]
          .filter(Boolean)
          .some((value) => normalizeText(value).includes(keyword));
      })
      .sort((a, b) => a.ticker.localeCompare(b.ticker));
  }, [rawData, search, selectedBranch]);

  const allDates = useMemo(() => {
    return rawData
      .map((dateGroup) => dateGroup.date)
      .filter((date) => date && date >= fromDate && date <= toDate)
      .sort((a, b) => b.localeCompare(a));
  }, [rawData, fromDate, toDate]);

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

    rawData.forEach((dateGroup) => {
      if (!dateGroup.date) return;

      map[dateGroup.date] = {};

      dateGroup.cashTickerDatas?.forEach((item) => {
        map[dateGroup.date][item.ticker] = item;
      });
    });

    return map;
  }, [rawData]);

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
                  <h1 className="st-page-title">
                    BẢNG DÒNG TIỀN MÃ
                  </h1>

                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-purple-500 text-[10px] font-bold text-purple-600">
                    i
                  </span>
                </div>
              </div>

              <div className="mb-4 md:mb-5 flex flex-wrap xl:flex-nowrap items-center gap-3 md:gap-4 max-[1536px]:mb-3 max-[1536px]:gap-2">
                <div className="flex w-full md:w-auto shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200 px-3 md:px-3 py-2.5 st-toolbar-control max-[1536px]:rounded-xl max-[1536px]:px-2.5 max-[1536px]:py-1.5">
                  <CalendarDays className="h-4 w-4 shrink-0 max-[1536px]:h-3.5 max-[1536px]:w-3.5" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      resetPage();
                    }}
                    className="w-[112px] shrink-0 text-center outline-none st-toolbar-input max-[1536px]:w-[96px]"
                  />
                  <span className="shrink-0">→</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      resetPage();
                    }}
                    className="w-[112px] shrink-0 text-center outline-none st-toolbar-input max-[1536px]:w-[96px]"
                  />
                </div>

                <div className="flex w-full md:w-auto items-center gap-2 rounded-2xl border border-slate-200 px-3 md:px-4 py-3 st-toolbar-control max-[1536px]:rounded-xl max-[1536px]:px-3 max-[1536px]:py-2.5">
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

                <div className="flex w-full md:w-56 lg:w-60 items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 st-toolbar-control max-[1536px]:w-48 max-[1536px]:rounded-xl max-[1536px]:px-3 max-[1536px]:py-2 max-[1180px]:w-auto">
                  <span className="shrink-0">Ngành</span>
                  <select
                    value={selectedBranch}
                    onChange={(e) => {
                      setSelectedBranch(e.target.value);
                      resetPage();
                    }}
                    className="min-w-0 flex-1 appearance-none rounded-lg bg-white px-2 py-1 st-toolbar-select text-slate-900 outline-none"
                  >
                    <option value="">
                      {branchPaths.length ? "Tất cả ngành" : "Đang tải ngành..."}
                    </option>
                    {!branchPaths.length && (
                      <option value="" disabled>
                        Chưa có dữ liệu ngành
                      </option>
                    )}
                    {branchPaths.map((branch) => (
                      <option key={branch.path || branch.name} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex w-full md:ml-0 md:w-40 xl:ml-auto items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 max-[1536px]:w-36 max-[1536px]:rounded-xl max-[1536px]:px-3 max-[1536px]:py-2 max-[1180px]:w-auto">
                  <Search size={18} className="shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                    placeholder="Tìm mã..."
                    className="min-w-0 flex-1 st-toolbar-input outline-none max-[1180px]:hidden"
                  />
                </div>
              </div>

              {cashFlowTickerError && (
                <div className="mb-4 rounded-2xl bg-red-50 p-4 st-error text-red-600">
                  {cashFlowTickerError}
                </div>
              )}

              <div className="w-full max-w-full overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-200 max-[1536px]:rounded-xl">
                <table className="smdt-table smdt-table-scroll border-collapse text-center">
                  <thead>
                    <tr className="bg-white">
                      <th className="smdt-date-cell sticky left-0 z-10 border-b border-r border-slate-200 bg-white px-4 md:px-6 lg:px-8 py-4 lg:py-5 st-table-date-header max-[1536px]:px-1.5 max-[1536px]:py-2">
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

                      {tickers.map((ticker) => (
                        <th
                          key={ticker.ticker}
                          title={ticker.type}
                          className="smdt-branch-cell border-b border-r border-slate-200 px-4 md:px-6 lg:px-8 py-4 lg:py-5 st-table-col-header uppercase max-[1536px]:px-1.5 max-[1536px]:py-2"
                        >
                          {ticker.ticker}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {pageDates.map((date) => (
                      <tr key={date}>
                        <td className="smdt-date-cell sticky left-0 z-10 border-r border-slate-100 bg-white px-4 md:px-6 lg:px-8 py-4 lg:py-5 st-table-date-body max-[1536px]:px-1.5 max-[1536px]:py-2">
                          {formatDate(date)}
                        </td>

                        {tickers.map((ticker) => {
                          const value = valueMap[date]?.[ticker.ticker];

                          return (
                            <td
                              key={`${ticker.ticker}-${date}`}
                              className="smdt-branch-cell border-r border-slate-100 px-2 md:px-3 lg:px-4 py-3 lg:py-4 max-[1536px]:px-1.5 max-[1536px]:py-1.5"
                            >
                              <span
                                title={getCellTitle(value)}
                                className={[
                                  "inline-flex min-w-[88px] justify-center rounded-lg px-2 py-1.5 st-status-pill max-[1536px]:min-w-[68px] max-[1536px]:rounded-md max-[1536px]:px-1.5 max-[1536px]:py-1 max-[1280px]:min-w-[60px]",
                                  getStatusClass(value?.content),
                                ].join(" ")}
                              >
                                {getStatusLabel(value?.content)}
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
                <div className="flex flex-wrap items-center gap-3 md:gap-5 st-legend text-slate-600">
                  <span className="font-medium">CHÚ THÍCH:</span>
                  <span className="flex items-center gap-2">
                    <i className="h-4 w-4 rounded bg-lime-100"></i>
                    <span>Nhen nhóm vào</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="h-4 w-4 rounded bg-emerald-100"></i>
                    <span>Tiếp tục vào</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="h-4 w-4 rounded bg-orange-100"></i>
                    <span>Đang thoát ra</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="h-4 w-4 rounded bg-red-100"></i>
                    <span>Tiếp tục thoát</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
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
                    onClick={() =>
                      setPage((current) => Math.min(totalPages, current + 1))
                    }
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
