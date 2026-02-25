/**
 * ビルド前に Google Sheets から作品データを1回取得し、ローカルにキャッシュする。
 * 静的エクスポート時の API レート制限（429）を回避するため、ビルド前に実行すること。
 *
 * 使用方法: pnpm run fetch-works
 */
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { fetchSheetValues } from "../lib/get-works";

const CACHE_DIR = join(process.cwd(), "local");
const CACHE_FILE = join(CACHE_DIR, "works-build-cache.json");

async function main() {
  // .env.local を読み込み（Next.js と同様）
  try {
    const envPath = join(process.cwd(), ".env.local");
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = value;
      }
    }
  } catch {
    // .env.local がなくても続行（環境変数が既に設定されている場合）
  }

  console.log("Fetching works data from Google Sheets...");
  const data = await fetchSheetValues();
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Cached ${data.works.length} works to ${CACHE_FILE}`);
}

main().catch((e) => {
  console.error("Failed to fetch works:", e);
  process.exit(1);
});
