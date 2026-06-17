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
        const res = await fetch("http://localhost:4005/api/indexes");

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
    <header className="h-20 bg-[#020817] border-b border-slate-800 flex items-center">
      {/* Logo */}
      <div className="w-75 h-full px-4 flex items-center border-r border-slate-800">
        <img
          src={logo}
          alt="StockTraders AI"
          className="h-12 w-auto"
        />
      </div>

      {/* Dashboard */}
      <div className="w-55 h-full px-5 flex flex-col justify-center border-r border-slate-800">
        <h1 className="text-[20px] font-bold text-white leading-none">
          Dashboard
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Tổng quan thị trường
        </p>
      </div>

      {/* Index */}
      <div className="flex-1 px-4">
        <div className="flex gap-3">
          {indexes.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex-1 h-14 rounded-xl bg-[#071323] border border-slate-800 px-4 flex flex-col justify-center"
            >
              <div className="text-[11px] text-slate-400">
                {item.name}
              </div>

              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`text-[18px] font-bold ${
                    item.isUp
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {item.value}
                </span>

                <span
                  className={`text-[12px] font-medium ${
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
      <div className="w-[270px] h-full border-l border-slate-800 px-5 flex items-center justify-between">
        {/* Notification */}
        <div className="relative">
          <FiBell className="text-xl text-white cursor-pointer" />

          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
            3
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="text-sm font-medium text-white whitespace-nowrap">
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