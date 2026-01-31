"use client";

import Image from "next/image";
import Section from "../components/Section";
import { useTranslation } from "react-i18next";

export type SheetData = {
  spreadsheetTitle: string;
  sheetTitle: string;
  headers: (string | number)[];
  rows: (string | number | null)[][];
  error?: string;
};

function driveToImageUrl(raw: string): string | null {
  const m = raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!m?.[1]) return null;
  return `https://lh3.googleusercontent.com/d/${m[1]}`;
}

function isUrl(v: unknown): v is string {
  return typeof v === "string" && v.startsWith("http");
}

export function Works({ data }: { data: SheetData }) {
  const { t } = useTranslation();

  if (data.error) {
    return (
      <div className="p-4 text-red-600">Error: {data.error}</div>
    );
  }

  return (
    <Section title={t("works.title")} subtitle={t("works.subtitle")}>
      <div className="p-4 text-black">
        <h1 className="text-xl font-bold">
          {data.spreadsheetTitle} / {data.sheetTitle}
        </h1>

        <div className="overflow-x-auto mt-3">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {data.headers.map((h, i) => (
                  <th
                    key={i}
                    className="border border-gray-300 p-2 bg-gray-100 whitespace-nowrap"
                  >
                    {String(h)}
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
                          const imgUrl = driveToImageUrl(cell);
                          if (imgUrl) {
                            return (
                              <Image
                                src={imgUrl}
                                width={80}
                                height={80}
                                alt={String(cell ?? "")}
                              />
                            );
                          }
                        }
                        return String(cell ?? "");
                      })()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
