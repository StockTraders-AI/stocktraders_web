export default function MarketStatusCard() {
  return (
    <section className="col-span-4 rounded-xl border border-slate-800 bg-[#071323] p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-700 text-sm font-bold">
          1
        </span>
        <div>
          <h2 className="text-lg font-bold">THỊ TRƯỜNG HIỆN TẠI</h2>
          <p className="text-sm text-slate-400">Vòng tròn dò sóng</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="relative h-52 w-52 rounded-full border-28 border-emerald-500 flex items-center justify-center">
          <div className="text-center">
            <div className="text-emerald-400 font-bold">CHỜ MUA</div>
            <div className="text-5xl font-bold">68</div>
            <div className="text-xl text-slate-300">/100</div>
          </div>
        </div>

        <div className="space-y-4 text-sm">
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

      <div className="mt-5 rounded-lg border border-slate-800 bg-[#081829] p-4 text-sm">
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