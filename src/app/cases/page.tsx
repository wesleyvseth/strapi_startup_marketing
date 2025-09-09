import { fetchFromStrapi } from "@/lib/strapi";
import { getSeoObject } from "@/lib/defaultSeo";
import { Metadata } from "next";
import CasesPage from "@/components/CasesPage";
import { StrapiSeo } from "@/types/strapi";

interface CasesData {
  title: string;
  content?: string;
  metadata: StrapiSeo;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchFromStrapi<CasesData>("case?populate=*");
    return await getSeoObject(data.metadata);
  } catch (error) {
    console.error("Error fetching cases metadata:", error);
    return await getSeoObject({
      title: "Our Cases",
      description: "Explore our successful projects and case studies",
    });
  }
}

export default async function Cases() {
  try {
    const data = await fetchFromStrapi<CasesData>("case?populate=*");
    return <CasesPage data={data} />;
  } catch (error) {
    console.error("Error fetching cases data:", error);
    return (
      <CasesPage
        data={{
          title: "Our Cases",
          content: "Content coming soon...",
          metadata: {},
        }}
      />
    );
  }
}
