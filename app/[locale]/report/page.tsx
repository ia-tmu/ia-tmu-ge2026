import Footer from "../components/Footer";
import ReportIntro from "../features/report/ReportIntro";
import ReportExhibitionScenes from "../features/report/ReportExhibitionScenes";
import ReportTalkSessions from "../features/report/ReportTalkSessions";
import ReportVisitorsVoices from "../features/report/ReportVisitorsVoices";
import ReportClosingNote from "../features/report/ReportClosingNote";
import MoyaBG from "../features/MoyaBG";

export default function ReportPage() {
  return (
    <main className="relative text-sm md:text-base pt-20 md:pt-[120px]">
      <MoyaBG />
      <div className="w-full max-w-5xl mx-auto px-6 md:px-10 lg:px-14 py-8 md:py-12 flex flex-col gap-16">
        <ReportIntro />
        <ReportExhibitionScenes />
        <ReportTalkSessions />
        <ReportVisitorsVoices />
        <ReportClosingNote />
      </div>
      <Footer />
    </main>
  );
}
