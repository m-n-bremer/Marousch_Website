import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1b4332] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Marousch Brothers Landscaping</h3>
            <p className="text-[#95d5b2] text-sm">
              Professional landscaping and contracting services in Summit County.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-[#95d5b2]">Services</Link></li>
              <li><Link href="/gallery" className="hover:text-[#95d5b2]">Gallery</Link></li>
              <li><Link href="/quote" className="hover:text-[#95d5b2]">Get a Quote</Link></li>
              <li><Link href="/contact" className="hover:text-[#95d5b2]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-[#95d5b2]">
              <li>Summit County, Ohio</li>
              <li>Mike &amp; Randy Marousch</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#2d6a4f] mt-8 pt-8 text-center text-sm text-[#95d5b2]">
          &copy; {new Date().getFullYear()} Marousch Brothers Landscaping. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
