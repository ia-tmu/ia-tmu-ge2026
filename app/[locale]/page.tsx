import Hero from "./features/Hero";
import SampleSection from "./features/SampleSection";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  // const { locale } = await params;
  return (
    <div>
      <Hero />
      <SampleSection />
    </div >
  );
}
