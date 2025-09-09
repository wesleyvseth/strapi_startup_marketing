import { fetchFromStrapi } from "@/lib/strapi";
import { getSeoObject } from "@/lib/defaultSeo";
import { Metadata } from "next";
import FaqPage from "@/components/FaqPage";
import { StrapiSeo } from "@/types/strapi";

interface FaqData {
  title: string;
  content?: string;
  metadata: StrapiSeo;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchFromStrapi<FaqData>("faq?populate=*");
    return await getSeoObject(data.metadata);
  } catch (error) {
    console.error("Error fetching FAQ metadata:", error);
    return await getSeoObject({
      title: "Frequently Asked Questions",
      description: "Find answers to common questions",
    });
  }
}

export default async function Faq() {
  try {
    const data = await fetchFromStrapi<FaqData>("faq?populate=*");
    return <FaqPage data={data} />;
  } catch (error) {
    console.error("Error fetching FAQ data:", error);
    return (
      <FaqPage
        data={{
          title: "Frequently Asked Questions",
          content: "Content coming soon...",
          metadata: {},
        }}
      />
    );
  }
}
