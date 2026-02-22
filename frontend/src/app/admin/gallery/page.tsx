"use client";

import { useEffect, useState } from "react";
import api, { API_BASE } from "@/lib/api";
import toast from "react-hot-toast";
import type { GalleryImage } from "@/lib/types";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[] | null>(null);

  const load = () => { api.get("/gallery").then((r) => setImages(r.data)); };
  useEffect(() => { load(); }, []);

  const upload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await api.post("/gallery", form, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Image uploaded!");
      e.currentTarget.reset();
      load();
    } catch { toast.error("Upload failed."); }
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    await api.delete(`/gallery/${id}`);
    toast.success("Image deleted.");
    load();
  };

  if (!images) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e0d5b8] border-t-[#b8860b]" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1a1a1a] mb-6">Gallery</h1>

      <form onSubmit={upload} className="bg-white rounded-lg p-6 border border-[#e0d5b8] mb-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="file" name="file" accept="image/*" required className="text-sm" />
          <input name="title" placeholder="Title" className="border border-[#e0d5b8] rounded px-3 py-2 text-sm" />
          <input name="category" placeholder="Category" className="border border-[#e0d5b8] rounded px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="bg-[#b8860b] text-white px-4 py-2 rounded text-sm hover:bg-[#1a1a1a]">Upload</button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-lg overflow-hidden border border-[#e0d5b8]">
            <img src={`${API_BASE}${img.image_url}`} alt={img.title || ""} className="w-full h-40 object-cover" />
            <div className="p-3 flex justify-between items-center">
              <span className="text-sm text-[#b8860b] truncate">{img.title || img.category || "Untitled"}</span>
              <button onClick={() => remove(img.id)} className="text-red-500 text-xs hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
