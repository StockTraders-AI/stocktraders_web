import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import branchPaths from "../data/branchPaths.json";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react";

const FLOW_OPTIONS = [
  { value: "", label: "Tất cả dòng" },
  { value: "in", label: "Dòng tiền vào" },
  { value: "out", label: "Dòng tiền ra" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "Vừa mạnh", label: "Vừa mạnh" },
  { value: "Duy trì", label: "Duy trì" },
  { value: "Tiềm năng", label: "Tiềm năng" },
];

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

  if (Number.isNaN(date.getTime())) return dateString || "";

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

function addDays(dateString, amount) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  date.setDate(date.getDate() + amount);

  return formatInputDateInVietnam(date);
}

function formatPrice(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return "-";

  return number.toLocaleString("en-US", {
    minimumFractionDigits: number >= 1000 ? 0 : 2,
    maximumFractionDigits: number >= 1000 ? 0 : 2,
  });
}

function getLatestByDate(items, date, valueKey) {
  const rows = [...(items || [])]
    .filter((item) => item.date && (!date || item.date <= date))
    .sort((a, b) => b.date.localeCompare(a.date));

  return rows[0]?.[valueKey];
}

function getLatestRowsByDate(items, date, limit = 4) {
  return [...(items || [])]
    .filter((item) => item.date && (!date || item.date <= date))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

function getLatestGroup(groups, date) {
  return [...(groups || [])]
    .filter((group) => group.date && (!date || group.date <= date))
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

function getValueClass(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return "bg-slate-100 text-slate-600";
  if (number >= 100) return "bg-green-200 text-green-800";
  if (number >= 70) return "bg-green-100 text-green-700";
  if (number >= 20) return "bg-yellow-100 text-yellow-800";

  return "bg-red-100 text-red-700";
}

function getStatusClass(content) {
  const normalized = normalizeText(content);

  if (normalized.includes("nhen nhom")) return "bg-lime-100 text-lime-800";
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

function isMoneyIn(content) {
  const normalized = normalizeText(content);

  return normalized.includes("do vao") || normalized.includes("nhen nhom");
}

function getStockStatus(item) {
  if (item.isJustStrong) {
    return {
      label: "Vừa mạnh",
      className: "bg-blue-100 text-blue-700",
    };
  }

  if (item.smdtTicker > 70) {
    return {
      label: "Duy trì",
      className: "bg-emerald-100 text-emerald-700",
    };
  }

  if (item.isPotential) {
    return {
      label: "Tiềm năng",
      className: "bg-yellow-100 text-yellow-800",
    };
  }

  return {
    label: "Theo dõi",
    className: "bg-slate-100 text-slate-700",
  };
}

function hasThreeSessionIncrease(smdtRows) {
  if (smdtRows.length < 4) return false;

  const [current, previous1, previous2, previous3] = smdtRows.map((item) =>
    Number(item.smdt)
  );

  return (
    Number.isFinite(current) &&
    Number.isFinite(previous1) &&
    Number.isFinite(previous2) &&
    Number.isFinite(previous3) &&
    current > previous1 &&
    previous1 > previous2 &&
    previous2 > previous3
  );
}

function getBranchForTicker(ticker) {
  return (
    branchPaths.find((branch) => branch.tickers?.includes(ticker)) || null
  );
}

function getBranchKeyForSmdt(branchName) {
  const normalized = normalizeText(branchName);

  if (normalized.includes("ngan hang")) return "Ngân hàng";
  if (normalized.includes("chung khoan")) return "Chứng khoán";
  if (normalized.includes("bat dong san")) return "BĐS Dân cư";
  if (normalized.includes("thep")) return "Thép";
  if (normalized.includes("xay dung")) return "Xây dựng";
  if (normalized.includes("song nganh vin")) return "Sóng ngành Vin";

  return branchName;
}

export default function TopStrongStocksPage({
  activePage,
  setActivePage,
  smdtBranchData,
  smdtTickerData,
  cashFlowBranchData,
  cashFlowTickerData,
  totalTradeRealData,
  totalTradeRealError,
}) {
  const latestRealDate = useMemo(() => {
    return [...(totalTradeRealData || [])]
      .map((item) => item.date)
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a))[0];
  }, [totalTradeRealData]);

  const [selectedDate, setSelectedDate] = useState(
    latestRealDate || formatInputDateInVietnam(new Date())
  );
  const [selectedFlow, setSelectedFlow] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedDatePrices, setSelectedDatePrices] = useState([]);
  const [previousDatePrices, setPreviousDatePrices] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const effectiveDate =
    selectedDate || latestRealDate || formatInputDateInVietnam(new Date());

  const realPriceMap = useMemo(() => {
    const map = {};

    totalTradeRealData?.forEach((item) => {
      map[item.ticker] = item;
    });

    return map;
  }, [totalTradeRealData]);

  const selectedDatePriceMap = useMemo(() => {
    const map = {};

    selectedDatePrices.forEach((item) => {
      map[item.ticker] = item;
    });

    return map;
  }, [selectedDatePrices]);

  const previousDatePriceMap = useMemo(() => {
    const map = {};

    previousDatePrices.forEach((item) => {
      map[item.ticker] = item;
    });

    return map;
  }, [previousDatePrices]);

  const smdtBranchMap = useMemo(() => {
    const map = {};

    smdtBranchData?.forEach((branch) => {
      map[branch.keyName] = getLatestByDate(branch.smdts, effectiveDate, "smdt");
    });

    return map;
  }, [smdtBranchData, effectiveDate]);

  const cashFlowTickerMap = useMemo(() => {
    const group = getLatestGroup(cashFlowTickerData, effectiveDate);
    const map = {};

    group?.cashTickerDatas?.forEach((item) => {
      map[item.ticker] = item.content;
    });

    return map;
  }, [cashFlowTickerData, effectiveDate]);

  const cashFlowBranchMap = useMemo(() => {
    const group = getLatestGroup(cashFlowBranchData, effectiveDate);
    const map = {};

    group?.cashFlowBranchDatas?.forEach((item) => {
      map[normalizeText(item.name)] = item.content;
    });

    return map;
  }, [cashFlowBranchData, effectiveDate]);

  const rows = useMemo(() => {
    const keyword = normalizeText(search);

    return (smdtTickerData || [])
      .map((tickerData) => {
        const ticker = tickerData.keyValue || tickerData.keyName;
        const smdtRows = getLatestRowsByDate(tickerData.smdts, effectiveDate, 4);
        const smdtTicker = smdtRows[0]?.smdt;
        const previousSmdtTicker = smdtRows[1]?.smdt;
        const branch = getBranchForTicker(ticker);
        const branchName = branch?.name || "Khác";
        const branchKey = getBranchKeyForSmdt(branchName);
        const realPrice = realPriceMap[ticker];
        const selectedDatePrice = selectedDatePriceMap[ticker];
        const previousDatePrice = previousDatePriceMap[ticker];
        const useRealPrice = latestRealDate && effectiveDate >= latestRealDate;
        const currentPrice = Number(
          useRealPrice
            ? realPrice?.close ?? realPrice?.price
            : selectedDatePrice?.close
        );
        const previousClose = Number(previousDatePrice?.close);
        const priceChangePercent =
          Number.isFinite(currentPrice) &&
          Number.isFinite(previousClose) &&
          previousClose
            ? ((currentPrice - previousClose) / previousClose) * 100
            : null;
        const cashFlowTicker = cashFlowTickerMap[ticker];
        const cashFlowBranch =
          cashFlowBranchMap[normalizeText(branchName)] ||
          cashFlowBranchMap[normalizeText(branchKey)];
        const smdtTickerNumber = Number(smdtTicker);
        const previousSmdtTickerNumber = Number(previousSmdtTicker);
        const isJustStrong =
          smdtTickerNumber >= 70 &&
          Number.isFinite(previousSmdtTickerNumber) &&
          previousSmdtTickerNumber < 70;
        const isPotential = hasThreeSessionIncrease(smdtRows);

        return {
          ticker,
          branchName,
          branchKey,
          type: realPrice?.type || "",
          currentPrice,
          previousClose,
          priceChangePercent,
          smdtTicker: smdtTickerNumber,
          previousSmdtTicker: previousSmdtTickerNumber,
          smdtBranch: Number(smdtBranchMap[branchKey]),
          cashFlowTicker,
          cashFlowBranch,
          isJustStrong,
          isPotential,
        };
      })
      .filter((item) => {
        if (!Number.isFinite(item.smdtTicker)) return false;
        if (selectedStatus && getStockStatus(item).label !== selectedStatus) return false;
        if (selectedBranch && item.branchName !== selectedBranch) return false;
        if (selectedFlow === "in" && !isMoneyIn(item.cashFlowTicker)) {
          return false;
        }
        if (selectedFlow === "out" && isMoneyIn(item.cashFlowTicker)) {
          return false;
        }
        if (!keyword) return true;

        return [item.ticker, item.branchName, item.type]
          .filter(Boolean)
          .some((value) => normalizeText(value).includes(keyword));
      })
      .sort((a, b) => {
        const statusOrder = {
          "Vừa mạnh": 0,
          "Duy trì": 1,
          "Tiềm năng": 2,
          "Theo dõi": 3,
        };

        return (
          statusOrder[getStockStatus(a).label] -
            statusOrder[getStockStatus(b).label] ||
          b.smdtTicker - a.smdtTicker
        );
      });
  }, [
    cashFlowBranchMap,
    cashFlowTickerMap,
    realPriceMap,
    search,
    selectedBranch,
    effectiveDate,
    selectedFlow,
    smdtBranchMap,
    smdtTickerData,
    selectedStatus,
    selectedDatePriceMap,
    previousDatePriceMap,
    latestRealDate,
  ]);

  const priceTickers = useMemo(() => {
    return rows.slice(0, 200).map((item) => item.ticker);
  }, [rows]);
  const priceTickersKey = priceTickers.join(",");

  useEffect(() => {
    const tickers = priceTickersKey.split(",").filter(Boolean);

    if (!tickers.length) {
      return;
    }

    const controller = new AbortController();

    async function loadPrices() {
      try {
        setHistoryError("");

        const requestHistory = async (date) => {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stock-total-history`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tickers,
              date,
            }),
            signal: controller.signal,
          });
          const json = await res.json();

          if (!res.ok) {
            throw new Error(json.message || "Cannot load historical prices");
          }

          return json.data || [];
        };

        const [selectedRows, previousRows] = await Promise.all([
          requestHistory(effectiveDate),
          requestHistory(addDays(effectiveDate, -1)),
        ]);

        setSelectedDatePrices(selectedRows);
        setPreviousDatePrices(previousRows);
      } catch (error) {
        if (error.name !== "AbortError") {
          setHistoryError(error.message || "Cannot load historical prices");
        }
      }
    }

    loadPrices();

    return () => controller.abort();
  }, [priceTickersKey, effectiveDate]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        const status = getStockStatus(row).label;

        acc.total += 1;
        acc[status] += 1;

        if (isMoneyIn(row.cashFlowTicker)) {
          acc.moneyIn += 1;
        }

        return acc;
      },
      {
        total: 0,
        "Vừa mạnh": 0,
        "Duy trì": 0,
        "Tiềm năng": 0,
        "Theo dõi": 0,
        moneyIn: 0,
      }
    );
  }, [rows]);

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Header />

      <div className="app-shell flex bg-[#020817] overflow-hidden max-[900px]:flex-col">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-hidden bg-[#020817] px-2 pb-3 pt-0 md:px-3 md:pb-4 md:pt-0 lg:px-3 lg:pb-5 lg:pt-0 text-slate-950">
            <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_320px] gap-3 max-[1280px]:grid-cols-1">
              <section className="overflow-hidden rounded-2xl lg:rounded-3xl border border-slate-200 bg-white p-3 md:p-4 lg:p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h1 className="st-page-title">TOP CỔ PHIẾU MẠNH</h1>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-purple-500 text-[10px] font-bold text-purple-600">
                      i
                    </span>
                  </div>

                  <div className="st-toolbar-control text-slate-500">
                    Dữ liệu cập nhật:{" "}
                    <span className="font-semibold text-slate-900">
                      {formatDate(effectiveDate)}
                    </span>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2 xl:flex-nowrap">
                  <div className="flex w-full md:w-auto shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200 px-3 py-2.5 st-toolbar-control max-[1536px]:rounded-xl max-[1536px]:px-2.5 max-[1536px]:py-1.5">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        resetPage();
                      }}
                      className="w-[112px] shrink-0 text-center outline-none st-toolbar-input max-[1536px]:w-[96px]"
                    />
                  </div>

                  <select
                    value={selectedFlow}
                    onChange={(e) => {
                      setSelectedFlow(e.target.value);
                      resetPage();
                    }}
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 st-toolbar-select text-slate-900 outline-none max-[1536px]:h-9 max-[1536px]:rounded-xl"
                  >
                    {FLOW_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedBranch}
                    onChange={(e) => {
                      setSelectedBranch(e.target.value);
                      resetPage();
                    }}
                    className="h-11 min-w-44 rounded-2xl border border-slate-200 bg-white px-4 st-toolbar-select text-slate-900 outline-none max-[1536px]:h-9 max-[1536px]:rounded-xl"
                  >
                    <option value="">Tất cả ngành</option>
                    {branchPaths.map((branch) => (
                      <option key={branch.path || branch.name} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      resetPage();
                    }}
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 st-toolbar-select text-slate-900 outline-none max-[1536px]:h-9 max-[1536px]:rounded-xl"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <div className="ml-auto flex h-11 w-44 items-center gap-2 rounded-2xl border border-slate-200 px-3 max-[1536px]:h-9 max-[1536px]:rounded-xl max-[1180px]:w-auto">
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

                {(totalTradeRealError || historyError) && (
                  <div className="mb-4 rounded-2xl bg-red-50 p-4 st-error text-red-600">
                    {totalTradeRealError || historyError}
                  </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="max-w-full overflow-x-auto">
                    <table className="min-w-[980px] w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-white">
                          {[
                            "#",
                            "Mã",
                            "Dòng",
                            "Giá hiện tại",
                            "SMDT ngành",
                            "SMDT mã",
                            "Dòng tiền ngành",
                            "Dòng tiền mã",
                            "Trạng thái",
                          ].map((title) => (
                            <th
                              key={title}
                              className="border-b border-slate-200 px-3 py-3 st-table-col-header"
                            >
                              {title}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {pageRows.map((item, index) => {
                          const status = getStockStatus(item);

                          return (
                            <tr key={item.ticker} className="border-b border-slate-100">
                              <td className="px-3 py-3 st-table-date-body text-slate-700">
                                {(page - 1) * pageSize + index + 1}
                              </td>
                              <td className="px-3 py-3 st-table-date-body font-black text-blue-700">
                                {item.ticker}
                              </td>
                              <td className="px-3 py-3 st-table-date-body text-slate-700">
                                {item.branchName}
                              </td>
                              <td className="px-3 py-3 st-table-date-body font-semibold">
                                {formatPrice(item.currentPrice)}
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={[
                                    "inline-flex min-w-[72px] justify-center rounded-lg px-2 py-1 st-value-pill",
                                    getValueClass(item.smdtBranch),
                                  ].join(" ")}
                                >
                                  {Number.isFinite(item.smdtBranch)
                                    ? item.smdtBranch.toFixed(2)
                                    : "-"}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={[
                                    "inline-flex min-w-[72px] justify-center rounded-lg px-2 py-1 st-value-pill",
                                    getValueClass(item.smdtTicker),
                                  ].join(" ")}
                                >
                                  {item.smdtTicker.toFixed(2)}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={[
                                    "inline-flex min-w-[96px] justify-center rounded-lg px-2 py-1 st-status-pill",
                                    getStatusClass(item.cashFlowBranch),
                                  ].join(" ")}
                                >
                                  {getStatusLabel(item.cashFlowBranch)}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={[
                                    "inline-flex min-w-[96px] justify-center rounded-lg px-2 py-1 st-status-pill",
                                    getStatusClass(item.cashFlowTicker),
                                  ].join(" ")}
                                >
                                  {getStatusLabel(item.cashFlowTicker)}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={[
                                    "inline-flex min-w-[72px] justify-center rounded-lg px-2 py-1 st-status-pill",
                                    status.className,
                                  ].join(" ")}
                                >
                                  {status.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 st-legend text-slate-600">
                  <span>
                    Hiển thị {(page - 1) * pageSize + 1} -{" "}
                    {Math.min(page * pageSize, rows.length)} trong {rows.length} mã
                  </span>

                  <div className="flex items-center gap-2">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none"
                    >
                      {[12, 25, 50, 100].map((size) => (
                        <option key={size} value={size}>
                          {size} / trang
                        </option>
                      ))}
                    </select>

                    <button
                      disabled={page <= 1}
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                      className="rounded-xl px-3 py-2 disabled:opacity-40"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="rounded-xl bg-purple-700 px-4 py-2 font-bold text-white">
                      {page}
                    </span>
                    <span className="px-2 text-slate-500">/ {totalPages}</span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
                      }
                      className="rounded-xl px-3 py-2 disabled:opacity-40"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </section>

              <aside className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h2 className="mb-3 st-table-col-header">TỔNG QUAN HÔM NAY</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Vừa mạnh", summary["Vừa mạnh"]],
                      ["Duy trì", summary["Duy trì"]],
                      ["Tiềm năng", summary["Tiềm năng"]],
                      ["Tổng số mã", summary.total],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-slate-100 p-3">
                        <div className="text-[24px] font-black text-purple-700">
                          {value}
                        </div>
                        <div className="st-legend font-semibold text-slate-700">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h2 className="mb-3 st-table-col-header">PHÂN BỔ THEO DÒNG</h2>
                  <div className="space-y-3 st-legend text-slate-700">
                    {branchPaths
                      .map((branch) => ({
                        name: branch.name,
                        count: rows.filter((row) => row.branchName === branch.name)
                          .length,
                      }))
                      .filter((item) => item.count)
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 6)
                      .map((item) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <span className="min-w-0 flex-1 truncate">{item.name}</span>
                          <span className="font-bold">{item.count}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h2 className="mb-4 st-table-col-header">
                    PHÂN BỔ THEO TRẠNG THÁI
                  </h2>

                  <div className="space-y-4 st-legend text-slate-700">
                    {[
                      {
                        label: "Vừa mạnh",
                        value: summary["Vừa mạnh"],
                        bar: "bg-blue-400",
                      },
                      {
                        label: "Duy trì",
                        value: summary["Duy trì"],
                        bar: "bg-emerald-500",
                      },
                      {
                        label: "Tiềm năng",
                        value: summary["Tiềm năng"],
                        bar: "bg-orange-400",
                      },
                    ].map((item) => {
                      const percent = summary.total
                        ? (item.value / summary.total) * 100
                        : 0;

                      return (
                        <div
                          key={item.label}
                          className="grid grid-cols-[82px_minmax(0,1fr)_72px] items-center gap-3"
                        >
                          <span className="font-medium">{item.label}</span>
                          <span className="h-3 overflow-hidden rounded-full bg-slate-100">
                            <span
                              className={[
                                "block h-full rounded-full",
                                item.bar,
                              ].join(" ")}
                              style={{
                                width: `${Math.max(percent, item.value ? 8 : 0)}%`,
                              }}
                            ></span>
                          </span>
                          <span className="text-right font-bold">
                            {item.value} ({percent.toFixed(1)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
