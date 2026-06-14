// Middleware disabled — was running on every request, consuming 80% of Vercel
// free-tier CPU. Old WordPress URLs will 404 naturally (Google already processed
// the 410s). The one 301 redirect was moved to next.config.ts.

export const config = { matcher: [] };
