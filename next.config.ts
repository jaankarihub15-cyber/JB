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
        source: '/news',
        destination: '/',
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
      {
        source: '/exam/upsc-nda-na',
        destination: '/exam/cds',
        permanent: true,
      },
      {
        source: '/news/8th-pay-commission-delhi-meetings-may-13-14-defence-railway-unions',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/afcat-02-2026-apply-online-142-posts-indian-air-force-may-20',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/cbse-12th-result-2026-declared-85-pass-check-online',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/coal-india-cil-mt-2026-660-vacancies-btech-apply-june-11-coalindia-in',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/coal-india-management-trainee-2026-660-posts-apply-may-12',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/coal-india-mt-2026-applications-open-660-posts-how-to-apply',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/crpf-constable-tradesman-2026-9195-posts-apply-before-may-19',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ctet-september-2026-notification-apply-online-exam-date',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/currency-note-press-recruitment-2026-534-posts-apply-by-may-19',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/delhi-lakhpati-bitiya-yojana-launched-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/drdo-rac-scientist-recruitment-2026-36-vacancies-scientist-c-d-e-apply-june-19-rac-gov-in',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/gpssb-recruitment-2026-2640-posts-pharmacist-mphw-apply-may-20',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/gujarat-board-ssc-10th-result-2026-declared-check-online',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/hbse-haryana-12th-result-2026-declared-84-pass-check-bseh',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/iaf-civilian-recruitment-2026-47-ldc-typist-driver-posts',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ibps-rrb-2026-exam-calendar-out-po-prelims-nov-21-22-clerk-prelims-dec-6-13-notification-june-july',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/indian-army-csbo-2026-190-posts-10th-pass-apply-by-may-31',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/itr-filing-open-fy-2025-26-deadline-july-31-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/lic-hfl-junior-assistant-180-posts-last-date-today',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ncl-apprentice-recruitment-2026-1607-vacancies-apply-june-1-15-nats-naps-portal',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/nda-1-result-2026-upsc-7903-candidates-qualify-ssb',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/neet-ug-2026-answer-key-released-check-score-raise-objections',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/neet-ug-2026-cancelled-paper-leak-re-exam-dates-cbi-probe',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/pm-internship-scheme-2026-rs-9000-stipend-apply-now',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/pm-kisan-23rd-installment-2026-expected-date-ekyc-status-check',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/pm-mudra-yojana-11-years-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/pmgsy-iii-extended-2028-rs-84000-crore-rural-roads',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/pseb-10th-result-2026-declared-punjab-board-94-pass',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/rbi-grade-b-2026-notification-60-posts-apply-now',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/rpsc-1st-grade-teacher-exam-may-31-2026-3225-posts-admit-card',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/rrb-alp-2026-notification-out-11127-vacancies-apply-june-14-cen-01-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/rrb-je-cbt-2-exam-date-2026-july-2-admit-card-june-28-2585-posts',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/rrc-secr-raipur-apprentice-2026-1644-posts-apply-by-june-4',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/rssb-teaching-associate-3540-posts-may-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/sbi-apprentice-recruitment-2026-7150-posts-apply-online-june-8',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/secr-railway-apprentice-2026-1644-posts-apply-online',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/small-savings-rates-unchanged-april-june-2026',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ssb-constable-gd-sports-quota-2026-404-posts-apply-by-june-7',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ssc-cgl-2026-notification-expected-may-15000-vacancies',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ssc-cgl-2026-notification-out-12256-vacancies-apply-online-ssc-gov-in',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ssc-chsl-2026-last-3-days-apply-may-31-3000-vacancies-ldc-jsa-deo',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ssc-gd-constable-2026-cbt-last-phase-may-25-30-25487-vacancies-result-date',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ssc-gd-constable-cbt-ends-today-may-30-2026-39481-vacancies-result-july-what-next',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ssc-stenographer-2026-731-posts-fee-deadline-may-16',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/ssc-stenographer-2026-apply-online-731-posts',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/union-bank-apprentice-2026-1865-posts-apply-before-may-19',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/union-bank-india-apprentice-recruitment-2026-1865-posts-apply-online',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/upsc-cds-2-2026-notification-out-451-vacancies-ima-ina-afa-ota-apply-june-9',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/upsc-cse-prelims-2026-conducted-today-may-24-8-19-lakh-candidates-answer-key-result-date',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/upsc-cse-prelims-2026-may-24-admit-card-last-minute-tips',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/upsc-prelims-2026-day-after-tomorrow-may-24-final-checklist',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/upsc-prelims-2026-paper-analysis-history-heavy-moderate-difficult-expected-cutoff-82-100',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/upsc-prelims-2026-tomorrow-may-24-final-exam-day-guidelines',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/upsssc-agriculture-technical-assistant-2026-2759-posts-apply-online',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
