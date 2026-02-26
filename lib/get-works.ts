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

/** rowToWorksRow の内部用：画像の fileId をソート用に保持 */
type WorksRowWithImageIds = WorksRow & { imageFileIds?: string[] };

/**
 * セル文字列から Google Drive のファイルIDを抽出する。
 * driveToImageUrl と同じ形式（lh3 URL / id= / drive.google.com）に対応。
 */
function extractDriveFileId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const lh3Match = trimmed.match(
    /lh[0-9]\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i,
  );
  if (lh3Match?.[1]) return lh3Match[1];

  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch?.[1]) return queryMatch[1];

  const pathMatch = trimmed.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
  );
  if (pathMatch?.[1]) return pathMatch[1];

  const openMatch = trimmed.match(
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i,
  );
  if (openMatch?.[1]) return openMatch[1];

  return null;
}

function rowToWorksRow(
  row: (string | number | null | undefined)[],
): WorksRowWithImageIds {
  const imageEntries = String(row[13] ?? "")
    .split(/[,\n]/)
    .map((img) => {
      const trimmed = img.trim();
      const url = driveToImageUrl(trimmed);
      const fileId = extractDriveFileId(trimmed);
      return { url, fileId };
    })
    .filter((e): e is { url: string; fileId: string } =>
      Boolean(e.url && e.fileId),
    );

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
    images: imageEntries.map((e) => e.url),
    imageFileIds: imageEntries.map((e) => e.fileId),
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
  const lh3Match = trimmed.match(
    /lh[0-9]\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i,
  );
  if (lh3Match?.[1]) {
    return `https://lh3.googleusercontent.com/d/${lh3Match[1]}`;
  }

  // クエリパラメータ id= から取得（従来対応）
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${queryMatch[1]}`;
  }

  // パス形式: /file/d/FILE_ID または /open の id= （Drive の標準共有リンク）
  const pathMatch = trimmed.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
  );
  if (pathMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${pathMatch[1]}`;
  }

  const openMatch = trimmed.match(
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i,
  );
  if (openMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;
  }

  return null;
}

// 共通の認証設定（Sheets と Drive の両方で利用）
function getGoogleAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });
}

async function getSheetsClient() {
  const auth = getGoogleAuth();
  return google.sheets({ version: "v4", auth });
}

async function getDriveClient() {
  const auth = getGoogleAuth();
  return google.drive({ version: "v3", auth });
}

/**
 * ファイル名から連番を抽出する。
 * 例: "24860000_山田太郎_01.jpg" / "24860000_山田太郎_01 - Taro Yamada.jpg" → 1
 * フォーマットに沿わない場合は null。
 */
function getSequenceFromFilename(name: string): number | null {
  const m = name.match(/_\d{1,4}(?:\s*-\s*[^.]*)?\.\w+$/i);
  if (!m) return null;
  const numMatch = m[0].match(/^_(\d{1,4})/);
  if (!numMatch?.[1]) return null;
  const n = parseInt(numMatch[1], 10);
  return Number.isNaN(n) ? null : n;
}

/**
 * 複数の fileId について Drive API でファイル名を取得する。取得失敗した ID は Map に含めない。
 */
async function getFileNames(fileIds: string[]): Promise<Map<string, string>> {
  const uniqueIds = [...new Set(fileIds)];
  if (uniqueIds.length === 0) return new Map();

  const drive = await getDriveClient();
  type ErrorSample = { code: number | undefined; message: string };
  let firstError: ErrorSample | null = null;
  const results = await Promise.all(
    uniqueIds.map(async (fileId) => {
      try {
        const res = await drive.files.get({
          fileId,
          fields: "name",
        });
        const name = res.data.name;
        return name != null ? ([fileId, name] as const) : null;
      } catch (err: unknown) {
        if (!firstError && err && typeof err === "object" && "code" in err) {
          const e = err as { code?: number; message?: string };
          firstError = {
            code: e.code,
            message: String(e.message ?? err),
          };
        }
        return null;
      }
    }),
  );

  const map = new Map<string, string>();
  for (const r of results) {
    if (r) map.set(r[0], r[1]);
  }
  if (firstError !== null && map.size === 0) {
    const e = firstError as ErrorSample;
    console.log(
      "[get-works] Drive API files.get: 取得失敗の例（1件目）",
      "code=" + e.code,
      e.message.slice(0, 120),
    );
  }
  return map;
}

/**
 * 全画像のファイル名から連番が取得できる場合のみ、連番昇順でソートする。否则は元の順序を返す。
 */
function sortImagesByFilename(
  images: string[],
  imageFileIds: string[],
  nameMap: Map<string, string>,
): string[] {
  if (images.length !== imageFileIds.length || images.length === 0)
    return images;

  const withSeq: { url: string; seq: number }[] = [];
  for (let i = 0; i < images.length; i++) {
    const name = nameMap.get(imageFileIds[i]);
    if (name == null) return images;
    const seq = getSequenceFromFilename(name);
    if (seq == null) return images;
    withSeq.push({ url: images[i], seq });
  }

  withSeq.sort((a, b) => a.seq - b.seq);
  return withSeq.map((x) => x.url);
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

  // ③ 列と意味を対応させたオブジェクト配列（imageFileIds 付き）
  const worksWithIds: WorksRowWithImageIds[] = rawRows.map((r) =>
    rowToWorksRow(r ?? []),
  );

  // ③-b 全画像の fileId を集め、Drive API でファイル名を取得して連番でソート
  const allFileIds = worksWithIds.flatMap((w) => w.imageFileIds ?? []);
  const uniqueFileIds = [...new Set(allFileIds)];
  console.log(
    "[get-works] Image sort: fetching file names from Drive API",
    "works=" + worksWithIds.length,
    "totalImageRefs=" + allFileIds.length,
    "uniqueFileIds=" + uniqueFileIds.length,
  );
  const nameMap = await getFileNames(allFileIds);
  console.log(
    "[get-works] Image sort: Drive API resolved",
    nameMap.size + "/" + uniqueFileIds.length,
    "file names",
  );
  const works: WorksRow[] = worksWithIds.map((w) => {
    const sortedImages = sortImagesByFilename(
      w.images,
      w.imageFileIds ?? [],
      nameMap,
    );
    const didSort = sortedImages !== w.images;
    if (w.images.length > 0) {
      console.log(
        "[get-works] Image sort: work id=" + w.id,
        "images=" + w.images.length,
        didSort ? "sorted by filename sequence" : "kept original order",
      );
    }
    const { imageFileIds: _omit, ...rest } = w;
    void _omit;
    return { ...rest, images: sortedImages };
  });

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
  if (cached) {
    console.log(
      "[get-works] fetchSheetValues: using cache (images already sorted at cache build)",
      "works=" + cached.works.length,
    );
    return cached;
  }
  console.log(
    "[get-works] fetchSheetValues: no cache, calling API (image sort will run)",
  );
  return fetchSheetValuesFromApi();
}

/**
 * slug（ID）を元に、その行のデータだけをピンポイントで取得する
 * キャッシュが存在する場合は API を呼ばずキャッシュから検索（ビルド時のレート制限回避）
 */
export async function fetchRowBySlug(slug: string) {
  const cached = await readCache();
  if (cached) {
    const allIds = cached.works.map((w) => w.id);
    const work = cached.works.find((w) => w.id === slug) ?? null;
    const wPrefixed = allIds.filter(
      (id) => id.startsWith("W") || id.startsWith("w"),
    );
    console.log(
      "[get-works] fetchRowBySlug(" +
        JSON.stringify(slug) +
        "): fromCache=true",
      "totalWorks=" + cached.works.length,
      "imageCount=" + (work?.images?.length ?? 0),
      "sampleIds(W)=[" + wPrefixed.slice(0, 5).join(",") + "]",
      "found=" + (work != null),
    );
    return work;
  }

  console.log(
    "[get-works] fetchRowBySlug(" +
      JSON.stringify(slug) +
      "): fromCache=false, loading from Sheets API (no Drive sort for single row)",
  );
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // 1. まず「IDが並んでいる列（例: A列）」だけを読み込んで、slugが何行目にあるか探す
  const rangeRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${WORKS_SHEET_NAME}!A:A`,
  });

  const ids = rangeRes.data.values || [];
  const idStrings = ids.map((row) => String(row?.[0] ?? ""));
  const wPrefixedFromSheet = idStrings.filter(
    (id) => id.startsWith("W") || id.startsWith("w"),
  );
  console.log(
    "[get-works] fetchRowBySlug: A列取得",
    "rows=" + idStrings.length,
    "sampleIds(W)=[" + wPrefixedFromSheet.slice(0, 8).join(",") + "]",
    "slug in ids=" + idStrings.includes(slug),
  );
  // slugと一致するインデックスを探す（1行目がヘッダーなら +1 する）
  const rowIndex = ids.findIndex((row) => String(row[0]) === slug) + 1;

  if (rowIndex === 0) {
    console.log(
      "[get-works] fetchRowBySlug(" +
        JSON.stringify(slug) +
        "): rowIndex=0 (not found in A column)",
    );
    return null;
  }

  // 2. 特定した行だけを取得する
  const rowRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${WORKS_SHEET_NAME}!A${rowIndex}:Z${rowIndex}`,
  });

  const rowData = rowRes.data.values?.[0] || [];

  const { imageFileIds: _omit, ...work } = rowToWorksRow(rowData);
  void _omit;
  console.log(
    "[get-works] fetchRowBySlug(" +
      slug +
      "): fromCache=false, returned single row",
    "imageCount=" + (work.images?.length ?? 0),
    "(N-column order, no sort)",
  );
  return work;
}

/**
 * generateStaticParams用のID一覧だけを取得する軽量関数
 * シートが存在しない・未設定の場合は空配列を返しビルドを成功させる
 * キャッシュが存在する場合は API を呼ばずキャッシュから取得（ビルド時のレート制限回避）
 */
export async function fetchAllIds(): Promise<string[]> {
  const cached = await readCache();
  if (cached) {
    const ids = cached.works.map((w) => w.id);
    const wIds = ids.filter((id) => id.startsWith("W") || id.startsWith("w"));
    console.log(
      "[get-works] fetchAllIds: fromCache=true",
      "total=" + ids.length,
      "W-prefixed=" + wIds.length,
      "sampleW=" + wIds.slice(0, 5).join(","),
    );
    return ids;
  }

  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) {
    console.log("[get-works] fetchAllIds: no SPREADSHEET_ID, returning []");
    return [];
  }

  try {
    const sheets = await getSheetsClient();
    const rangeRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${WORKS_SHEET_NAME}!A2:A`,
    });
    const ids = (rangeRes.data.values || []).map((row) => String(row[0]));
    const wIds = ids.filter((id) => id.startsWith("W") || id.startsWith("w"));
    console.log(
      "[get-works] fetchAllIds: fromSheet",
      "total=" + ids.length,
      "W-prefixed=" + wIds.length,
      "sampleW=" + wIds.slice(0, 5).join(","),
    );
    return ids;
  } catch (e) {
    console.log("[get-works] fetchAllIds: catch", String(e));
    return ["1"];
  }
}
