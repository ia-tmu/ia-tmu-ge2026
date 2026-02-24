"use client";

import type { Work } from "../../types/work";
import { WorkCard } from "./WorkCard";

export type SimilarWorkItem = {
  work: Work;
  rank: number;
  similarity: number;
};

export function SimilarWorksList({ items }: { items: SimilarWorkItem[] }) {
  if (items.length === 0) return null;

  if (process.env.NODE_ENV === "development") {
    console.log("SimilarWorksList", items);
  }

  return (
    <>
      {/* SP: 縦並び（WorksListWithCategories の md:hidden と同じ flex-col gap-2） */}
      <div className="flex md:hidden flex-col gap-2 list-none p-0 m-0">
        {items.map((item) => (
          <div key={item.work.id} className="shrink-0">
            <WorkCard work={item.work} />
          </div>
        ))}
      </div>
      {/* md以上: 横並び・高さ揃え */}
      <div className="hidden md:flex flex-wrap gap-4 list-none p-0 m-0">
        {items.map((item) => (
          <div key={item.work.id} className="shrink-0 h-[240px]">
            <WorkCard work={item.work} />
          </div>
        ))}
      </div>
    </>
  );
}
