import Link from "next/link";

async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/services`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getTestimonials() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/testimonials`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [services, testimonials] = await Promise.all([getServices(), getTestimonials()]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Marousch Brothers Landscaping
          </h1>
          <p className="text-xl md:text-2xl text-[#e6c34d] mb-8 max-w-2xl mx-auto">
            Professional landscaping and contracting services in Norton, Ohio.
            Quality work you can trust.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/quote"
              className="bg-[#d4a017] hover:bg-[#9a7209] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/services"
              className="border-2 border-[#d4a017] text-[#d4a017] hover:bg-[#d4a017] hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      {Array.isArray(services) && services.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1a1a1a]">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service: { id: number; title: string; slug: string; short_description: string | null }) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-[#e0d5b8]"
                >
                  <h3 className="text-xl font-semibold text-[#b8860b] mb-2">{service.title}</h3>
                  {service.short_description && <p className="text-[#6b6350]">{service.short_description}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {Array.isArray(testimonials) && testimonials.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1a1a1a]">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t: { id: number; client_name: string; client_location: string | null; content: string; rating: number | null }) => (
                <div key={t.id} className="bg-[#f9f5e8] rounded-lg p-6 border border-[#e0d5b8]">
                  {t.rating && (
                    <div className="text-[#d4a017] mb-2">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                  )}
                  <p className="text-[#2d2d2d] mb-4 italic">&ldquo;{t.content}&rdquo;</p>
                  <p className="font-semibold text-[#b8860b]">
                    {t.client_name}
                    {t.client_location && <span className="text-[#6b6350] font-normal"> — {t.client_location}</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#b8860b] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Property?</h2>
          <p className="text-[#e6c34d] mb-8 text-lg">
            Contact us today for a free estimate. We serve Norton, Ohio and surrounding areas.
          </p>
          <Link
            href="/quote"
            className="bg-white text-[#b8860b] hover:bg-[#fce588] px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
