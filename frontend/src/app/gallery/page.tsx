"use client";

import { useEffect, useState } from "react";
import api, { API_BASE } from "@/lib/api";
import type { GalleryImage } from "@/lib/types";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("all");

  useEffect(() => {
    api.get("/gallery").then((r) => setImages(r.data));
    api.get("/gallery/categories").then((r) => setCategories(r.data.categories || []));
  }, []);

  const filtered = selected === "all" ? images : images.filter((i) => i.category === selected);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">Gallery</h1>
      <p className="text-[#6b6350] mb-8">See our recent work and transformations.</p>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setSelected("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selected === "all" ? "bg-[#b8860b] text-white" : "bg-white text-[#b8860b] border border-[#e0d5b8]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selected === cat ? "bg-[#b8860b] text-white" : "bg-white text-[#b8860b] border border-[#e0d5b8]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-[#e0d5b8]">
          <p className="text-[#6b6350]">No gallery images yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((img) => (
            <div key={img.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#e0d5b8]">
              <img src={`${API_BASE}${img.image_url}`} alt={img.title || "Gallery"} className="w-full h-64 object-cover" />
              {(img.title || img.description) && (
                <div className="p-4">
                  {img.title && <h3 className="font-semibold text-[#b8860b]">{img.title}</h3>}
                  {img.description && <p className="text-sm text-[#6b6350]">{img.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
