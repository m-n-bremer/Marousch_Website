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
      <Link href="/services" className="text-[#2d6a4f] hover:text-[#52b788] mb-6 inline-block">&larr; Back to Services</Link>
      <h1 className="text-4xl font-bold text-[#1b4332] mb-4">{service.title}</h1>
      {service.short_description && <p className="text-xl text-[#636e72] mb-8">{service.short_description}</p>}
      {service.full_description && (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-[#d8e4dc]">
          <div className="whitespace-pre-wrap text-[#2d3436]">{service.full_description}</div>
        </div>
      )}
      <div className="mt-8">
        <Link href="/quote" className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
          Request a Quote
        </Link>
      </div>
    </div>
  );
}
