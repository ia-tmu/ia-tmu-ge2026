"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shuffle } from "@/lib/shuffle";
import {
  STUDIO_KEYS,
  getStudioName,
  getStudioCategoryLabel,
  getStudioEnName,
  getStudioKeyByName,
} from "../../types/studio";
import { SEARCH_KEYWORD_CATEGORIES } from "@/app/constants";
import { WorksListWithCategories } from "./WorksListWithCategories";
import { WorksSearch } from "./WorksSearch";
import { SheetData, type Work } from "../../types/work";

function getFilteredWorksByStudio(works: Work[]) {
  const list = works ?? [];
  return Object.fromEntries(
    STUDIO_KEYS.map((studioKey) => {
      const filtered = list.filter(
        (work) => getStudioKeyByName(work.studioName) === studioKey
      );
      return [studioKey, filtered] as const;
    })
  );
}

function applyKeywordFilter(
  worksByStudio: Record<string, Work[]>,
  selectedKeywords: string[]
): Record<string, Work[]> {
  if (selectedKeywords.length === 0) return worksByStudio;
  return Object.fromEntries(
    Object.entries(worksByStudio).map(([studioKey, list]) => [
      studioKey,
      list.filter((work) =>
        work.keywords.some((k) => selectedKeywords.includes(k))
      ),
    ])
  );
}

export function Works({ data }: { data: SheetData }) {
  const { t } = useTranslation();
  const [showAllSectionId, setShowAllSectionId] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  // SSR・初回クライアントはフィルタのみ（シャッフルしない）で一致させる
  const [worksByStudio, setWorksByStudio] = useState(() =>
    getFilteredWorksByStudio(data.works ?? [])
  );
  const worksByStudioFiltered = applyKeywordFilter(
    worksByStudio,
    selectedKeywords
  );

  useEffect(() => {
    const works = data.works ?? [];
    const next = Object.fromEntries(
      STUDIO_KEYS.map((studioKey) => {
        const filtered = works.filter(
          (work) => getStudioKeyByName(work.studioName) === studioKey
        );
        return [studioKey, shuffle(filtered)] as const;
      })
    );
    queueMicrotask(() => setWorksByStudio(next));
  }, [data.works]);

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

        <WorksSearch
          works={data.works ?? []}
          keywordCategories={SEARCH_KEYWORD_CATEGORIES}
          selectedKeywords={selectedKeywords}
          onSelectedKeywordsChange={setSelectedKeywords}
        />

        {STUDIO_KEYS.filter((studioKey) => {
          const list = worksByStudioFiltered[studioKey] ?? [];
          return list.length > 0;
        }).map((studioKey) => (
          <WorksListWithCategories
            key={studioKey}
            id={studioKey}
            title={getStudioEnName(studioKey)}
            subtitle={getStudioName(studioKey)}
            categories={[getStudioCategoryLabel(studioKey)]}
            works={worksByStudioFiltered[studioKey] ?? []}
            showAllSectionId={showAllSectionId}
            setShowAllSectionId={setShowAllSectionId}
          />
        ))}



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
