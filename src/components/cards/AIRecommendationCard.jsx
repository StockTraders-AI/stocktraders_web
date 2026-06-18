export default function AIRecommendationCard() {
  return (
    <section className="dashboard-card-5 rounded-xl border border-slate-800 bg-[#071323] p-6 max-[1536px]:p-4">
      <h2 className="text-lg font-bold">KHUYẾN NGHỊ CỦA AI</h2>

      <p className="mt-4 text-sm leading-7 text-slate-300 max-[1536px]:text-xs max-[1536px]:leading-5">
        Thị trường đang trong giai đoạn CHỜ MUA với dòng tiền{" "}
        <span className="text-emerald-400">TIẾP TỤC ĐỔ VÀO</span>.
        Nhóm ngành dẫn sóng là <span className="text-emerald-400">Chứng khoán</span>{" "}
        với sức mạnh cao (82). Mã SSI đang hút tiền và có sức mạnh vượt trội (88).
      </p>

      <p className="mt-3 text-sm text-emerald-400 max-[1536px]:text-xs">
        =&gt; Ưu tiên theo dõi và giải ngân từng phần vào nhóm Chứng khoán.
      </p>

      <button className="mt-6 rounded-lg bg-purple-700 px-8 py-3 text-sm text-white max-[1536px]:mt-4 max-[1536px]:px-5 max-[1536px]:py-2 max-[1536px]:text-xs">
        Xem chi tiết phân tích
      </button>
    </section>
  );
}
