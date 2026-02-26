"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shuffle } from "@/lib/shuffle";
import {
  STUDIO_KEYS,
  type StudioKey,
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

const STUDIO_ORDER_STORAGE_KEY = "works-studio-order";

/** セッション内で保存された順序を取得する。無ければ新規シャッフルして保存。SSRでは未使用。 */
function getOrCreateStudioOrder(): StudioKey[] {
  if (typeof window === "undefined") return [...STUDIO_KEYS];
  try {
    const stored = sessionStorage.getItem(STUDIO_ORDER_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      const set = new Set(STUDIO_KEYS);
      if (
        parsed.length === set.size &&
        parsed.every((k) => set.has(k as StudioKey))
      ) {
        return parsed as StudioKey[];
      }
    }
  } catch {
    // 無効な保存値は無視
  }
  const order = shuffle([...STUDIO_KEYS]);
  sessionStorage.setItem(STUDIO_ORDER_STORAGE_KEY, JSON.stringify(order));
  return order;
}

export function Works({ data }: { data: SheetData }) {
  const { t } = useTranslation();
  const [showAllSectionId, setShowAllSectionId] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  // 同一ブラウザセッション内では並び順を固定。sessionStorage で保持し、新規タブ・別日は新ランダム順。
  const [studioOrder, setStudioOrder] = useState<StudioKey[]>(() => [
    ...STUDIO_KEYS,
  ]);

  useEffect(() => {
    // マウント後に sessionStorage から順序を復元（SSR との hydration 整合のため初回はデフォルト順で描画）
    const order = getOrCreateStudioOrder();
    queueMicrotask(() => setStudioOrder(order));
  }, []);
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

        {studioOrder.filter((studioKey) => {
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
