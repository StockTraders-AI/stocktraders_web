import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import MarketStatusCard from "../components/cards/MarketStatusCard";
import MoneyFlowCard from "../components/cards/MoneyFlowCard";
import InvestorProfileCard from "../components/cards/InvestorProfileCard";
import RankingCard from "../components/cards/RankingCard";
import AIAdvisorCard from "../components/cards/AIAdvisorCard";
import AIRecommendationCard from "../components/cards/AIRecommendationCard";
import PortfolioCard from "../components/cards/PortfolioCard";

const sectorCashflow = [
  { name: "Chứng khoán", status: "TIẾP TỤC ĐỔ VÀO", score: 82 },
  { name: "BĐS dân cư", status: "NHEN NHÓM ĐỔ VÀO", score: 78 },
  { name: "Thép", status: "NHEN NHÓM ĐỔ VÀO", score: 74 },
  { name: "Bán lẻ", status: "ĐANG THOÁT RA", negative: true, score: 63 },
  { name: "Ngân hàng", status: "ĐANG THOÁT RA", negative: true, score: 60 },
];

const sectorStrength = [
  { name: "Chứng khoán", score: 82 },
  { name: "BĐS dân cư", score: 78 },
  { name: "Thép", score: 74 },
  { name: "Ngân hàng", score: 71 },
  { name: "Bán lẻ", score: 63 },
];

const tickerCashflow = [
  { code: "SSI", name: "", status: "TIẾP TỤC ĐỔ VÀO", score: 88 },
  { code: "VCI", name: "", status: "TIẾP TỤC ĐỔ VÀO", score: 84 },
  { code: "DIG", name: "", status: "NHEN NHÓM ĐỔ VÀO", score: 80 },
  { code: "HPG", name: "", status: "ĐANG THOÁT RA", negative: true, score: 76 },
  { code: "STB", name: "", status: "ĐANG THOÁT RA", negative: true, score: 72 },
];

const tickerStrength = [
  { code: "SSI", name: "", score: 88 },
  { code: "VCI", name: "", score: 84 },
  { code: "HPG", name: "", score: 81 },
  { code: "DIG", name: "", score: 80 },
  { code: "GAS", name: "", score: 76 },
];

export default function Dashboard({ activePage, setActivePage }) {
  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Header />

      <div className="flex min-h-[calc(100vh-80px)]">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 xl:grid-cols-12 gap-4">
              <MarketStatusCard />
              <MoneyFlowCard />
              <InvestorProfileCard />

              <RankingCard
                number={3}
                title="TOP NGÀNH HÚT TIỀN"
                subtitle="Dòng tiền đang đổ vào ngành nào?"
                data={sectorCashflow}
                type="status"
              />

              <RankingCard
                number={4}
                title="TOP NGÀNH MẠNH NHẤT"
                subtitle="Ngành nào mạnh nhất?"
                data={sectorStrength}
              />

              <RankingCard
                number={5}
                title="TOP MÃ HÚT TIỀN"
                subtitle="Dòng tiền đang đổ vào mã nào?"
                data={tickerCashflow}
                type="status"
              />

              <RankingCard
                number={6}
                title="TOP MÃ MẠNH NHẤT"
                subtitle="Mã nào mạnh nhất?"
                data={tickerStrength}
              />

              <AIAdvisorCard />
              <AIRecommendationCard />
              <PortfolioCard />
              {/*<CashFlowMapCard />*/}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}