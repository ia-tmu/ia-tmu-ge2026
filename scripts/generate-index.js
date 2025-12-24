/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { locales, defaultLocale } = require("../i18n.config.js");

// basePathを取得
// 本番環境では常に /ge2026 を使用
// Vercel環境では空文字列（環境変数で制御可能）
const isVercel = process.env.VERCEL === "1";
const basePath = isVercel ? process.env.BASE_PATH || "" : "/ge2026";
const outDir = path.join(process.cwd(), "out");

const baseUrl =
  isVercel && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}${basePath}/`
    : "https://industrial-art.sd.tmu.ac.jp/ge2026/";

const title =
  "東京都立大学システムデザイン学部・研究科 インダストリアルアート学科・学域 卒業・修了制作研究展2026";
const description =
  "インダストリアルアート学科・学域の卒業・修了制作研究展を開催します。2026年3月1日(日)〜3月7日(土)（3月2日(月)は休館日） @東京都美術館 ギャラリーA・B【入場無料】 会期：9:30 - 17:30（最終入場17:00） 最終日3/7は 9:30 - 12:00（最終入場11:30）";
const ogpImageUrl = `${baseUrl}images/ogp.png`;

// index.htmlの内容
const indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${baseUrl}">
  <meta property="og:site_name" content="${title}">
  <meta property="og:image" content="${ogpImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="ja_JP">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@tmu_ia_sotsuten">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogpImageUrl}">
  <link rel="canonical" href="${baseUrl}">
  <script>
    (function() {
      // サポートされているロケール
      const supportedLocales = ${JSON.stringify(locales)};
      const defaultLocale = '${defaultLocale}';
      
      // ブラウザの言語設定を取得
      const browserLang = navigator.language || navigator.userLanguage;
      const lang = browserLang.toLowerCase().split('-')[0];
      
      // サポートされているロケールかチェック
      const locale = supportedLocales.includes(lang) ? lang : defaultLocale;
      
      // basePathを考慮したリダイレクト
      const basePath = '${basePath}';
      const redirectPath = basePath ? basePath + '/' + locale + '/' : '/' + locale + '/';
      
      // リダイレクト実行
      window.location.replace(redirectPath);
    })();
  </script>
</head>
<body>
  <p>リダイレクト中...</p>
</body>
</html>
`;

// index.htmlを書き込み
const indexPath = path.join(outDir, "index.html");
fs.writeFileSync(indexPath, indexHtml, "utf-8");
console.log("✓ Generated index.html for root redirect");

// ビルド情報を書き込み (version.json)
let gitBranch = "unknown";
let gitSha = "unknown";
try {
  gitBranch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  gitSha = execSync("git rev-parse --short HEAD").toString().trim();
} catch (e) {
  // ignore error
}

const buildInfo = {
  buildTime: new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
  git: {
    branch: gitBranch,
    sha: gitSha,
  },
  basePath,
};
const versionPath = path.join(outDir, "version.json");
fs.writeFileSync(versionPath, JSON.stringify(buildInfo, null, 2), "utf-8");
console.log("✓ Generated version.json with build info");
