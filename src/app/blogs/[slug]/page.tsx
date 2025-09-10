import { fetchFromStrapi } from "@/lib/strapi";
import { getSeoObject } from "@/lib/defaultSeo";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StrapiContentList, StrapiContent } from "@/types/strapi";
import type { BlogPost } from "@/types/strapi";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const response = await fetchFromStrapi<BlogPost>(
      `blog-posts?filters[slug][$eq]=${slug}&populate=*`
    );

    if (!response) {
      return await getSeoObject({
        title: "Blog Post Not Found",
        description: "The requested blog post could not be found.",
      });
    }

    const post = response;
    return await getSeoObject(
      post.metadata || {
        title: post.title,
        description: post.excerpt || `Read ${post.title} on our blog`,
      }
    );
  } catch (error) {
    console.error("Error generating metadata:", error);
    return await getSeoObject({
      title: "Blog Post",
      description: "Read our latest blog post",
    });
  }
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  try {
    const { slug } = await params;

    const response = await fetchFromStrapi<BlogPost[]>(
      `blog-posts?filters[slug][$eq]=${slug}&populate=*`
    );

    if (!response) {
      notFound();
    }

    const post = response[0];

    console.log("Full response:", response);
    console.log("Post attributes:", post);
    return (
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <Link
            href="/blogs"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Blog
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          {post.publishedAt && (
            <time className="text-gray-600">
              Published on{" "}
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}

          {post.excerpt && (
            <div className="mt-4 text-lg text-gray-700 font-medium">
              {post.excerpt}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.content ? (
            <BlocksRenderer content={post.content} />
          ) : (
            <p className="text-gray-600 italic">
              Content for this blog post is being prepared. Please check back
              soon!
            </p>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <Link
            href="/blogs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to all posts
          </Link>
        </footer>
      </article>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}
