"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { DashboardData, Contact } from "@/lib/types";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e0d5b8] border-t-[#b8860b]" /></div>;

  const contactMap = new Map<string, Contact>();
  data.contacts.forEach((c) => contactMap.set(c.id, c));

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1a1a1a] mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Contacts" value={data.totalContacts} />
        <StatCard label="Mowing Today" value={data.mowingClients} />
        <StatCard label="Contracting Today" value={data.contractingClients} />
        <StatCard label="Pending Bookings" value={data.pendingBookings} />
        <StatCard label="Unread Messages" value={data.unreadMessages} />
        <StatCard label="Blog Posts" value={data.totalBlogPosts} />
      </div>

      <h2 className="text-xl font-semibold text-[#b8860b] mb-4">Today&apos;s Work</h2>
      {data.todayEntries.length === 0 ? (
        <p className="text-[#6b6350] bg-white p-4 rounded-lg border border-[#e0d5b8]">No jobs today.</p>
      ) : (
        <div className="bg-white rounded-lg border border-[#e0d5b8] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f9f5e8]">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-[#2d2d2d]">Contact</th>
                <th className="text-left p-3 text-sm font-medium text-[#2d2d2d]">Mowing</th>
                <th className="text-left p-3 text-sm font-medium text-[#2d2d2d]">Contracting</th>
              </tr>
            </thead>
            <tbody>
              {data.todayEntries.map((e, i) => {
                const contact = contactMap.get(e.contactId);
                return (
                  <tr key={i} className="border-t border-[#e0d5b8]">
                    <td className="p-3">{contact ? `${contact.firstName} ${contact.lastName}` : e.contactId}</td>
                    <td className="p-3">{e.mowing ? <span className="text-[#9a7209] font-medium">Yes</span> : "—"}</td>
                    <td className="p-3">{e.contracting ? <span className="text-[#9a7209] font-medium">Yes</span> : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-[#e0d5b8]">
      <p className="text-sm text-[#6b6350]">{label}</p>
      <p className="text-2xl font-bold text-[#b8860b]">{value}</p>
    </div>
  );
}
