"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Testimonial } from "@/lib/types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);

  const load = () => { api.get("/testimonials/admin").then((r) => setTestimonials(r.data)); };
  useEffect(() => { load(); }, []);

  const toggle = async (id: number, field: "is_approved" | "is_featured", value: boolean) => {
    await api.put(`/testimonials/${id}`, { [field]: value });
    toast.success("Updated!");
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    await api.delete(`/testimonials/${id}`);
    toast.success("Deleted.");
    load();
  };

  if (!testimonials) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e0d5b8] border-t-[#b8860b]" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1a1a1a] mb-6">Testimonials</h1>
      {testimonials.length === 0 ? (
        <p className="text-[#6b6350] bg-white p-4 rounded-lg border border-[#e0d5b8]">No testimonials yet.</p>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-lg p-4 border border-[#e0d5b8]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-[#b8860b]">{t.client_name}</h3>
                  {t.client_location && <p className="text-sm text-[#6b6350]">{t.client_location}</p>}
                </div>
                <div className="flex gap-2">
                  {!t.is_approved && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>}
                  {t.is_featured && <span className="text-xs bg-[#fce588] text-[#1a1a1a] px-2 py-1 rounded">Featured</span>}
                </div>
              </div>
              {t.rating && <div className="text-[#d4a017] text-sm mb-1">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>}
              <p className="text-sm text-[#2d2d2d] mb-3 italic">&ldquo;{t.content}&rdquo;</p>
              <div className="flex gap-2">
                <button onClick={() => toggle(t.id, "is_approved", !t.is_approved)}
                  className={`text-xs px-2 py-1 rounded ${t.is_approved ? "bg-gray-200" : "bg-[#b8860b] text-white"}`}>
                  {t.is_approved ? "Unapprove" : "Approve"}
                </button>
                <button onClick={() => toggle(t.id, "is_featured", !t.is_featured)}
                  className="text-xs border border-[#e0d5b8] px-2 py-1 rounded">
                  {t.is_featured ? "Unfeature" : "Feature"}
                </button>
                <button onClick={() => remove(t.id)} className="text-xs text-red-500 hover:text-red-700 ml-auto">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
