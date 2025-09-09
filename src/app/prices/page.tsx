import { fetchFromStrapi } from "@/lib/strapi";
import { getSeoObject } from "@/lib/defaultSeo";
import { Metadata } from "next";
import PricesPage from "@/components/PricesPage";
import { StrapiSeo } from "@/types/strapi";

interface PricesData {
  title: string;
  content?: string;
  metadata: StrapiSeo;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchFromStrapi<PricesData>("price?populate=*");
    return await getSeoObject(data.metadata);
  } catch (error) {
    console.error("Error fetching prices metadata:", error);
    return await getSeoObject({
      title: "Pricing",
      description: "View our pricing plans and packages",
    });
  }
}

export default async function Prices() {
  try {
    const data = await fetchFromStrapi<PricesData>("price?populate=*");
    return <PricesPage data={data} />;
  } catch (error) {
    console.error("Error fetching prices data:", error);
    return (
      <PricesPage
        data={{
          title: "Pricing",
          content: "Content coming soon...",
          metadata: {},
        }}
      />
    );
  }
}
