import { MetadataRoute } from "next";
import { fetchFromStrapi } from "@/lib/strapi";
import { StrapiContentList, BlogPost } from "@/types/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const homepage: MetadataRoute.Sitemap[number] = {
    url: baseUrl || "",
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 1,
  };

  // Add your static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cases`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/prices`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ] satisfies MetadataRoute.Sitemap;

  // For dynamic routes
  try {
    // Fetch blog posts for sitemap
    const blogsResponse = await fetchFromStrapi<StrapiContentList<BlogPost>>(
      "blog-posts?fields[0]=slug&fields[1]=publishedAt&fields[2]=updatedAt"
    );

    const blogRoutes: MetadataRoute.Sitemap = (blogsResponse.data || []).map(
      (blog) => ({
        url: `${baseUrl}/blogs/${blog.attributes.slug}`,
        lastModified: new Date(blog.attributes.publishedAt || new Date()),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    );

    return [homepage, ...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Error fetching dynamic routes:", error);
    return [homepage, ...staticRoutes];
  }
}
