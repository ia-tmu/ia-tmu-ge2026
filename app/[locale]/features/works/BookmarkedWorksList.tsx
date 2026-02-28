"use client";

import { useEffect, useState } from "react";
import type { Work } from "../../types/work";
import { SimilarWorksList } from "./SimilarWorksList";
import { getBookmarks } from "../../lib/bookmark";

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


    // slug → Workに復元（similarItemsと同じ形にする）
    const mapped = bookmarks
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
