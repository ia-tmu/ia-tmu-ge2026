import Teaser from "./features/Teaser";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // const { locale } = await params;
  return (
    <main>
      <Teaser />
    </main>
  );
}
