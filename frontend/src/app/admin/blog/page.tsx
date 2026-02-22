"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { BlogPost } from "@/lib/types";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  const load = () => { api.get("/blog/admin").then((r) => setPosts(r.data)); };
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    await api.delete(`/blog/${id}`);
    toast.success("Post deleted.");
    load();
  };

  if (!posts) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e0d5b8] border-t-[#b8860b]" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Blog Posts</h1>
        <Link href="/admin/blog/new" className="bg-[#b8860b] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1a1a1a]">+ New Post</Link>
      </div>
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="bg-white rounded-lg p-4 border border-[#e0d5b8] flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-[#b8860b]">{p.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${p.status === "published" ? "bg-[#fce588] text-[#1a1a1a]" : "bg-gray-200 text-gray-600"}`}>
                {p.status}
              </span>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/blog/${p.id}/edit`} className="text-[#b8860b] text-sm hover:text-[#d4a017]">Edit</Link>
              <button onClick={() => remove(p.id)} className="text-red-500 text-sm hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
