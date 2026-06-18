import logo from "../../assets/logo.svg";
import {
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="h-16 border-t border-slate-800 bg-[#020817] px-6 flex items-center justify-between max-[1536px]:h-14 max-[1536px]:px-4 max-[900px]:h-auto max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-3 max-[900px]:py-4">
      
      <div className="text-sm text-slate-500 max-[1536px]:text-xs">
        Dữ liệu chỉ mang tính chất tham khảo, không phải lời khuyên đầu tư.
      </div>

      <div className="flex items-center gap-4 max-[1536px]:gap-3 max-[900px]:flex-wrap">
        <span className="text-sm text-slate-400 max-[1536px]:text-xs">
          Kết nối với chúng tôi
        </span>

        <a
          href="#"
          className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center max-[1536px]:h-8 max-[1536px]:w-8"
        >
          <FaFacebookF size={14} />
        </a>

        <a
          href="#"
          className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center max-[1536px]:h-8 max-[1536px]:w-8"
        >
          <FaYoutube size={14} />
        </a>

        {/* Zalo */}
        <a
          href="#"
          className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-[11px] font-bold max-[1536px]:h-8 max-[1536px]:w-8 max-[1536px]:text-[10px]"
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
