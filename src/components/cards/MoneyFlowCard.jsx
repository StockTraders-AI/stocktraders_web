export default function MoneyFlowCard() {
  return (
    <section className="dashboard-card-4 rounded-xl border border-slate-800 bg-[#071323] p-5 max-[1536px]:p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-700 text-sm font-bold">
          2
        </span>
        <div>
          <h2 className="text-lg font-bold">DÒNG TIỀN THỊ TRƯỜNG</h2>
          <p className="text-sm text-slate-400">Xu hướng dòng tiền toàn thị trường</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-6 h-40 max-[1536px]:mt-4 max-[1536px]:h-32 max-[1536px]:p-4">
        <div className="text-2xl font-bold text-emerald-400 max-[1536px]:text-xl">
          TIẾP TỤC ĐỔ VÀO
        </div>

        <p className="mt-5 max-w-65 text-sm leading-6 text-slate-300 max-[1536px]:mt-3 max-[1536px]:text-xs max-[1536px]:leading-5">
          Dòng tiền đang tiếp tục gia tăng vào thị trường.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 rounded-lg border border-slate-800 overflow-hidden max-[640px]:grid-cols-1">
        <div className="p-4 border-r border-slate-800 max-[1536px]:p-3 max-[640px]:border-r-0 max-[640px]:border-b">
          <p className="text-xs text-slate-400">GTGD KHỚP LỆNH</p>
          <div className="mt-2 text-xl font-bold">23,842 tỷ</div>
          <div className="text-sm text-emerald-400">+18.6%</div>
        </div>

        <div className="p-4 border-r border-slate-800 max-[1536px]:p-3 max-[640px]:border-r-0 max-[640px]:border-b">
          <p className="text-xs text-slate-400">GIÁ TRỊ DÒNG TIỀN</p>
          <div className="mt-2 text-xl font-bold">+2,341 tỷ</div>
          <div className="text-sm text-emerald-400">(Ròng)</div>
        </div>

        <div className="p-4 max-[1536px]:p-3">
          <p className="text-xs text-slate-400">ĐỘ RỘNG THỊ TRƯỜNG</p>
          <div className="mt-2 text-xl font-bold max-[1536px]:text-base">
            <span className="text-emerald-400">267</span>
            <span className="text-slate-400"> / </span>
            <span className="text-red-400">93</span>
          </div>
          <div className="text-sm">Tăng / Giảm</div>
        </div>
      </div>
    </section>
  );
}
