import { MetadataRoute } from "next";
import { fetchFromStrapi } from "@/lib/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get your base URL from environment variable
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lyara.io"; // Replace with your actual domain

  // Fetch dynamic routes from Strapi
  // Add more fetch calls based on your content types
  const homepage: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 1,
  };

  // Add your static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ] satisfies MetadataRoute.Sitemap;

  // For dynamic routes
  try {
    // const blogsResponse = await fetchFromStrapi<any>("blogs?populate=*");
    // const blogRoutes: MetadataRoute.Sitemap = blogsResponse.data.map(
    //   (blog: Blog) => ({
    //     url: `${baseUrl}/blogs/${blog.attributes.slug}`,
    //     lastModified: new Date(blog.attributes.updatedAt),
    //     changeFrequency: "monthly",
    //     priority: 0.7,
    //   })
    // );

    // return [homepage, ...staticRoutes, ...blogRoutes];
    return [homepage, ...staticRoutes];
  } catch (error) {
    console.error("Error fetching dynamic routes:", error);
    return [homepage, ...staticRoutes];
  }
}
