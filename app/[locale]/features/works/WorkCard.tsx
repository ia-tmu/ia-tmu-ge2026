"use client";

import type { Work } from "../../types/work";
import Image from "next/image";

export function WorkCard({ work }: {
  work: Work;
}) {
  return (
    <>
      <div className="hidden md:flex p-4 h-full max-w-[192px] min-w-[192px] w-[192px] flex-col items-start gap-2 border border-foreground backdrop-blur-lg">
        <div className="w-full h-full">
          <Image src={work.image} alt={work.name} width={160} height={120} />
        </div>
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-sm w-full line-clamp-4 font-semibold">{work.workTitle}</h3>
        </div>
      </div>

      <div className="flex md:hidden h-full w-full flex-row items-stretch gap-3 border border-foreground backdrop-blur-lg overflow-hidden p-2">
        <div className="relative min-h-[120px] h-full aspect-square shrink-0 self-stretch p-2">
          <Image src={work.image} alt={work.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 120px" />
        </div>
        <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
          <h3 className="text-sm w-full line-clamp-4 font-semibold">{work.workTitle}</h3>

          <div className="flex flex-col gap-1">
            {work.keywords?.map((keyword) => (
              <div key={`${work.id}-${keyword}`} className="text-xs w-full line-clamp-4 font-semibold">{keyword}</div>
            ))}
            {/* ダミー */}
            {["エディトリアルデザイン", "インタラクティブアート"].map((keyword) => (
              <div key={`${work.id}-${keyword}`} className="text-xs w-full text-foreground/75 line-clamp-4 font-semibold"># {keyword}</div>
            ))}
          </div>
        </div>
      </div>
    </>

  );
}