import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Marousch Brothers Landscaping",
  description: "Learn about Mike and Randy Marousch and our landscaping and contracting services in Summit County, Ohio.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1a1a1a] mb-8">About Us</h1>
      <div className="bg-white rounded-lg p-8 shadow-sm border border-[#e0d5b8]">
        <h2 className="text-2xl font-semibold text-[#b8860b] mb-4">Marousch Brothers Landscaping</h2>
        <p className="text-[#2d2d2d] mb-4 text-lg">
          Founded by Mike and Randy Marousch, we are a family-owned landscaping and contracting
          business based in Summit County, Ohio. We take pride in delivering quality workmanship and
          personalized service to every client.
        </p>
        <p className="text-[#6b6350] mb-4">
          Whether you need regular lawn mowing, seasonal landscaping, or a full contracting
          project, our team brings years of experience and a commitment to excellence.
        </p>
        <p className="text-[#6b6350]">
          Our goal is simple: provide reliable, professional service that exceeds expectations.
          We believe in honest pricing, clear communication, and results you can see.
        </p>
      </div>
    </div>
  );
}
