import type { NextConfig } from "next";

// 開発モードかどうかの判定
const isDev = process.env.NODE_ENV === "development";
// Vercel環境（動作確認）かどうかの判定
const isVercel = process.env.VERCEL === "1";
// Vercelではルートパス、本番環境（大学サーバー）では /ge2026 配下とする
// 開発モードでは basePath は不要（ローカル開発では /ge2026 プレフィックスは不要）
const basePath = isDev ? "" : isVercel ? "" : "/ge2026";

const nextConfig: NextConfig = {
  // 開発モードでは静的エクスポートを無効化（middlewareを使用するため）
  // 本番ビルド時のみ静的エクスポートを有効化
  ...(isDev ? {} : { output: "export" }),
  basePath,
  // 静的エクスポートでは画像の最適化機能が使えないため無効化
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
