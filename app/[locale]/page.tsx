import Teaser from "./features/Teaser";
import FixedBackground from "./features/FixedBackground";
import MoyaBG from "./features/MoyaBG";
import Concept from "./features/Concept";
import Info from "./features/Info";
import Footer from "./components/Footer";
import WebExhibition from "./features/WebExhibition";
import Events from "./features/Events";
import SNSEmbedding from "./features/SNSEmbedding";

export default async function Page() {
  return (
    <main className="relative text-sm md:text-base pt-20 md:pt-[120px]">
      <MoyaBG />
      <FixedBackground />
      <Teaser />
      <Concept />
      <WebExhibition />
      <Events />
      <Info />
      <SNSEmbedding />
      <Footer />
    </main>
  );
}
