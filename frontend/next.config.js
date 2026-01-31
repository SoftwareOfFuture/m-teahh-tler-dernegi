/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We keep the legacy Vite `src/` folder in the repo, but this Next.js app
  // is App Router + TypeScript only. Restricting extensions prevents Next from
  // treating `src/pages/*.jsx` as Pages Router entrypoints.
  pageExtensions: ['ts', 'tsx'],
  images: {
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

