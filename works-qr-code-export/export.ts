import fs from "node:fs";
import path from "node:path";
import { STATIC_WORK_IDS } from "../app/constants";
import { generateQRCodeImage } from "../app/[locale]/lib/qr-code";

const BASE_URL = "https://industrial-art.sd.tmu.ac.jp/ge2026/works";
const OUTPUT_DIRS = ["local/web-qr-code", "public/qr-codes/works"];

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

  console.log(`\n完了: ${successCount}/${STATIC_WORK_IDS.length} 件のQRコードを書き出しました。`);
}

main().catch(console.error);
