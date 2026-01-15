import Image from "next/image";
import { fetchFirstSheetValues } from "@/lib/getSheets";

/** セルに入りうる値 */
type CellValue = string | number | null;

export default async function SheetsPage() {
  let data: {
    spreadsheetTitle: string;
    sheetTitle: string;
    headers: (string | number)[];
    rows: CellValue[][];
    error?: string;
  };

  try {
    const fetched = await fetchFirstSheetValues();
    data = {
      spreadsheetTitle: fetched.spreadsheetTitle,
      sheetTitle: fetched.sheetTitle,
      headers: fetched.headers,
      rows: fetched.rows,
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch sheets";
    data = {
      spreadsheetTitle: "",
      sheetTitle: "",
      headers: [],
      rows: [],
      error: message,
    };
  }

  if (data.error) {
    return (
      <div style={{ padding: 16, color: "crimson" }}>Error: {data.error}</div>
    );
  }

  function driveToImageUrl(raw: string): string | null {
    // https://drive.google.com/open?id=FILE_ID
    const m = raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (!m?.[1]) return null;
    const fileId = m[1];
    // Google Driveのファイルを直接表示するURL形式を使用
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  function isUrl(v: unknown): v is string {
    return typeof v === "string" && v.startsWith("http");
  }

  return (
    <div className="p-4 text-black">
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>
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
  );
}
