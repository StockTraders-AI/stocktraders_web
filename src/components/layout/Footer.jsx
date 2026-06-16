import logo from "../../assets/logo.svg";
import {
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="h-16 border-t border-slate-800 bg-[#020817] px-6 flex items-center justify-between">
      
      <div className="text-sm text-slate-500">
        Dữ liệu chỉ mang tính chất tham khảo, không phải lời khuyên đầu tư.
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400">
          Kết nối với chúng tôi
        </span>

        <a
          href="#"
          className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center"
        >
          <FaFacebookF size={14} />
        </a>

        <a
          href="#"
          className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center"
        >
          <FaYoutube size={14} />
        </a>

        {/* Zalo */}
        <a
          href="#"
          className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-[11px] font-bold"
        >
          Zalo
        </a>

        {/* Logo StockTraders */}
        <a
          href="#"
          className="flex items-center justify-center"
        >
          <img
            src={logo}
            alt="StockTraders"
            className="h-8 w-auto"
          />
        </a>
      </div>
    </footer>
  );
}