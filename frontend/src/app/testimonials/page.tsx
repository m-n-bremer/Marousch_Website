import type { Metadata } from "next";
import type { Testimonial } from "@/lib/types";

export const metadata: Metadata = { title: "Testimonials | Marousch Brothers Contracting" };

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/testimonials`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1b4332] mb-8">Testimonials</h1>
      {testimonials.length === 0 ? (
        <p className="text-[#636e72] text-center py-12 bg-white rounded-lg border border-[#d8e4dc]">No testimonials yet.</p>
      ) : (
        <div className="space-y-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-lg p-6 shadow-sm border border-[#d8e4dc]">
              {t.rating && <div className="text-[#52b788] mb-2">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>}
              <p className="text-[#2d3436] mb-4 text-lg italic">&ldquo;{t.content}&rdquo;</p>
              <p className="font-semibold text-[#2d6a4f]">
                {t.client_name}
                {t.client_location && <span className="text-[#636e72] font-normal"> — {t.client_location}</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
