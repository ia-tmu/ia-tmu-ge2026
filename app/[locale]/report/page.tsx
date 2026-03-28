import Footer from "../components/Footer";
import ReportIntro from "../features/report/ReportIntro";
import {
  ReportExhibitionScenesIntro,
  ReportExhibitionScenesGalleries,
} from "../features/report/ReportExhibitionScenes";
import ReportTalkSessions from "../features/report/ReportTalkSessions";
import ReportVisitorsVoices from "../features/report/ReportVisitorsVoices";
import ReportClosingNote from "../features/report/ReportClosingNote";
import MoyaBG from "../features/MoyaBG";

export default function ReportPage() {
  return (
    <main className="relative overflow-x-clip text-sm md:text-base pt-20 md:pt-[120px]">
      <MoyaBG />
      <div className="flex flex-col gap-16">
        <div className="w-full max-w-5xl mx-auto px-6 md:px-10 lg:px-14 pt-8 md:pt-12 flex flex-col gap-16">
          <ReportIntro />
          <ReportExhibitionScenesIntro />
        </div>

        <ReportExhibitionScenesGalleries />

        <div className="w-full max-w-5xl mx-auto px-6 md:px-10 lg:px-14 pb-8 md:pb-12 flex flex-col gap-16">
          <ReportTalkSessions />
          <ReportVisitorsVoices />
          <ReportClosingNote />
        </div>
      </div>
      <Footer />
    </main>
  );
}
