import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'AnoMeme'; // GitHub repository name

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? `/${repoName}` : '',
  basePath: isProd ? `/${repoName}` : '',
  distDir: 'out',
  reactStrictMode: false, // Disable strict mode to prevent double mounting
};

export default nextConfig;