"use client";

import type { Work } from "../../types/work";
import Image from "next/image";

export function WorkCard({ work }: {
  work: Work;
}) {
  return (
    <div className="p-4 h-full max-w-[192px] min-w-[192px] w-[192px] flex flex-col items-start gap-2 border border-foreground backdrop-blur-lg">
      <div className="w-full h-full">
        <Image src={work.image} alt={work.name} width={160} height={120} />
      </div>

      <div className="flex flex-col items-start gap-2">
        <h3 className="text-sm w-full line-clamp-4 font-semibold">{work.workTitle}</h3>
      </div>
    </div>
  );
}