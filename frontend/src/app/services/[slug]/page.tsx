import Link from "next/link";
import { notFound } from "next/navigation";
import type { Service } from "@/lib/types";

async function getService(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/services/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/services" className="text-[#b8860b] hover:text-[#d4a017] mb-6 inline-block">&larr; Back to Services</Link>
      <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">{service.title}</h1>
      {service.short_description && <p className="text-xl text-[#6b6350] mb-8">{service.short_description}</p>}
      {service.full_description && (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-[#e0d5b8]">
          <div className="whitespace-pre-wrap text-[#2d2d2d]">{service.full_description}</div>
        </div>
      )}
      <div className="mt-8">
        <Link href="/quote" className="bg-[#b8860b] hover:bg-[#1a1a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Request a Quote
        </Link>
      </div>
    </div>
  );
}
