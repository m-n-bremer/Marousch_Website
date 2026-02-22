"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
  MapPinIcon,
  CameraIcon,
  ChatBubbleLeftIcon,
  NewspaperIcon,
  InboxIcon,
  StarIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const opsLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/contacts", label: "Contacts", icon: UserGroupIcon },
  { href: "/admin/work", label: "Work", icon: WrenchScrewdriverIcon },
  { href: "/admin/invoices", label: "Invoices", icon: BanknotesIcon },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarIcon },
  { href: "/admin/history", label: "History", icon: ClockIcon },
  { href: "/admin/zones", label: "Zones", icon: MapPinIcon },
];

const websiteLinks = [
  { href: "/admin/services", label: "Services", icon: ClipboardDocumentListIcon },
  { href: "/admin/gallery", label: "Gallery", icon: CameraIcon },
  { href: "/admin/blog", label: "Blog", icon: NewspaperIcon },
  { href: "/admin/bookings", label: "Bookings", icon: DocumentTextIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: StarIcon },
  { href: "/admin/messages", label: "Messages", icon: InboxIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const renderLink = (link: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const Icon = link.icon;
    const active = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
          active
            ? "bg-[#b8860b] text-white"
            : "text-[#e0d5b8] hover:bg-[#b8860b]/50 hover:text-white"
        )}
      >
        <Icon className="h-5 w-5" />
        {link.label}
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-[#1a1a1a] min-h-screen p-4 flex flex-col">
      <Link href="/admin/dashboard" className="text-white font-bold text-lg mb-6 px-3">
        Marousch Admin
      </Link>
      <div className="space-y-1">
        <p className="text-xs uppercase text-[#e6c34d] font-semibold px-3 mb-2">Operations</p>
        {opsLinks.map(renderLink)}
      </div>
      <div className="mt-6 space-y-1">
        <p className="text-xs uppercase text-[#e6c34d] font-semibold px-3 mb-2">Website</p>
        {websiteLinks.map(renderLink)}
      </div>
      <div className="mt-auto pt-4 border-t border-[#b8860b]">
        <Link href="/" className="text-sm text-[#e6c34d] hover:text-white px-3">
          &larr; Back to Website
        </Link>
      </div>
    </aside>
  );
}
