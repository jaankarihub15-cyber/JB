# JaankariHub

Government Schemes, Exams & Financial Literacy — India's cleanest info site.

## Quick Start

```bash
npm install
npm run dev     # Local development at localhost:3000
npm run build   # Production build (static export)
```

## Deploy on Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select the repo → Deploy
4. Done. Vercel auto-detects Next.js.

## Adding New Content

No code changes needed. Just add JSON files:

### Add a new scheme page
1. Create `src/content/schemes/your-scheme-slug.json`
2. Follow the schema from `pm-kisan.json`
3. Push to GitHub → Vercel auto-deploys the new page at `/yojana/your-scheme-slug`

### Add a new exam page
1. Create `src/content/exams/exam-slug.json`
2. Follow the schema from `ssc-cgl-2026.json`
3. Push → auto-deploys at `/exam/exam-slug`

### Add a new finance article
1. Create `src/content/paisa/article-slug.json`
2. Follow the schema from `what-is-sip.json`
3. Push → auto-deploys at `/paisa/article-slug`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── check-eligibility/  # Eligibility tool
│   ├── yojana/             # Scheme hub + [slug] detail
│   ├── exam/               # Exam hub + [slug] detail
│   ├── paisa/              # Finance hub + [slug] detail
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── robots.ts           # SEO robots.txt
├── components/             # Shared UI components
├── content/                # JSON content files (drop new ones here)
│   ├── schemes/
│   ├── exams/
│   └── paisa/
└── lib/                    # Content loader utilities
```

## Tech Stack

- **Next.js 16** (App Router, static export)
- **TypeScript**
- **Tailwind CSS v4**
- **Vercel** (hosting)
- Content stored as JSON files — no database needed

## Phase 2 (TODO)

- [ ] Hindi language toggle (AI-generated + human-verified)
- [ ] WhatsApp channel for scheme alerts
- [ ] SIP/PPF calculators
- [ ] AdSense / Ezoic monetization
- [ ] Scale to 500+ pages
