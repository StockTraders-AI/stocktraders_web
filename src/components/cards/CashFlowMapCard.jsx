import ReactECharts from "echarts-for-react";

const nodes = [
  { name: "Ngân hàng" },
  { name: "Chứng khoán" },
  { name: "Thép" },
  { name: "Sóng ngành Vin" },
  { name: "BĐS dân cư" },
  { name: "Khác" },
  { name: "BĐS dân cư +" },
  { name: "Xây dựng" },
  { name: "Thép +" },
  { name: "Dầu khí" },
  { name: "Điện" },
  { name: "Khác +" },
];

const links = [
  { source: "Ngân hàng", target: "BĐS dân cư +", value: 95 },
  { source: "Chứng khoán", target: "Xây dựng", value: 47 },
  { source: "Thép", target: "Thép +", value: 23 },
  { source: "Sóng ngành Vin", target: "Dầu khí", value: 18 },
  { source: "BĐS dân cư", target: "Điện", value: 15 },
  { source: "Khác", target: "Khác +", value: 11 },
  { source: "Ngân hàng", target: "Xây dựng", value: 20 },
  { source: "Chứng khoán", target: "BĐS dân cư +", value: 30 },
  { source: "Thép", target: "Dầu khí", value: 14 },
];

export default function CashFlowMapCard() {
  const option = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
      backgroundColor: "#071323",
      borderColor: "#334155",
      textStyle: {
        color: "#fff",
      },
    },

    series: [
      {
        type: "sankey",
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
        nodeWidth: 18,
        nodeGap: 16,
        draggable: false,

        data: nodes,
        links,

        label: {
          color: "#e5e7eb",
          fontSize: 13,
          fontWeight: 600,
        },

        itemStyle: {
          borderWidth: 1,
          borderColor: "#1e293b",
        },

        lineStyle: {
          color: "gradient",
          curveness: 0.55,
          opacity: 0.35,
        },

        emphasis: {
          focus: "adjacency",
        },

        levels: [
          {
            depth: 0,
            itemStyle: {
              color: "#dc2626",
            },
            lineStyle: {
              color: "#ef4444",
              opacity: 0.28,
            },
          },
          {
            depth: 1,
            itemStyle: {
              color: "#22c55e",
            },
            lineStyle: {
              color: "#22c55e",
              opacity: 0.28,
            },
          },
        ],
      },
    ],
  };

  return (
    <section className="col-span-12 rounded-xl border border-slate-800 bg-[#071323] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-700 text-sm font-bold">
            11
          </span>

          <div>
            <h2 className="text-lg font-bold">
              BẢN ĐỒ LUÂN CHUYỂN DÒNG TIỀN
            </h2>
            <p className="text-sm text-slate-400">07/05/2025</p>
          </div>
        </div>

        <button className="text-sm text-purple-400">
          Xem chi tiết ›
        </button>
      </div>

      <div className="mt-6 h-[420px] rounded-xl border border-slate-800 bg-[#05101d] p-4">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </section>
  );
}