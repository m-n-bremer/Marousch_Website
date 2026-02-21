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
      <section className="bg-[#1b4332] text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Marousch Brothers Contracting
          </h1>
          <p className="text-xl md:text-2xl text-[#95d5b2] mb-8 max-w-2xl mx-auto">
            Professional landscaping and contracting services in Norton, Ohio.
            Quality work you can trust.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/quote"
              className="bg-[#52b788] hover:bg-[#40916c] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/services"
              className="border-2 border-[#52b788] text-[#52b788] hover:bg-[#52b788] hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
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
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1b4332]">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service: { id: number; title: string; slug: string; short_description: string | null }) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-[#d8e4dc]"
                >
                  <h3 className="text-xl font-semibold text-[#2d6a4f] mb-2">{service.title}</h3>
                  {service.short_description && <p className="text-[#636e72]">{service.short_description}</p>}
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
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1b4332]">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t: { id: number; client_name: string; client_location: string | null; content: string; rating: number | null }) => (
                <div key={t.id} className="bg-[#f0f4f1] rounded-lg p-6 border border-[#d8e4dc]">
                  {t.rating && (
                    <div className="text-[#52b788] mb-2">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                  )}
                  <p className="text-[#2d3436] mb-4 italic">&ldquo;{t.content}&rdquo;</p>
                  <p className="font-semibold text-[#2d6a4f]">
                    {t.client_name}
                    {t.client_location && <span className="text-[#636e72] font-normal"> — {t.client_location}</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#2d6a4f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Property?</h2>
          <p className="text-[#95d5b2] mb-8 text-lg">
            Contact us today for a free estimate. We serve Norton, Ohio and surrounding areas.
          </p>
          <Link
            href="/quote"
            className="bg-white text-[#2d6a4f] hover:bg-[#b7e4c7] px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
