import Teaser from "./features/Teaser";
import FixedBackground from "./features/FixedBackground";
import Concept from "./features/Concept";
import Footer from "./components/Footer";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // const { locale } = await params;
  return (
    <main className="relative">
      <FixedBackground />
      <Teaser />
      <Concept />
      <Footer />
    </main>
  );
}
