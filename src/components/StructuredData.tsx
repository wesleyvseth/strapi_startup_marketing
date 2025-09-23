import { StrapiSeo } from "@/types/strapi";

interface StructuredDataProps {
  seo: Partial<StrapiSeo>;
  type?: "WebSite" | "Article" | "Organization";
  url?: string;
}

export default function StructuredData({
  seo,
  type = "WebSite",
  url,
}: StructuredDataProps) {
  // Auto-generate basic structured data from SEO data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    name: seo?.title,
    description: seo?.description,
    ...(url && { url }),
    ...(seo?.metaImage?.attributes?.attributes?.url && {
      image: seo?.metaImage.attributes.attributes.url,
    }),
  };

  const jsonString = JSON.stringify(structuredData).replace(/</g, "\\u003c"); // XSS protection

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
