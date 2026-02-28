"use client";

import { useEffect, useState } from "react";
import { isBookmarked, toggleBookmark } from "../../lib/bookmark";

export default function BookmarkButton({ slug }: { slug: string }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  // SSR対策（hydration mismatch防止）
  useEffect(() => {
    setBookmarked(isBookmarked(slug));
    setMounted(true);
  }, [slug]);

  if (!mounted) return null;

  const handleToggle = () => {
    const newList = toggleBookmark(slug);
    setBookmarked(newList.includes(slug));
  };

  return (
    <button
      onClick={handleToggle}
      className={`text-sm px-3 py-1 border border-white/30 hover:bg-white/10 transition-all ${bookmarked ? "bg-dark-blue-primary/50 text-foreground" : ""}`}
      aria-pressed={bookmarked}
    >
      {bookmarked ? "★ お気に入り" : "☆ お気に入りに追加"}
    </button>
  );
}
