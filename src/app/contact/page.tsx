import { fetchFromStrapi } from "@/lib/strapi";
import { getSeoObject } from "@/lib/defaultSeo";
import { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

interface ContactData {
  title: string;
  content?: string;
  metadata: any;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchFromStrapi<ContactData>("contact?populate=*");
    return await getSeoObject(data.metadata);
  } catch (error) {
    console.error("Error fetching contact metadata:", error);
    return await getSeoObject({
      title: "Contact Us",
      description: "Get in touch with our team",
    });
  }
}

export default async function Contact() {
  try {
    const data = await fetchFromStrapi<ContactData>("contact?populate=*");
    return <ContactPage data={data} />;
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return (
      <ContactPage
        data={{
          title: "Contact Us",
          content: "Content coming soon...",
          metadata: {},
        }}
      />
    );
  }
}
