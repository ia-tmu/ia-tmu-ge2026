import Hero from "./features/Hero";
import Section from "./components/Section";
import Button from "./components/Button";
import LangSwitcher from "./features/LangSwitcher";
import { localePath } from "./lib/localePath";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div>
      <Hero />
      <Section>
        <Button href={localePath(locale as string, "/works")}>Go to Works Page</Button>
        <LangSwitcher />
      </Section>
    </div >
  );
}
