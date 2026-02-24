// lib/sheets.ts
import { readFile } from "fs/promises";
import { join } from "path";
import { google } from "googleapis";

const WORKS_SHEET_NAME = process.env.WORKS_SHEET_NAME ?? "Web展回答";

const CACHE_FILE = join(process.cwd(), "local", "works-build-cache.json");

type CachedData = Awaited<ReturnType<typeof fetchSheetValuesFromApi>>;

async function readCache(): Promise<CachedData | null> {
  try {
    const json = await readFile(CACHE_FILE, "utf-8");
    return JSON.parse(json) as CachedData;
  } catch {
    return null;
  }
}

/** スプレッドシート1行分の列と意味の対応（A〜Q列） */
export type WorksRow = {
  id: string; // A列
  keywords: string[]; // B〜D列（keyword1,2,3 を結合）
  timeStamp: string; // E列
  studentID: string; // G列
  studioName: string; // H列
  degree: string; // I列
  workTitle: string; // J列
  workDescriptionJP: string; // K列
  workDescriptionEN: string; // L列
  thumbnail: string; // M列
  images: string[]; // N列（カンマ区切りで複数対応）
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
    keywords: [
      String(row[1] ?? ""),
      String(row[2] ?? ""),
      String(row[3] ?? ""),
    ].filter(Boolean),
    timeStamp: String(row[4] ?? ""),
    studentID: String(row[6]) ?? "",
    studioName: String(row[7]) ?? "",
    degree: String(row[8] ?? ""),
    workTitle: String(row[9] ?? ""),
    workDescriptionJP: String(row[10] ?? ""),
    workDescriptionEN: String(row[11] ?? ""),
    thumbnail: driveToImageUrl(String(row[12])) ?? "",
    images: String(row[13] ?? "")
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

/**
 * セル文字列から Google Drive のファイルIDを抽出し、画像表示用の lh3 URL を返す。
 * 対応形式:
 * - クエリ: ?id=FILE_ID または &id=FILE_ID
 * - パス: drive.google.com/file/d/FILE_ID または drive.google.com/open?id=FILE_ID
 * - 既に lh3 URL: lh3.googleusercontent.com/d/FILE_ID の場合はそのまま利用（検証のみ）
 */
function driveToImageUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // 既に lh3 の直接URLの形式なら、/d/ の直後の FILE_ID を検証して利用
  const lh3Match = trimmed.match(/lh[0-9]\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i);
  if (lh3Match?.[1]) {
    return `https://lh3.googleusercontent.com/d/${lh3Match[1]}`;
  }

  // クエリパラメータ id= から取得（従来対応）
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${queryMatch[1]}`;
  }

  // パス形式: /file/d/FILE_ID または /open の id= （Drive の標準共有リンク）
  const pathMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (pathMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${pathMatch[1]}`;
  }

  const openMatch = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);
  if (openMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  }

  return null;
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
 * - キャッシュが存在する場合は API を呼ばずキャッシュを返す（ビルド時のレート制限回避）
 */
async function fetchSheetValuesFromApi() {
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

export async function fetchSheetValues() {
  const cached = await readCache();
  if (cached) return cached;
  return fetchSheetValuesFromApi();
}

/**
 * slug（ID）を元に、その行のデータだけをピンポイントで取得する
 * キャッシュが存在する場合は API を呼ばずキャッシュから検索（ビルド時のレート制限回避）
 */
export async function fetchRowBySlug(slug: string) {
  const cached = await readCache();
  if (cached) {
    const work = cached.works.find((w) => w.id === slug);
    return work ?? null;
  }

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

  if (rowIndex === 0) return null;

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
 * キャッシュが存在する場合は API を呼ばずキャッシュから取得（ビルド時のレート制限回避）
 */
export async function fetchAllIds(): Promise<string[]> {
  const cached = await readCache();
  if (cached) return cached.works.map((w) => w.id);

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
