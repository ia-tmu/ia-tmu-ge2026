"use client";

import Footer from "../components/Footer";
import MoyaBG from "../features/MoyaBG";
import { Works } from "../features/works/Works";
import type { SheetData } from "../types/work";
import { getSimilarWorks } from '@/lib/similarity';

export function WorksPageContent({ data }: { data: SheetData }) {
  const result = getSimilarWorks("A32", 10);

  if (!result) return <div>作品が見つかりません</div>

  return (
    <main className="relative text-sm md:text-base pt-20 md:pt-[120px]">
      <MoyaBG />
      <div className="max-w-[960px] mx-auto px-4 md:px-8">
        <Works data={data} />
      </div>
      {result.similarWorks && result.similarWorks.map((item) => (
        <div key={item.work.id}>
          {item.rank}位: {item.work.title.ja ? item.work.title.ja : item.work.title.en}
          ({(item.similarity * 100).toFixed(1)}% 類似)
        </div>
      ))}
      <Footer />
    </main>
  );
}
