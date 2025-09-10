import { fetchFromStrapi } from "@/lib/strapi";
import { getSeoObject } from "@/lib/defaultSeo";
import { Metadata } from "next";
import BlogsPage from "@/components/BlogsPage";
import { StrapiSeo, StrapiContentList, BlogPost } from "@/types/strapi";

interface BlogsData {
  title: string;
  content?: string;
  metadata: StrapiSeo;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchFromStrapi<BlogsData>("blog?populate=*");
    return await getSeoObject(data.metadata);
  } catch (error) {
    console.error("Error fetching blogs metadata:", error);
    return await getSeoObject({
      title: "Our Blog",
      description: "Read our latest articles and insights",
    });
  }
}

export default async function Blogs() {
  try {
    // Fetch the blogs page content (single type)
    const pageData = await fetchFromStrapi<BlogsData>("blog?populate=*");

    // Fetch the blog posts (collection type)
    const postsResponse = await fetchFromStrapi<BlogPost[]>(
      "blog-posts?populate=*&sort=publishedAt:desc"
    );

    console.log(pageData, postsResponse);

    return <BlogsPage data={pageData} posts={postsResponse || []} />;
  } catch (error) {
    console.error("Error fetching blogs data:", error);
    return (
      <BlogsPage
        data={{
          title: "Our Blog",
          content:
            "Stay updated with our latest insights, tutorials, and company news.",
          metadata: {},
        }}
        posts={[]}
      />
    );
  }
}
