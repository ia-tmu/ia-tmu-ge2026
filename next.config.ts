import type { NextConfig } from "next";
import { getBuildInfo } from "./scripts/get-build-info";

// 開発モードかどうかの判定
const isDev = process.env.NODE_ENV === "development";
// StaticExportをスキップするかどうかの判定
const skipExport = process.env.SKIP_EXPORT === "true";

// ビルド情報を取得
const { buildTime, git } = getBuildInfo();

// Vercel環境（動作確認）かどうかの判定
const isVercel = process.env.VERCEL === "1";
// Vercelではルートパス、本番環境（大学サーバー）では /ge2026 配下とする
// 開発モードでは basePath は不要（ローカル開発では /ge2026 プレフィックスは不要）
const basePath = isDev
  ? ""
  : isVercel
  ? process.env.BASE_PATH || ""
  : "/ge2026";

const nextConfig: NextConfig = {
  // 開発モードでは静的エクスポートを無効化（middlewareを使用するため）
  // 本番ビルド時のみ静的エクスポートを有効化
  ...(isDev || skipExport ? {} : { output: "export" }),
  basePath,
  env: {
    // クライアントサイドでbasePathを参照できるように環境変数として公開
    NEXT_PUBLIC_BASE_PATH: basePath,
    // ビルド日時を記録
    NEXT_PUBLIC_BUILD_TIME: buildTime,
    // Git情報を記録
    NEXT_PUBLIC_GIT_BRANCH: git.branch,
    NEXT_PUBLIC_GIT_SHA: git.sha,
  },
  // 静的エクスポートでは画像の最適化機能が使えないため無効化
  images: {
    unoptimized: true,
  },
  // Apache等の静的ホスティングでディレクトリインデックス（/path/）を正しく機能させる設定
  trailingSlash: true,
};

export default nextConfig;
