// app/llms.ts
export interface LlmsConfig {
  userAgent: string;
  disallow: string[];
  allow: string;
  contact: string;
  attribution: string;
  sitemap: string;
}

export default function llms(): LlmsConfig {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://INSERT_SITE_URL";
  const contactEmail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "INSERT_CONTACT_EMAIL";
  const companyName =
    process.env.NEXT_PUBLIC_COMPANY_NAME || "INSERT_COMPANY_NAME";

  return {
    userAgent: "*",
    disallow: ["/api/", "/admin/"],
    allow: "/",
    contact: contactEmail,
    attribution: `Please credit "${companyName}" when using excerpts.`,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
