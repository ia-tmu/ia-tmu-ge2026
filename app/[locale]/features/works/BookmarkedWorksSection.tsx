"use client";
import { useEffect, useMemo, useState } from "react";
import type { Work } from "../../types/work";
import { WorksListWithCategories } from "./WorksListWithCategories";
import { ShareQRButton } from "./ShareQRButton";

const STORAGE_KEY = "bookmarkedWorks";

function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function EmptyBookmarksGuideContent() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10 border border-dashed border-foreground/30 text-center px-6">
      <p className="text-base font-semibold">
        お気に入り作品リストをつくろう
      </p>
      <p className="text-sm">
        作品ページからお気に入りに追加すると、ここに保存されます。
      </p>
    </div>

  )
}

function EmptyBookmarksGuide() {
  return (
    <div className="py-3 md:py-10 flex flex-col md:flex-row gap-4 md:justify-between">
      <div className="md:min-w-[245px] md:max-w-[245px] flex flex-col items-start gap-4 md:gap-8">
        <div className="flex flex-col items-start gap-2">
          <h2 className="md:text-2xl text-xl">Bookmarked Works</h2>
          <p className="md:text-base text-sm">お気に入り</p>
        </div>
      </div>
      <EmptyBookmarksGuideContent />
    </div>
  );
}

export function BookmarkedWorksSection({
  allWorks,
  showAllSectionId,
  setShowAllSectionId,
}: {
  allWorks: Work[];
  showAllSectionId: string | null;
  setShowAllSectionId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = () => {
      setBookmarkIds(getBookmarks());
    };
    update();
    setMounted(true);
    window.addEventListener("bookmark-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("bookmark-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const bookmarkedWorks = useMemo(() => {
    if (!bookmarkIds.length) return [];
    const map = new Map(allWorks.map((w) => [w.id, w]));
    return bookmarkIds
      .map((id) => map.get(id))
      .filter((w): w is Work => Boolean(w));
  }, [bookmarkIds, allWorks]);

  // SSR中は何も描画しない
  if (!mounted) return null;

  if (bookmarkedWorks.length === 0) {
    return <EmptyBookmarksGuide />;
  }

  return (
    <div className="relative">
      {/* Share QR ボタン：右上に配置 */}
      <div className="absolute top-12 right-0 md:top-32 md:left-0  z-20">
        <ShareQRButton allWorks={bookmarkedWorks} />
      </div>
      <WorksListWithCategories
        id="bookmarked"
        title="Bookmarked Works"
        subtitle="お気に入り"
        categories={[""]}
        works={bookmarkedWorks}
        showAllSectionId={showAllSectionId}
        setShowAllSectionId={setShowAllSectionId}
      />
    </div>
  );
}
