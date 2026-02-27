"use client";

import { useEffect, useMemo, useState } from "react";
import type { Work } from "../../types/work";
import { WorksListWithCategories } from "./WorksListWithCategories";

const STORAGE_KEY = "bookmarkedWorks";

function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
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

  // 初期取得 + リアルタイム同期
  useEffect(() => {
    const update = () => {
      setBookmarkIds(getBookmarks());
    };

    update();
    window.addEventListener("bookmark-updated", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("bookmark-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  // slug → Work復元（順序はブックマーク順）
  const bookmarkedWorks = useMemo(() => {
    if (!bookmarkIds.length) return [];

    const map = new Map(allWorks.map((w) => [w.id, w]));
    return bookmarkIds
      .map((id) => map.get(id))
      .filter((w): w is Work => Boolean(w));
  }, [bookmarkIds, allWorks]);

  // 何もなければ描画しない（既存セクション設計に合わせる）
  if (bookmarkedWorks.length === 0) return null;

  return (
    <WorksListWithCategories
      id="bookmarked"
      title="Bookmarked Works"
      subtitle="お気に入り"
      categories={["Bookmarks"]}
      works={bookmarkedWorks}
      showAllSectionId={showAllSectionId}
      setShowAllSectionId={setShowAllSectionId}
    />
  );
}
