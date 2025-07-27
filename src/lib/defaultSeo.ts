import { StrapiSeo } from "@/types/strapi";
import { Metadata } from "next";

export const defaultSeo: Metadata = {
  title: "Lyara - CRM",
  description:
    "Professional CRM solutions to grow your business. Discover innovative strategies and expert guidance.",
  keywords:
    "CRM, customer relationship management, business growth, sales automation, lead management",
  robots: "index, follow",
  openGraph: {
    title: "Lyara - CRM",
    description:
      "Professional CRM solutions to grow your business. Discover innovative strategies and expert guidance.",
    type: "website",
    locale: "en_US",
    siteName: "Lyara",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyara - CRM",
    description:
      "Professional CRM solutions to grow your business. Discover innovative strategies and expert guidance.",
  },
  alternates: {
    canonical: "https://lyara.com",
  },
  viewport: "width=device-width, initial-scale=1",
};

/**
 * Helper function to create SEO metadata objects with standard fallbacks
 *
 * @param seo - Partial metadata object with your custom values
 * @returns Complete metadata object with fallbacks applied
 *
 * @example
 * // Simple usage with just title and description
 * const metadata = await getSeoObject({
 *   title: "About Us",
 *   description: "Learn more about our company"
 * });
 *
 * @example
 * // Advanced usage with custom images and canonical URL
 * const metadata = await getSeoObject({
 *   title: "Contact Us",
 *   description: "Get in touch with our team",
 *   alternates: {
 *     canonical: "https://lyara.com/contact"
 *   },
 *   openGraph: {
 *     images: [{ url: "/contact-og.jpg", width: 1200, height: 630 }]
 *   }
 * });
 */
export const getSeoObject = async (
  seo: Partial<StrapiSeo>
): Promise<Metadata> => {
  const defaultTitle = "Lyara - CRM";
  const defaultDescription =
    "Professional CRM solutions to grow your business. Discover innovative strategies and expert guidance.";
  const defaultKeywords =
    "CRM, customer relationship management, business growth, sales automation, lead management";
  const defaultSiteName = "Lyara";
  const defaultCanonical = "https://lyara.io";

  return {
    title: seo.title || defaultTitle,
    description: seo.description || defaultDescription,
    keywords: seo.keywords || defaultKeywords,
    robots: seo.metaRobots || "index, follow",
    openGraph: {
      title: seo.title || defaultTitle,
      description: seo.description || defaultDescription,
      locale: "en_US",
      siteName: defaultSiteName,
      images: seo.metaImage?.attributes?.attributes?.url
        ? [seo.metaImage.attributes.attributes.url]
        : undefined,
      url:
        seo.canonicalURL ||
        (typeof seo.canonicalURL === "string"
          ? seo.canonicalURL
          : defaultCanonical),
    },
    twitter: {
      title: seo.title || defaultTitle,
      description: seo.description || defaultDescription,
      images: seo.metaImage?.attributes?.attributes?.url
        ? [seo.metaImage.attributes.attributes.url]
        : undefined,
    },
    alternates: {
      canonical: seo.canonicalURL || defaultCanonical,
    },
    viewport: seo.metaViewport || "width=device-width, initial-scale=1",
  };
};
