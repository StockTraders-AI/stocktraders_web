const scores = [
  { label: "Đọc thị trường", value: 82, text: "Tốt", color: "text-emerald-400" },
  { label: "Chọn ngành", value: 75, text: "Khá", color: "text-emerald-400" },
  { label: "Chọn mã", value: 60, text: "Trung bình", color: "text-orange-400" },
  { label: "Quản trị vốn", value: 48, text: "Yếu", color: "text-red-400" },
];

export default function InvestorProfileCard() {
  return (
    <section className="dashboard-card-4 rounded-xl border border-slate-800 bg-[#071323] p-5 max-[1536px]:p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold max-[1536px]:text-base">
          HỒ SƠ NHÀ ĐẦU TƯ <span className="text-sm text-yellow-400">(Premium)</span>
        </h2>

        <button className="text-sm text-purple-400">Xem chi tiết ›</button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4 max-[1536px]:mt-4 max-[1536px]:gap-3 max-[640px]:grid-cols-2">
        {scores.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-xs text-slate-400">{item.label}</p>

            <div className="mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-full border-[7px] border-emerald-500 max-[1536px]:h-16 max-[1536px]:w-16 max-[1536px]:border-[6px]">
              <div>
                <div className="text-2xl font-bold max-[1536px]:text-xl">{item.value}</div>
                <div className="text-xs text-slate-400">/100</div>
              </div>
            </div>

            <div className={`mt-2 text-sm font-medium ${item.color}`}>
              {item.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-slate-800 bg-[#081829] p-4 max-[1536px]:mt-4 max-[1536px]:p-3">
        <h3 className="font-bold">AI nhận xét</h3>

        <p className="mt-2 text-sm leading-6 text-slate-300 max-[1536px]:text-xs max-[1536px]:leading-5">
          Bạn đọc thị trường khá tốt và chọn đúng ngành tiềm năng.
          Tuy nhiên, bạn thường chọn mã chưa mạnh trong ngành và quản trị vốn chưa tốt.
        </p>

        <button className="mt-4 rounded-lg bg-purple-700 px-6 py-2 text-sm text-white">
          Xem lộ trình cải thiện
        </button>
      </div>
    </section>
  );
}
