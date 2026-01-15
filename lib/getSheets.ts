// lib/sheets.ts
import { google } from "googleapis";

/**
 * 最初のシート名を取得して、そのシートの値を2次元配列で返す
 * - 1行目をヘッダーとして分離
 * - headers / rows / objects も返す
 */
export async function fetchFirstSheetValues() {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId) throw new Error("Missing env: SPREADSHEET_ID");
  if (!clientEmail)
    throw new Error("Missing env: GOOGLE_SERVICE_ACCOUNT_EMAIL");
  if (!privateKeyRaw) throw new Error("Missing env: GOOGLE_PRIVATE_KEY");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKeyRaw.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // ① スプレッドシートのメタ情報取得（= シート一覧）
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "properties.title,sheets(properties(sheetId,title,index))",
  });

  const spreadsheetTitle = meta.data.properties?.title ?? "(untitled)";
  const firstSheetTitle = meta.data.sheets?.sort(
    (a, b) => (a.properties?.index ?? 0) - (b.properties?.index ?? 0)
  )?.[0]?.properties?.title;

  if (!firstSheetTitle) {
    throw new Error("No sheets found in the spreadsheet.");
  }

  // ② 最初のシートを丸ごと取得（必要なら範囲を "A1:Z" みたいに絞ってOK）
  const valuesRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${firstSheetTitle}!B1:C200`,
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  const values = valuesRes.data.values ?? [];
  const [headers = [], ...rows] = values;

  // ③ ヘッダー名 -> 値 のオブジェクト配列（google-spreadsheetの getRows() に近い）
  const objects =
    headers.length === 0
      ? []
      : rows.map((r) =>
          Object.fromEntries(headers.map((h, i) => [String(h), r?.[i] ?? ""]))
        );

  return {
    spreadsheetId,
    spreadsheetTitle,
    sheetTitle: firstSheetTitle,
    headers,
    rows, // 2次元配列（ヘッダー除く）
    objects, // [{ヘッダー名: 値, ...}, ...]
    raw: values, // ヘッダー含む生データ
  };
}
