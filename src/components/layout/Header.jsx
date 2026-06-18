import { useEffect, useState } from "react";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/ava.png";
import { FiBell, FiChevronDown } from "react-icons/fi";

export default function Header() {
  const [indexes, setIndexes] = useState([
    {
      name: "VNINDEX",
      value: "--",
      change: "--",
      isUp: true,
    },
    {
      name: "HNXINDEX",
      value: "--",
      change: "--",
      isUp: true,
    },
    {
      name: "UPINDEX",
      value: "--",
      change: "--",
      isUp: true,
    },
  ]);

  useEffect(() => {
    let mounted = true;

    async function loadIndexes() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/indexes`);

        const json = await res.json();

        if (mounted && json.status === "success") {
          setIndexes(json.data);
        }
      } catch (error) {
        console.error("Load index error:", error);
      }
    }

    loadIndexes();

    const timer = setInterval(loadIndexes, 15000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <header className="app-header bg-[#020817] border-b border-slate-800 flex items-center max-[900px]:h-auto max-[900px]:flex-wrap">
      {/* Logo */}
      <div className="w-75 h-full px-4 flex items-center border-r border-slate-800 max-[1536px]:w-60 max-[1536px]:px-3 max-[1280px]:w-52 max-[900px]:h-16 max-[900px]:w-1/2 max-[900px]:border-b">
        <img
          src={logo}
          alt="StockTraders AI"
          className="h-12 w-auto max-[1536px]:h-10 max-[1280px]:h-9"
        />
      </div>

      {/* Dashboard */}
      <div className="w-55 h-full px-5 flex flex-col justify-center border-r border-slate-800 max-[1536px]:w-46 max-[1536px]:px-4 max-[1280px]:w-40 max-[900px]:order-3 max-[900px]:h-14 max-[900px]:w-full max-[900px]:border-b">
        <h1 className="text-[20px] font-bold text-white leading-none max-[1536px]:text-[17px] max-[1280px]:text-[16px]">
          Dashboard
        </h1>

        <p className="text-sm text-slate-400 mt-1 max-[1536px]:text-xs max-[1280px]:hidden">
          Tổng quan thị trường
        </p>
      </div>

      {/* Index */}
      <div className="flex-1 min-w-0 px-4 max-[1536px]:px-3 max-[900px]:order-4 max-[900px]:w-full max-[900px]:flex-none max-[900px]:py-2">
        <div className="flex gap-3 max-[1536px]:gap-2 max-[700px]:overflow-x-auto">
          {indexes.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex-1 min-w-0 h-14 rounded-xl bg-[#071323] border border-slate-800 px-4 flex flex-col justify-center max-[1536px]:h-12 max-[1536px]:px-3 max-[700px]:min-w-42"
            >
              <div className="text-[11px] text-slate-400 max-[1536px]:text-[10px]">
                {item.name}
              </div>

              <div className="flex min-w-0 items-center gap-3 mt-1 max-[1536px]:gap-2">
                <span
                  className={`text-[18px] font-bold max-[1536px]:text-[16px] max-[1280px]:text-[15px] ${
                    item.isUp
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {item.value}
                </span>

                <span
                  className={`text-[12px] font-medium max-[1536px]:text-[11px] max-[1280px]:text-[10px] ${
                    item.isUp
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="w-[270px] h-full border-l border-slate-800 px-5 flex items-center justify-between max-[1536px]:w-[220px] max-[1536px]:px-4 max-[1280px]:w-[168px] max-[1280px]:gap-3 max-[900px]:h-16 max-[900px]:w-1/2 max-[900px]:border-b max-[900px]:justify-end">
        {/* Notification */}
        <div className="relative">
          <FiBell className="text-xl text-white cursor-pointer" />

          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
            3
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 max-[1536px]:gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden max-[1536px]:h-9 max-[1536px]:w-9">
            <img
              src={avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="max-[1280px]:hidden">
            <div className="text-sm font-medium text-white whitespace-nowrap max-[1536px]:text-xs">
              Nguyễn Văn A
            </div>

            <div className="mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-600 text-white">
                Premium
              </span>
            </div>
          </div>

          <FiChevronDown className="text-slate-400 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
