import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/news/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
        ],
      },
    ];
  },
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
      {
        source: '/yojana/kanya-sumangala',
        destination: '/yojana/kanya-sumangala-yojana',
        permanent: true,
      },
      {
        source: '/yojana/mahtari-vandan',
        destination: '/yojana/mahtari-vandana',
        permanent: true,
      },
      {
        source: '/yojana/mudra-yojana',
        destination: '/yojana/pm-mudra-yojana',
        permanent: true,
      },
      {
        source: '/yojana/seekho-kamao-yojana',
        destination: '/yojana/sikho-kamao-yojana',
        permanent: true,
      },
      {
        source: '/sarkari-naukri/age-relaxation-rules',
        destination: '/guide/age-relaxation',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
