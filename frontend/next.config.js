/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // App Router + TypeScript only
  pageExtensions: ['ts', 'tsx'],
  // Vercel currently deploys this repo as a static build (monorepo + custom buildCommand).
  // Static export generates `out/`, which matches vercel.json outputDirectory.
  output: 'export',
  // IMPORTANT for static hosting: export routes as /route/index.html
  // so clean URLs like /platform-admin work on Vercel.
  trailingSlash: true,
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

