import Link from "next/link";
import type { Metadata } from "next";
import type { Service } from "@/lib/types";

export const metadata: Metadata = {
  title: "Services | Marousch Brothers Landscaping",
};

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/services`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">Our Services</h1>
      <p className="text-[#6b6350] mb-12 text-lg">Full range of landscaping and contracting services.</p>
      {services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-[#e0d5b8]">
          <p className="text-[#6b6350]">Services coming soon. Contact us for more information.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link key={s.id} href={`/services/${s.slug}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-[#e0d5b8] group">
              <h2 className="text-xl font-semibold text-[#b8860b] mb-2 group-hover:text-[#d4a017]">{s.title}</h2>
              {s.short_description && <p className="text-[#6b6350]">{s.short_description}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
