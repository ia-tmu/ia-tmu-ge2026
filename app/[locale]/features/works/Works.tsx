"use client";

import { useTranslation } from "react-i18next";
import {
  STUDIO_KEYS,
  getStudioName,
  getStudioCategoryLabel,
  getStudioEnName,
  getStudioKeyByName,
} from "../../types/studio";
import { WorksListWithCategories } from "./WorksListWithCategories";
import { SheetData } from "../../types/work";
import { useState } from "react";

/** ヘッダー文字列がスタジオ key なら正式名称、それ以外はそのまま返す */
// function resolveHeaderLabel(header: string): string {
//   return isStudioKey(header) ? getStudioName(header) : header;
// }

// function isUrl(v: unknown): v is string {
//   return typeof v === "string" && v.startsWith("http");
// }

export function Works({ data }: { data: SheetData }) {
  const { t } = useTranslation();
  const [showAllSectionId, setShowAllSectionId] = useState<string | null>(null);

  if (data.error) {
    return (
      <div className="p-4 text-red-600">Error: {data.error}</div>
    );
  }

  return (
    <div>
      <div className="">

        <div className="md:pb-4 border-b border-foreground pb-2">
          <div className="text-sm md:text-base">
            {t("works.subtitle")}
          </div>
          <h1 className="text-3xl md:text-4xl">
            {t("works.title")}
          </h1>
        </div>


        {STUDIO_KEYS.map((studioKey) => {
          const worksForStudio = (data.works ?? []).filter(
            (work) => getStudioKeyByName(work.studioName) === studioKey
          );
          return (
            <WorksListWithCategories
              key={studioKey}
              id={studioKey}
              title={getStudioEnName(studioKey)}
              subtitle={getStudioName(studioKey)}
              categories={[getStudioCategoryLabel(studioKey)]}
              works={worksForStudio}
              showAllSectionId={showAllSectionId}
              setShowAllSectionId={setShowAllSectionId}
            />
          );
        })}



        {/* <div className="overflow-x-auto mt-3">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {data.headers.map((h, i) => (
                  <th
                    key={i}
                    className="border border-gray-300 p-2 bg-gray-100 whitespace-nowrap"
                  >
                    {resolveHeaderLabel(String(h))}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {data.headers.map((_, cIdx) => (
                    <td
                      key={cIdx}
                      className="border border-gray-300 p-2 whitespace-nowrap"
                    >
                      {(() => {
                        const cell = row[cIdx];
                        if (isUrl(cell)) {
                          return <Image src={cell} width={80} height={80} alt={String(cell ?? "")} />;
                        }
                        return String(cell ?? "");
                      })()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </div>
  );
}
