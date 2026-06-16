export default function RankingCard({ number, title, subtitle, data, type = "bar" }) {
  return (
    <section className="col-span-3 rounded-xl border border-slate-800 bg-[#071323] p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-700 text-sm font-bold">
            {number}
          </span>
          <div>
            <h2 className="text-base font-bold">{title}</h2>
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          </div>
        </div>

        <button className="text-xs text-purple-400">Xem tất cả ›</button>
      </div>

      <div className="mt-5 space-y-4">
        {data.map((item, index) => (
          <div key={item.name} className="grid grid-cols-[24px_1fr_120px_35px] items-center gap-3 text-sm">
            <div className="text-slate-300">{index + 1}</div>

            <div className="flex items-center gap-2">
              {item.code && (
                <span className="rounded bg-purple-700 px-2 py-1 text-xs font-bold text-white">
                  {item.code}
                </span>
              )}
              <span>{item.name}</span>
            </div>

            {type === "status" ? (
              <div className={item.negative ? "text-xs text-orange-400" : "text-xs text-emerald-400"}>
                {item.status}
              </div>
            ) : (
              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-emerald-400"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            )}

            <div className="text-right">{item.score || ""}</div>
          </div>
        ))}
      </div>
    </section>
  );
}