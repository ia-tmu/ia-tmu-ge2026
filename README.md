# 東京都立大学システムデザイン学部・研究科 インダストリアルアート学科・学域 卒業・修了制作研究展 2026

## 開発について

- パッケージ
  - pnpm でパッケージの管理
- 日英対応
  - 文章は基本的に全て public/locales/配下で管理し、言語切り替えに対応
  - client コンポーネントで出し分けを行う
    - 'use client'がファイルのトップにあるもの
- ブランチ
  - 機能単位でブランチ切る
  - staging で他班と共有？

### ファイル構造

- app/i18n.ts
  - 言語切り替え
- app/\[locale\]
  - 基本的にこの中をいじる
  - ブラウザ言語によって ja/en が切り替わる
    - ja の時は prefix なし
    - en の時に url に/en が入る(ja: /works, en: /en/works)
  - page.tsx
    - トップページ
  - layout.tsx
    - 全てのページに共通する要素を設定
  - components
    - 再利用可能なパーツを格納
  - features
    - 機能を含む UI を格納(.tsx)
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

## 環境構築

### 必要な環境

- Node.js >= 20.20.0
- pnpm

### セットアップ手順

1. **Node.js のバージョン管理（nvm を使用する場合）**

   プロジェクトには`.nvmrc`ファイルが含まれています。nvm を使用している場合、以下のコマンドで自動的に正しい Node.js バージョンに切り替わります：

   ```bash
   nvm use
   ```

   nvm がインストールされていない場合は、[nvm のインストール手順](https://github.com/nvm-sh/nvm#installing-and-updating)を参照してください。
   [こっちが参考になるかな？](https://qiita.com/ffggss/items/94f1c4c5d311db2ec71a)

   nvm を使用しない場合でも、Node.js 20.20.0 以上がインストールされている必要があります。

2. **依存関係のインストール**

   ```bash
   pnpm install
   ```

3. **開発サーバーの起動**

   ```bash
   pnpm dev
   ```

4. **ビルド**

   ```bash
   pnpm build
   ```
