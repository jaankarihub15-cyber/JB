import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Old WordPress URL patterns from previous domain owner
// These return 200 with empty body currently — must return 410 Gone
const WORDPRESS_OLD_PATTERNS = [
  // Travel/tourism content
  /discovering-the-top/,
  /visiting-places/,
  /places-in-delhi/,
  /travel-guide/,
  /tourism/,
  // Celebrity/biography content
  /mahatma-gandhi/,
  /life-of-gandhi/,
  /biography/,
  /steven-smith/,
  /cricket-profile/,
  /celebrity/,
  // Generic blog content from previous owner
  /social-media-impact/,
  /top-most/,
  /nearest-metro/,
  /location-nearest/,
  /discovering/,
  // WordPress specific paths
  /wp-content/,
  /wp-admin/,
  /wp-login/,
  /xmlrpc/,
  /feed\/?$/,
  // Old category URLs
  /\/category\//,
  /\/tag\//,
  /\/author\//,
  /\/page\/\d+/,
  /\?p=\d+/,
  /\?cat=\d+/,
  /\?page_id=\d+/,
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const fullPath = pathname + search;

  // Check if this matches any old WordPress pattern
  const isOldWordPress = WORDPRESS_OLD_PATTERNS.some((pattern) =>
    pattern.test(fullPath)
  );

  if (isOldWordPress) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en-IN">
<head><title>Page Not Found | KnowledgeKendra</title>
<meta name="robots" content="noindex,follow">
</head>
<body>
<h1>This page has been permanently removed.</h1>
<p>Visit <a href="https://knowledgekendra.com">KnowledgeKendra</a> for government schemes, exam guides, and financial literacy.</p>
</body>
</html>`,
      {
        status: 410,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Robots-Tag": "noindex",
        },
      }
    );
  }

  // 301 redirects for consolidated pages (to prevent SEO cannibalization)
  const REDIRECTS_301: Record<string, string> = {
    "/sarkari-naukri/age-relaxation-rules": "/guide/age-relaxation",
  };

  if (REDIRECTS_301[pathname]) {
    return NextResponse.redirect(new URL(REDIRECTS_301[pathname], request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
