# 東京都立大学システムデザイン学部・研究科 インダストリアルアート学科・学域 卒業・修了制作研究展2026

## 開発について

- パッケージ
  - pnpmでパッケージの管理
- 日英対応
  - 文章は基本的に全てpublic/locales/配下で管理し、言語切り替えに対応
  - clientコンポーネントで出し分けを行う
    - 'use client'がファイルのトップにあるもの
- ブランチ
  - 機能単位でブランチ切る
  - stagingで他班と共有？

### ファイル構造

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
- public
  - locales
    - 基本的に全ての文章をここで管理、日英で出しわけ
