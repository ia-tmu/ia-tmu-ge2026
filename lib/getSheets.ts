// lib/sheets.ts
import { google } from "googleapis";

// 共通の認証設定
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return google.sheets({ version: "v4", auth });
}
/**
 * 最初のシート名を取得して、そのシートの値を2次元配列で返す
 * - 1行目をヘッダーとして分離
 * - headers / rows / objects も返す
 */
export async function fetchFirstSheetValues() {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.SPREADSHEET_ID;

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

/**
 * slug（ID）を元に、その行のデータだけをピンポイントで取得する
 */
export async function fetchRowBySlug(slug: string) {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // 1. まず「IDが並んでいる列（例: A列）」だけを読み込んで、slugが何行目にあるか探す
  const rangeRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "web_conect!A:A", 
  });

  const ids = rangeRes.data.values || [];
  // slugと一致するインデックスを探す（1行目がヘッダーなら +1 する）
  const rowIndex = ids.findIndex((row) => String(row[0]) === slug) + 1;

  if (rowIndex === 0) {
    throw new Error(`Slug "${slug}" not found`);
  }

  // 2. 特定した行だけを取得する
  const rowRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `web_conect!A${rowIndex}:Z${rowIndex}`,
  });

  const rowData = rowRes.data.values?.[0] || [];

  // 3. 扱いやすいようにオブジェクト形式に変換（ヘッダーが必要な場合は別途取得）
  // ここではシンプルに配列、もしくは決まったキーで返します
  return {
    name: rowData[1],   // B列
    image: rowData[2], // C列
  };
}

/**
 * generateStaticParams用のID一覧だけを取得する軽量関数
 */
export async function fetchAllIds() {
  const sheets = await getSheetsClient();
  const rangeRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "web_conect!A2:A", // ヘッダーを除いたID列だけ
  });

  return (rangeRes.data.values || []).map((row) => String(row[0]));
}