import { Suspense } from "react";
import ShareBookmarkSaver from "./share-bookmark-saver";

// 静的エクスポート対応: searchParams はクライアントで useSearchParams() により取得
export default function SharePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-sm opacity-60">Loading...</div>}>
      <ShareBookmarkSaver />
    </Suspense>
  );
}
