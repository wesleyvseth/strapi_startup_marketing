import { fetchFromStrapi } from "@/lib/strapi";
import { getSeoObject } from "@/lib/defaultSeo";
import { Metadata } from "next";
import ReviewsPage from "@/components/ReviewsPage";
import { StrapiSeo } from "@/types/strapi";

interface ReviewsData {
  title: string;
  content?: string;
  metadata: StrapiSeo;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchFromStrapi<ReviewsData>("review?populate=*");
    return await getSeoObject(data.metadata);
  } catch (error) {
    console.error("Error fetching reviews metadata:", error);
    return await getSeoObject({
      title: "Reviews",
      description: "What our clients say about us",
    });
  }
}

export default async function Reviews() {
  try {
    const data = await fetchFromStrapi<ReviewsData>("review?populate=*");
    return <ReviewsPage data={data} />;
  } catch (error) {
    console.error("Error fetching reviews data:", error);
    return (
      <ReviewsPage
        data={{
          title: "Reviews",
          content: "Content coming soon...",
          metadata: {},
        }}
      />
    );
  }
}
