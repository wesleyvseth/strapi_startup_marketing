import { StrapiSeo } from "@/types/strapi";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";

export const defaultSeo: Metadata = {
  title: "INSERT_TITLE",
  description: "INSERT_DESCRIPTION",
  keywords: "INSERT_KEYWORDS",
  robots: "index, follow",
  openGraph: {
    title: "INSERT_TITLE",
    description: "INSERT_DESCRIPTION",
    type: "website",
    locale: "en_US",
    siteName: "INSERT_SITE_NAME",
  },
  twitter: {
    card: "summary_large_image",
    title: "INSERT_TITLE",
    description: "INSERT_DESCRIPTION",
  },
  alternates: {
    canonical: "https://INSERT_CANONICAL",
  },
  viewport: "width=device-width, initial-scale=1",
};

/**
 * Helper function to create SEO metadata objects with standard fallbacks
 * Automatically cached and invalidated via Strapi webhook
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
  const cachedGetSeoObject = unstable_cache(
    async (seo: Partial<StrapiSeo>): Promise<Metadata> => {
      const defaultTitle = defaultSeo.title as string;
      const defaultDescription = defaultSeo.description as string;
      const defaultKeywords = defaultSeo.keywords as string;
      const defaultSiteName = defaultSeo.openGraph?.siteName as string;
      const defaultCanonical = defaultSeo.alternates?.canonical as string;

      return {
        title: seo?.title || defaultTitle,
        description: seo?.description || defaultDescription,
        keywords: seo?.keywords || defaultKeywords,
        robots: seo?.metaRobots || "index, follow",
        openGraph: {
          title: seo?.title || defaultTitle,
          description: seo?.description || defaultDescription,
          locale: "en_US",
          siteName: defaultSiteName,
          images: seo?.metaImage?.attributes?.attributes?.url
            ? [seo?.metaImage.attributes.attributes.url]
            : undefined,
          url:
            seo?.canonicalURL ||
            (typeof seo?.canonicalURL === "string"
              ? seo?.canonicalURL
              : defaultCanonical),
        },
        twitter: {
          title: seo?.title || defaultTitle,
          description: seo?.description || defaultDescription,
          images: seo?.metaImage?.attributes?.attributes?.url
            ? [seo?.metaImage.attributes.attributes.url]
            : undefined,
        },
        alternates: {
          canonical: seo?.canonicalURL || defaultCanonical,
        },
      };
    },
    ["seo-metadata"],
    {
      tags: ["seo", "strapi"],
      revalidate: false, // Only revalidate via webhook
    }
  );

  return cachedGetSeoObject(seo);
};
