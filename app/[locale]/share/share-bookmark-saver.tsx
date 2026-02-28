"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "bookmarkedWorks";

function parseIds(idsParam: string): string[] {
  if (!idsParam) return [];
  return idsParam
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}

function getStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveMerged(newIds: string[]) {
  if (newIds.length === 0) return;

  const current = getStored();
  const merged = Array.from(new Set([...current, ...newIds]));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event("bookmark-updated"));
}

export default function ShareBookmarkSaver({
  idsParam,
}: {
  idsParam: string;
}) {
  const router = useRouter();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;

    const ids = parseIds(idsParam);
    saveMerged(ids);

    hasRunRef.current = true;

    // 保存後に遷移
    router.replace("/works");
  }, [idsParam, router]);

  return (
    <div className="flex items-center justify-center h-screen text-sm opacity-60">
      Saving bookmarks...
    </div>
  );
}
