"use client";

import { HorizontalScrollArea } from "../../components/HorizontalScrollArea";
import type { Work } from "../../types/work";
import { WorkCard } from "./WorkCard";

export function WorksListWithCategories({ title, subtitle, categories, works }: {
  title: string;
  subtitle: string;
  categories: string[];
  works: Work[];
}) {
  return (
    <div className="py-12 flex flex-col md:flex-row gap-4 overflow-hidden">
      <div className="min-w-[260px] flex flex-col items-start gap-4 md:gap-8">
        <div className="flex flex-col items-start gap-2">
          <h2 className="text-2xl">{title}</h2>
          <p className="text-base">{subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>

      </div>

      <HorizontalScrollArea contentKey={works.length}>
        {works.map((work) => (
          <div key={work.id} className="shrink-0">
            <WorkCard work={work} />
          </div>
        ))}
      </HorizontalScrollArea>

    </div>
  );
}