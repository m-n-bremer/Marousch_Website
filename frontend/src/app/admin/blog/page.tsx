"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { BlogPost } from "@/lib/types";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const load = () => { api.get("/blog/admin").then((r) => setPosts(r.data)); };
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    await api.delete(`/blog/${id}`);
    toast.success("Post deleted.");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1b4332]">Blog Posts</h1>
        <Link href="/admin/blog/new" className="bg-[#2d6a4f] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1b4332]">+ New Post</Link>
      </div>
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="bg-white rounded-lg p-4 border border-[#d8e4dc] flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-[#2d6a4f]">{p.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${p.status === "published" ? "bg-[#b7e4c7] text-[#1b4332]" : "bg-gray-200 text-gray-600"}`}>
                {p.status}
              </span>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/blog/${p.id}/edit`} className="text-[#2d6a4f] text-sm hover:text-[#52b788]">Edit</Link>
              <button onClick={() => remove(p.id)} className="text-red-500 text-sm hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
