/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { locales, defaultLocale } = require("../i18n.config.js");

// basePathを取得
// 本番環境では常に /ge2026 を使用
// Vercel環境では空文字列（環境変数で制御可能）
const isVercel = process.env.VERCEL === "1";
const basePath = isVercel ? process.env.BASE_PATH || "" : "/ge2026";
const outDir = path.join(process.cwd(), "out");

// index.htmlの内容
const indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>東京都立大学システムデザイン学部・研究科 インダストリアルアート学科・学域 卒業・修了制作研究展2026</title>
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
