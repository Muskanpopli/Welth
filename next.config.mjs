import nextPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  // optional: to enable React strict mode
  reactStrictMode: true,
};

const withPWA = nextPWA({
  dest: 'public',
  disable: false, // allow it in dev too for testing
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
