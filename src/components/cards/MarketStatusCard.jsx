export default function MarketStatusCard() {
  return (
    <section className="dashboard-card-4 rounded-xl border border-slate-800 bg-[#071323] p-5 max-[1536px]:p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-700 text-sm font-bold">
          1
        </span>
        <div>
          <h2 className="text-lg font-bold">THỊ TRƯỜNG HIỆN TẠI</h2>
          <p className="text-sm text-slate-400">Vòng tròn dò sóng</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 max-[1536px]:mt-4 max-[1280px]:justify-start max-[640px]:flex-col">
        <div className="relative h-52 w-52 shrink-0 rounded-full border-28 border-emerald-500 flex items-center justify-center max-[1536px]:h-40 max-[1536px]:w-40 max-[1536px]:border-[22px]">
          <div className="text-center">
            <div className="text-emerald-400 font-bold">CHỜ MUA</div>
            <div className="text-5xl font-bold max-[1536px]:text-4xl">68</div>
            <div className="text-xl text-slate-300 max-[1536px]:text-base">/100</div>
          </div>
        </div>

        <div className="space-y-4 text-sm max-[1536px]:space-y-2 max-[1536px]:text-xs">
          <div className="flex justify-between gap-8">
            <span className="text-slate-300">🟢 CHỜ MUA</span>
            <span>68%</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-slate-300">🟢 MUA</span>
            <span>24%</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-slate-300">🟠 CHỜ BÁN</span>
            <span>5%</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-slate-300">🔴 BÁN</span>
            <span>3%</span>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-800 bg-[#081829] p-4 text-sm max-[1536px]:mt-4 max-[1536px]:p-3 max-[1536px]:text-xs">
        Thị trường đang trong giai đoạn{" "}
        <span className="text-emerald-400">CHỜ MUA</span>.
        <br />
        <span className="text-slate-300">
          Dòng tiền bắt đầu quay trở lại thị trường.
        </span>
      </div>
    </section>
  );
}
