import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Using default Vercel deployment (not static export)
  // This allows API routes for OG images and future ISR
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.knowledgekendra.com' }],
        destination: 'https://knowledgekendra.com/:path*',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
