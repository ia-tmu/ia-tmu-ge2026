import { fetchSheetValues } from "@/lib/get-works";
import Teaser from "./features/Teaser";
import FixedBackground from "./features/FixedBackground";
import MoyaBG from "./features/MoyaBG";
import Concept from "./features/Concept";
import Info from "./features/Info";
import Footer from "./components/Footer";
import WebExhibition from "./features/WebExhibition";
import WebExhibitionComingSoon from "./features/WebExhibitionComingSoon";
import Events from "./features/Events";
import SNSEmbedding from "./features/SNSEmbedding";

export default async function Page() {
  let works: { id: string; thumbnail: string; workTitle: string }[] = [];
  try {
    const fetched = await fetchSheetValues();
    works = fetched.works.map((w) => ({
      id: w.id,
      thumbnail: w.thumbnail,
      workTitle: w.workTitle,
    }));
  } catch {
    works = [];
  }

  return (
    <main className="relative text-sm md:text-base pt-20 md:pt-[120px]">
      <MoyaBG />
      <FixedBackground />
      <Teaser />
      <Concept />
      {/* <WebExhibitionComingSoon /> */}
      <WebExhibition works={works} />
      <Events />
      <Info />
      <SNSEmbedding />
      <Footer />
    </main>
  );
}
