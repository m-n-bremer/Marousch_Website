import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Marousch Brothers Landscaping</h3>
            <p className="text-[#e6c34d] text-sm">
              Professional landscaping and contracting services in Norton, Ohio.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-[#e6c34d]">Services</Link></li>
              <li><Link href="/gallery" className="hover:text-[#e6c34d]">Gallery</Link></li>
              <li><Link href="/quote" className="hover:text-[#e6c34d]">Get a Quote</Link></li>
              <li><Link href="/contact" className="hover:text-[#e6c34d]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-[#e6c34d]">
              <li>Norton, Ohio</li>
              <li>Mike &amp; Randy Marousch</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#b8860b] mt-8 pt-8 text-center text-sm text-[#e6c34d]">
          &copy; {new Date().getFullYear()} Marousch Brothers Landscaping. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
