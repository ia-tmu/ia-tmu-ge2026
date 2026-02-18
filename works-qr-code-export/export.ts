import fs from "node:fs";
import path from "node:path";
import { STATIC_WORK_IDS } from "../app/constants";
import { generateQRCodeImage } from "../app/[locale]/lib/qr-code";

const BASE_URL = "https://industrial-art.sd.tmu.ac.jp/ge2026/works";
const OUTPUT_DIRS = ["local/web-qr-code", "public/qr-codes/works"];

/** ID一覧からプレフィックス別の欠番を検出して返す（例: A03, B10） */
function findMissingIds(workIds: string[]): string[] {
  const byPrefix = new Map<string, Set<number>>();

  for (const id of workIds) {
    const match = id.match(/^([ABW])(\d{2})$/);
    if (!match) continue;
    const [, prefix, numStr] = match;
    const num = parseInt(numStr, 10);
    if (!byPrefix.has(prefix)) {
      byPrefix.set(prefix, new Set());
    }
    byPrefix.get(prefix)!.add(num);
  }

  const missing: string[] = [];
  for (const [prefix, nums] of byPrefix) {
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    for (let n = min; n <= max; n++) {
      if (!nums.has(n)) {
        missing.push(`${prefix}${n.toString().padStart(2, "0")}`);
      }
    }
  }
  return missing.sort();
}

async function main() {
  const projectRoot = process.cwd();
  const outputPaths = OUTPUT_DIRS.map((dir) => path.join(projectRoot, dir));

  for (const outputPath of outputPaths) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  console.log(`QRコードを ${outputPaths.join(" と ")} に書き出します...`);

  let successCount = 0;
  for (const workId of STATIC_WORK_IDS) {
    const url = `${BASE_URL}/${workId}`;
    try {
      const dataUrl = await generateQRCodeImage(url);
      const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64, "base64");
      for (const outputPath of outputPaths) {
        const filePath = path.join(outputPath, `${workId}.png`);
        fs.writeFileSync(filePath, buffer);
      }
      successCount++;
      console.log(`  ✓ ${workId}.png`);
    } catch (err) {
      console.error(`  ✗ ${workId}:`, err);
    }
  }

  console.log(
    `\n完了: ${successCount}/${STATIC_WORK_IDS.length} 件のQRコードを書き出しました。`,
  );

  const missingIds = findMissingIds(STATIC_WORK_IDS);
  if (missingIds.length > 0) {
    console.log(`\n※ 欠番（存在しないID）: ${missingIds.join(", ")}`);
  }
}

main().catch(console.error);
