"use client";

import type { SimilarTag } from "../types/tag";
import sortTagsBySimilarity from "@/lib/recommend-tags";
import Footer from "../components/Footer";
import MoyaBG from "../features/MoyaBG";
import { Works } from "../features/works/Works";
import type { SheetData } from "../types/work";

export async function WorksPageContent({ data }: { data: SheetData }) {
  let list: SimilarTag[];
  try {
    const res = await sortTagsBySimilarity(["エディトリアルデザイン"]);
    list = res;
    console.log(list)
  } catch (e: unknown) {
    console.log(e)
  }

  return (
    <main className="relative text-sm md:text-base pt-20 md:pt-[120px]">
      <MoyaBG />
      <div className="max-w-[960px] mx-auto px-4 md:px-8">
        <Works data={data} />
      </div>
      <Footer />
    </main>
  );
}
