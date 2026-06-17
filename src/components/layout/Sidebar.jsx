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
  Activity,
} from "lucide-react";

const menus = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "market", label: "Thị trường", icon: LineChart },
  { key: "sector", label: "Ngành", icon: BriefcaseBusiness },
  { key: "ticker", label: "Cổ phiếu", icon: Building2 },
  { key: "portfolio", label: "Danh mục", icon: Wallet },
  { key: "ai-advisor", label: "AI Advisor", icon: Bot },
  { key: "report", label: "Báo cáo", icon: FileBarChart },
  { key: "knowledge", label: "Kiến thức", icon: BookOpen },
  { key: "community", label: "Cộng đồng", icon: Users },
  { key: "setting", label: "Cài đặt", icon: Settings },
  { key: "smdt-branch", label: "SMDT Ngành", icon: Activity },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 shrink-0 min-h-[calc(100vh-80px)] bg-[#071323] border-r border-slate-800 px-4 py-5 flex flex-col justify-between">
      <nav className="space-y-2">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={[
                "w-full h-12 rounded-lg px-4 flex items-center gap-3 text-sm transition",
                activePage === item.key
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

        <div className="text-lg font-bold text-purple-400">Premium</div>

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