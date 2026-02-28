import ShareBookmarkSaver from "./share-bookmark-saver";
export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const idsParam = ids ?? "";
  return <ShareBookmarkSaver idsParam={idsParam} />;
}
