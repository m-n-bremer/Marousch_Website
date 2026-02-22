import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/blog/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/blog" className="text-[#2d6a4f] hover:text-[#52b788] mb-6 inline-block">&larr; Back to Blog</Link>
      <h1 className="text-4xl font-bold text-[#1b4332] mb-4">{post.title}</h1>
      {post.published_at && <p className="text-[#636e72] mb-8">{formatDate(post.published_at)}</p>}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-[#d8e4dc] prose max-w-none">
        <ReactMarkdown>{post.content || ""}</ReactMarkdown>
      </div>
    </div>
  );
}
