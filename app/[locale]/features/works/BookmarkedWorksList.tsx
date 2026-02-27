"use client";

import { useEffect, useState } from "react";
import type { Work } from "../../types/work";
import { SimilarWorksList } from "./SimilarWorksList";

const STORAGE_KEY = "bookmarkedWorks";

function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function BookmarkedWorksList({
  allWorks,
  currentSlug,
  limit = 10,
}: {
  allWorks: Work[];
  currentSlug?: string;
  limit?: number;
}) {
  const [items, setItems] = useState<
    { work: Work; rank: number; similarity: number }[]
  >([]);

  useEffect(() => {
    const bookmarks = getBookmarks();

    // 今見ている作品は除外したい場合
    const filtered = currentSlug
      ? bookmarks.filter((id) => id !== currentSlug)
      : bookmarks;

    // slug → Workに復元（similarItemsと同じ形にする）
    const mapped = filtered
      .map((id, index) => {
        const fullWork = allWorks.find((w) => w.id === id);
        if (!fullWork) return null;

        return {
          work: fullWork,
          rank: index + 1,       // ダミー（順序用）
          similarity: 1,         // ダミー（UI互換用）
        };
      })
      .filter(
        (x): x is { work: Work; rank: number; similarity: number } => x != null
      )
      .slice(0, limit);

    setItems(mapped);
  }, [allWorks, currentSlug, limit]);

  if (items.length === 0) return null;

  return <SimilarWorksList items={items} />;
}
