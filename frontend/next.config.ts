import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker/本番デプロイ用スタンドアロンビルド
  output: "standalone",
};

export default nextConfig;
