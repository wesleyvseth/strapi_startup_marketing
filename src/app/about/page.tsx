import { fetchFromStrapi } from "@/lib/strapi";
import { getSeoObject } from "@/lib/defaultSeo";
import { Metadata } from "next";
import AboutPage from "@/components/AboutPage";

interface AboutData {
  title: string;
  content?: string;
  metadata: any;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchFromStrapi<AboutData>("about?populate=*");
    return await getSeoObject(data.metadata);
  } catch (error) {
    console.error("Error fetching about metadata:", error);
    return await getSeoObject({
      title: "About Us",
      description: "Learn more about our company",
    });
  }
}

export default async function About() {
  try {
    const data = await fetchFromStrapi<AboutData>("about?populate=*");
    return <AboutPage data={data} />;
  } catch (error) {
    console.error("Error fetching about data:", error);
    return (
      <AboutPage
        data={{
          title: "About Us",
          content: "Content coming soon...",
          metadata: {},
        }}
      />
    );
  }
}
