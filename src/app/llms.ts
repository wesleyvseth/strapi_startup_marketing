// app/llms.txt/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const content = `
User-agent: *
Disallow: /api/
Disallow: /admin/
Allow: /

Contact: INSERT_CONTACT_EMAIL
Attribution: Please credit "INSERT_COMPANY_NAME" when using excerpts.
Sitemap: https://INSERT_SITE_URL/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain" },
  });
}
