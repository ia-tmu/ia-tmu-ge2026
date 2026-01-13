"use client";

import { color } from "framer-motion";
import { useEffect, useState } from "react";

/** セルに入りうる値 */
type CellValue = string | number | null;

/** APIレスポンス型 */
type SheetsResponse = {
  spreadsheetTitle: string;
  sheetTitle: string;
  headers: (string | number)[];
  rows: CellValue[][];
  error?: string;
};

export default function SheetsPage() {
  const [data, setData] = useState<SheetsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sheets", { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json: SheetsResponse = await res.json();
        setData(json);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Failed to fetch sheets";

        setData({
          spreadsheetTitle: "",
          sheetTitle: "",
          headers: [],
          rows: [],
          error: message,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div style={{ padding: 16 }}>Loading...</div>;
  }

  if (!data) {
    return <div style={{ padding: 16 }}>No data</div>;
  }

  if (data.error) {
    return (
      <div style={{ padding: 16, color: "crimson" }}>
        Error: {data.error}
      </div>
    );
  }

  function driveToImageUrl(raw: string): string | null {
    // https://drive.google.com/open?id=FILE_ID
    const m = raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (!m?.[1]) return null;
    const fileId = m[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800-h800`;
    }

    function isUrl(v: unknown): v is string {
    return typeof v === "string" && v.startsWith("http");
    }


  return (
    <div className="p-4 text-black">
      <h1 style={{fontSize: 20, fontWeight: 700 }}>
        {data.spreadsheetTitle} / {data.sheetTitle}
      </h1>

      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {data.headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    background: "#f7f7f7",
                    whiteSpace: "nowrap",
                  }}
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
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {(() => {
                        const cell = row[cIdx];

                        if (isUrl(cell)) {
                        const imgUrl = driveToImageUrl(cell);
                        if (imgUrl) {
                            return (
                                <img
                                    src={imgUrl}
                                    alt=""
                                    width={80}
                                    height={80}
                                    style={{ objectFit: "cover", borderRadius: 8 }}
                                    onError={(ev) => {
                                        console.log("IMG ERROR src =", ev.currentTarget.src);
                                    }}
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
  );
}
