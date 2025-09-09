import { fetchFromStrapi } from "@/lib/strapi";
import { Metadata } from "next";
import { defaultSeo, getSeoObject } from "@/lib/defaultSeo";
import { HomePage } from "@/types/strapi/homepage";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const homepageData = await fetchFromStrapi<HomePage>("homepage?populate=*");

    console.log("homepageData", homepageData);

    return defaultSeo;

    // return await getSeoObject(homepageData.metadata);
  } catch (error) {
    console.error("Error fetching SEO metadata:", error);

    return defaultSeo;
  }
}

export default async function Home() {
  const homepageData = await fetchFromStrapi<HomePage>("homepage");

  return <div>setup</div>;
}
