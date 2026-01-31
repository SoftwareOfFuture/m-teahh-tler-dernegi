/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We keep the legacy Vite `src/` folder in the repo, but this Next.js app
  // is App Router + TypeScript only. Restricting extensions prevents Next from
  // treating `src/pages/*.jsx` as Pages Router entrypoints.
  pageExtensions: ['ts', 'tsx'],
  // Vercel currently deploys this repo as a static build (monorepo + custom buildCommand).
  // Static export generates `out/`, which matches vercel.json outputDirectory.
  output: 'export',
  images: {
    // Image optimizer is not available in static export mode
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;

