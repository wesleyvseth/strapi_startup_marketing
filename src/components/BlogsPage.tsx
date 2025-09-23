import Link from "next/link";
import { StrapiContent, BlogPost, StrapiContentList } from "@/types/strapi";

interface BlogsPageData {
  title: string;
  content?: string;
  metadata: any;
}

interface BlogsPageProps {
  data: BlogsPageData;
  posts?: BlogPost[];
}

export default function BlogsPage({ data, posts = [] }: BlogsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{data.title}</h1>

      {data.content && (
        <div className="prose max-w-none mb-8">
          <p>{data.content}</p>
        </div>
      )}

      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/blogs/${post.slug}`} key={post.slug}>
              <article
                key={post.slug}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">
                  <span className="text-blue-600 hover:text-blue-800 no-underline">
                    {post.title}
                  </span>
                </h3>

                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {post.publishedAt && (
                  <time className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </time>
                )}

                <div className="mt-4">
                  <span className="text-blue-600 hover:text-blue-800 font-medium">
                    Read more →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No blog posts available yet.</p>
        </div>
      )}
    </div>
  );
}
