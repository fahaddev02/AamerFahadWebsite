import './patch-fs.cjs';

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let basePath = process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || '';
let assetPrefix = basePath ? `${basePath}/` : '';

if (!basePath && isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, '') || '';
  if (repo && !repo.endsWith('.github.io')) {
    basePath = `/${repo}`;
    assetPrefix = `/${repo}/`;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  assetPrefix: assetPrefix || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
