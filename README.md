# 東京都立大学システムデザイン学部・研究科 インダストリアルアート学科・学域 卒業・修了制作研究展2026

## 開発について

- app/i18n.ts
  - 言語切り替え
- app/\[locale\]
  - 基本的にこの中をいじる
  - ブラウザ言語によってja/enが切り替わる
    - jaの時はprefixなし
    - enの時にurlに/enが入る(ja: /works, en: /en/works)
  - page.tsx
    - トップページ
  - layout.tsx
    - 全てのページに共通する要素を設定
  - components
    - 再利用可能なパーツを格納
  - features
    - 機能を含むUIを格納(.tsx)
  - lib
    - 機能を提供（.ts）
  - works
    - page.tsx
      - 作品一覧ページ
    - \[slug\]
      - page.tsx
        - 個別作品ページ
