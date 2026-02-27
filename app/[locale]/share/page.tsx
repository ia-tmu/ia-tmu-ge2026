import { redirect } from "next/navigation";
import ShareBookmarkSaver from "./share-bookmark-saver";

export default function SharePage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  const idsParam = searchParams.ids ?? "";

  return (
    <>
      <ShareBookmarkSaver idsParam={idsParam} />
      {redirect("./works")}
    </>
  );
}
