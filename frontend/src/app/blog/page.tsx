import Link from "next/link";
import type { Metadata } from "next";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog | Marousch Brothers Landscaping" };

async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/blog`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1b4332] mb-8">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-[#636e72] text-center py-12 bg-white rounded-lg border border-[#d8e4dc]">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}
              className="block bg-white rounded-lg p-6 shadow-sm border border-[#d8e4dc] hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-[#2d6a4f] mb-2">{post.title}</h2>
              {post.published_at && <p className="text-sm text-[#636e72] mb-2">{formatDate(post.published_at)}</p>}
              {post.excerpt && <p className="text-[#2d3436]">{post.excerpt}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
