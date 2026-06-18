export default function AIAdvisorCard() {
  return (
    <section className="dashboard-card-3 rounded-xl border border-slate-800 bg-[#071323] p-4 max-[1536px]:p-3">
      <h2 className="text-lg font-bold text-white">🤖 AI ADVISOR</h2>

      <div className="mt-4 rounded-lg border border-slate-800 bg-[#081829] p-4 space-y-3 text-sm max-[1536px]:p-3 max-[1536px]:text-xs">
        {[
          ["Thị trường:", "CHỜ MUA"],
          ["Dòng tiền:", "TIẾP TỤC ĐỔ VÀO"],
          ["Ngành dẫn sóng:", "Chứng khoán"],
          ["Ngành mạnh nhất:", "Chứng khoán (82)"],
          ["Mã hút tiền:", "SSI"],
          ["Mã mạnh nhất:", "SSI (88)"],
        ].map(([label, value], i) => (
          <div key={i} className="flex justify-between gap-4">
            <span className="text-slate-400">{label}</span>
            <span className={value.includes("SSI") ? "text-red-400" : "text-emerald-400"}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
