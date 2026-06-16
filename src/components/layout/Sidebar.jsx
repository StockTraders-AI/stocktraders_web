import {
  LayoutDashboard,
  LineChart,
  BriefcaseBusiness,
  Building2,
  Wallet,
  Bot,
  FileBarChart,
  BookOpen,
  Users,
  Settings,
  Crown,
} from "lucide-react";

const menus = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Thị trường", icon: LineChart },
  { label: "Ngành", icon: BriefcaseBusiness },
  { label: "Cổ phiếu", icon: Building2 },
  { label: "Danh mục", icon: Wallet },
  { label: "AI Advisor", icon: Bot },
  { label: "Báo cáo", icon: FileBarChart },
  { label: "Kiến thức", icon: BookOpen },
  { label: "Cộng đồng", icon: Users },
  { label: "Cài đặt", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-[calc(100vh-80px)] bg-[#071323] border-r border-slate-800 px-4 py-5 flex flex-col justify-between">
      <nav className="space-y-2">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={[
                "w-full h-12 rounded-lg px-4 flex items-center gap-3 text-sm transition",
                item.active
                  ? "bg-purple-700 text-white shadow-[0_0_20px_rgba(109,40,217,0.35)]"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white",
              ].join(" ")}
            >
              <Icon size={21} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="rounded-xl border border-purple-900/60 bg-[#0b1026] p-4 text-center shadow-[0_0_25px_rgba(109,40,217,0.15)]">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-900/40 text-purple-400">
          <Crown size={28} />
        </div>

        <div className="text-lg font-bold text-purple-400">
          Premium
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Nâng cấp trải nghiệm nhà đầu tư thông minh
        </p>

        <button className="mt-4 h-11 w-full rounded-lg bg-purple-700 text-sm font-medium text-white hover:bg-purple-600">
          Nâng cấp ngay
        </button>
      </div>
    </aside>
  );
}