import { fetchFromStrapi } from "@/lib/strapi";
import { getSeoObject } from "@/lib/defaultSeo";
import { Metadata } from "next";
import TeamPage from "@/components/TeamPage";

interface TeamData {
  title: string;
  content?: string;
  metadata: any;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchFromStrapi<TeamData>("team?populate=*");
    return await getSeoObject(data.metadata);
  } catch (error) {
    console.error("Error fetching team metadata:", error);
    return await getSeoObject({
      title: "Our Team",
      description: "Meet the people behind our success",
    });
  }
}

export default async function Team() {
  try {
    const data = await fetchFromStrapi<TeamData>("team?populate=*");
    return <TeamPage data={data} />;
  } catch (error) {
    console.error("Error fetching team data:", error);
    return (
      <TeamPage
        data={{
          title: "Our Team",
          content: "Content coming soon...",
          metadata: {},
        }}
      />
    );
  }
}
