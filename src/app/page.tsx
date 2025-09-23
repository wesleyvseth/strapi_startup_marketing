import { fetchFromStrapi } from "@/lib/strapi";
import { Metadata } from "next";
import { defaultSeo, getSeoObject } from "@/lib/defaultSeo";

import HomePage from "@/components/HomePage";
import StructuredData from "@/components/StructuredData";
import { StrapiSeo } from "@/types/strapi";

interface HomePageType {
  title: string;
  content?: string;
  metadata: StrapiSeo;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const homepageData = await fetchFromStrapi<HomePageType>(
      "homepage?populate=*"
    );

    return await getSeoObject(homepageData.metadata);
  } catch (error) {
    console.error("Error fetching SEO metadata:", error);

    return defaultSeo;
  }
}

export default async function Home() {
  const homepageData = await fetchFromStrapi<HomePageType>("homepage");

  return (
    <>
      <StructuredData
        seo={homepageData.metadata}
        url={process.env.NEXT_PUBLIC_SITE_URL}
      />
      <HomePage data={homepageData} />
    </>
  );
}
