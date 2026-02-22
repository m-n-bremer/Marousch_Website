"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function NewBlogPostPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const router = useRouter();

  const save = async () => {
    try {
      await api.post("/blog", { title, excerpt, content, status });
      toast.success("Post created!");
      router.push("/admin/blog");
    } catch { toast.error("Failed to create post."); }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-[#1b4332] mb-6">New Blog Post</h1>
      <div className="bg-white rounded-lg p-6 border border-[#d8e4dc] space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
          className="w-full border border-[#d8e4dc] rounded px-3 py-2 text-lg font-semibold" />
        <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Excerpt (short summary)"
          className="w-full border border-[#d8e4dc] rounded px-3 py-2" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content (Markdown supported)"
          rows={15} className="w-full border border-[#d8e4dc] rounded px-3 py-2 font-mono text-sm" />
        <div className="flex gap-3 items-center">
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="border border-[#d8e4dc] rounded px-3 py-2">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button onClick={save} className="bg-[#2d6a4f] text-white px-6 py-2 rounded-lg hover:bg-[#1b4332]">Create Post</button>
          <button onClick={() => router.push("/admin/blog")} className="text-[#636e72]">Cancel</button>
        </div>
      </div>
    </div>
  );
}
