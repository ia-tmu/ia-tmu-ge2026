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
    <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-4">
      {items.map((item) => (
        <div key={item.work.id} className="shrink-0">
          <WorkCard work={item.work} />
        </div>
      ))}
    </div>
  );
}
