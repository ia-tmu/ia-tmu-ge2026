"use client";

import Footer from "../components/Footer";
import MoyaBG from "../features/MoyaBG";
import { Works } from "../features/works/Works";
import type { SheetData } from "../types/work";

export function WorksPageContent({ data }: { data: SheetData }) {

  return (
    <main className="relative text-sm md:text-base pt-20 md:pt-[120px]">
      <MoyaBG />
      <div className="max-w-[1160px] mx-auto px-4 md:px-8">
        <Works data={data} />
      </div>
      <Footer />
    </main>
  );
}
