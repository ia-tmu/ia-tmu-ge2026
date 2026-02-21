// lib/sheets.ts
import { google } from "googleapis";

const WORKS_SHEET_NAME = process.env.WORKS_SHEET_NAME ?? "Web展回答";

/** スプレッドシート1行分の列と意味の対応（A〜Q列） */
export type WorksRow = {
  id: string; // A列
  keyword1: string; // B列
  keyword2: string; // C列
  keyword3: string; // D列
  timeStamp: string; // E列
  name: string; // F列
  studentID: string; // G列
  studioName: string; // H列
  degree: string; // I列
  workTitle: string; // J列
  workDescriptionJP: string; // K列
  workDescriptionEN: string; // L列
  thumbnail: string; // M列
  image: string[]; // N列（カンマ区切りで複数対応）
  movie: string; // O列
  application: string; // P列
  link1: string; // Q列
  link2: string; // R列
  link3: string; // S列
  order: string; // T列
  link1Title: string; // U列
  link2Title: string; // V列
  link3Title: string; // W列
};

function rowToWorksRow(row: (string | number | null | undefined)[]): WorksRow {
  return {
    id: String(row[0] ?? ""),
    keyword1: String(row[1] ?? ""),
    keyword2: String(row[2] ?? ""),
    keyword3: String(row[3] ?? ""),
    timeStamp: String(row[4] ?? ""),
    name: String(row[5] ?? ""),
    studentID: String(row[6]) ?? "",
    studioName: String(row[7]) ?? "",
    degree: String(row[8] ?? ""),
    workTitle: String(row[9] ?? ""),
    workDescriptionJP: String(row[10] ?? ""),
    workDescriptionEN: String(row[11] ?? ""),
    thumbnail: driveToImageUrl(String(row[12])) ?? "",
    image: String(row[13] ?? "")
      .split(/[,\n]/)
      .map((img) => driveToImageUrl(img.trim()))
      .filter(Boolean) as string[],
    movie: String(row[14] ?? ""),
    application: String(row[15] ?? ""),
    link1: String(row[16] ?? ""),
    link2: String(row[17] ?? ""),
    link3: String(row[18] ?? ""),
    order: String(row[19] ?? ""),
    link1Title: String(row[20] ?? ""),
    link2Title: String(row[21] ?? ""),
    link3Title: String(row[22] ?? ""),
  };
}

function driveToImageUrl(raw: string): string | null {
  const m = raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!m?.[1]) return null;
  const fileId = m[1];
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

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
export async function fetchSheetValues() {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // ① スプレッドシートのメタ情報取得（= シート一覧）
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "properties.title,sheets(properties(sheetId,title,index))",
  });

  const spreadsheetTitle = meta.data.properties?.title ?? "(untitled)";

  // ② A〜Q列を取得（id,timeStamp,name,studentID,studioName,degree,workTitle,workDescriptionJP,workDescriptionEN,thumbnail,image,movie,application,link1,link2,link3,order）
  const valuesRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${WORKS_SHEET_NAME}!A1:Z`,
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  const values = valuesRes.data.values ?? [];
  const [headers = [], ...rawRows] = values;

  // ③ 列と意味を対応させたオブジェクト配列（fetchRowBySlug と同じ形）
  const works: WorksRow[] = rawRows.map((r) => rowToWorksRow(r ?? []));

  // ④ 後方互換: ヘッダー名 -> 値 のオブジェクト配列
  const objects =
    headers.length === 0
      ? []
      : rawRows.map((r) =>
          Object.fromEntries(
            (headers as string[]).map((h, i) => [String(h), r?.[i] ?? ""]),
          ),
        );

  return {
    spreadsheetId,
    spreadsheetTitle,
    sheetTitle: WORKS_SHEET_NAME,
    headers,
    rows: rawRows, // 2次元配列（ヘッダー除く）
    works, // 列と意味を対応させた配列
    objects,
    raw: values,
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
    range: `${WORKS_SHEET_NAME}!A:A`,
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
    range: `${WORKS_SHEET_NAME}!A${rowIndex}:Z${rowIndex}`,
  });

  const rowData = rowRes.data.values?.[0] || [];

  return rowToWorksRow(rowData);
}

/**
 * generateStaticParams用のID一覧だけを取得する軽量関数
 * シートが存在しない・未設定の場合は空配列を返しビルドを成功させる
 */
export async function fetchAllIds(): Promise<string[]> {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) return [];

  try {
    const sheets = await getSheetsClient();
    const rangeRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${WORKS_SHEET_NAME}!A2:A`,
    });
    return (rangeRes.data.values || []).map((row) => String(row[0]));
  } catch {
    return ["1"];
  }
}
