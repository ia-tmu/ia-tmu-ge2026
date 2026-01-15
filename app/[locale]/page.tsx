import Teaser from "./features/Teaser";
import FixedBackground from "./features/moya/MoyaBG";
// import FixedBackground from "./features/FixedBackground";
import Concept from "./features/Concept";
import Info from "./features/Info"
import Footer from "./components/Footer";

export default async function Page() {
  return (
    <main className="relative text-sm md:text-base">
      <FixedBackground />
      <Teaser />
      <Concept />
      <Info />
      <Footer />
    </main>
  );
}
