export default function PortfolioCard() {
  return (
    <section className="col-span-4 rounded-xl border border-slate-800 bg-[#071323] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">DANH MỤC CỦA BẠN</h2>
        <button className="text-sm text-purple-400">Xem danh mục ›</button>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Tổng giá trị</span>
          <span>512,340,000 đ</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Lãi/Lỗ</span>
          <span className="text-emerald-400">+23,450,000 đ (+4.79%)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Tỷ trọng cổ phiếu</span>
          <span>62%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Tiền mặt</span>
          <span>38%</span>
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-800">
        <div className="h-2 w-[62%] rounded-full bg-emerald-400" />
      </div>

      <div className="mt-5 grid grid-cols-5 divide-x divide-slate-800 text-center text-sm">
        {[
          ["1 ngày", "+1.23%"],
          ["1 tuần", "+3.45%"],
          ["1 tháng", "+6.78%"],
          ["3 tháng", "+12.34%"],
          ["YTD", "+15.67%"],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="text-slate-400">{label}</div>
            <div className="mt-1 text-emerald-400">{value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}