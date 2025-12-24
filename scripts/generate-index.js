/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { locales, defaultLocale } = require("../i18n.config.js");
const siteConfig = require("../site.config.js");
const { getBuildInfo } = require("./get-build-info.js");

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

const {
  title,
  description,
  twitterSite,
  defaultLocale: siteLocale,
} = siteConfig;
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
  <meta property="og:locale" content="${siteLocale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="${twitterSite}">
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
const { buildTime, git } = getBuildInfo();

const buildInfo = {
  buildTime,
  git,
  basePath,
};
const versionPath = path.join(outDir, "version.json");
fs.writeFileSync(versionPath, JSON.stringify(buildInfo, null, 2), "utf-8");
console.log("✓ Generated version.json with build info");
