import { fetchFromStrapi } from "@/lib/strapi";
import { getSeoObject } from "@/lib/defaultSeo";
import { Metadata } from "next";
import BlogsPage from "@/components/BlogsPage";

interface BlogsData {
  title: string;
  content?: string;
  metadata: any;
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
    const data = await fetchFromStrapi<BlogsData>("blog?populate=*");
    return <BlogsPage data={data} />;
  } catch (error) {
    console.error("Error fetching blogs data:", error);
    return (
      <BlogsPage
        data={{
          title: "Our Blog",
          content: "Content coming soon...",
          metadata: {},
        }}
      />
    );
  }
}
