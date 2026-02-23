"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { DashboardData, Contact, CalendarJob } from "@/lib/types";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d8e4dc] border-t-[#2d6a4f]" /></div>;

  const contactMap = new Map<string, Contact>();
  data.contacts.forEach((c) => contactMap.set(c.id, c));

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1b4332] mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Contacts" value={data.totalContacts} />
        <StatCard label="Mowing Today" value={data.mowingClients} />
        <StatCard label="Contracting Today" value={data.contractingClients} />
        <StatCard label="Pending Bookings" value={data.pendingBookings} />
        <StatCard label="Unread Messages" value={data.unreadMessages} />
        <StatCard label="Blog Posts" value={data.totalBlogPosts} />
      </div>

      <h2 className="text-xl font-semibold text-[#2d6a4f] mb-4">Today&apos;s Work</h2>
      {data.todayEntries.length === 0 ? (
        <p className="text-[#636e72] bg-white p-4 rounded-lg border border-[#d8e4dc]">No jobs today.</p>
      ) : (
        <div className="bg-white rounded-lg border border-[#d8e4dc] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f0f4f1]">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-[#2d3436]">Contact</th>
                <th className="text-left p-3 text-sm font-medium text-[#2d3436]">Mowing</th>
                <th className="text-left p-3 text-sm font-medium text-[#2d3436]">Contracting</th>
              </tr>
            </thead>
            <tbody>
              {data.todayEntries.map((e, i) => {
                const contact = contactMap.get(e.contactId);
                return (
                  <tr key={i} className="border-t border-[#d8e4dc]">
                    <td className="p-3">{contact ? `${contact.firstName} ${contact.lastName}` : e.contactId}</td>
                    <td className="p-3">{e.mowing ? <span className="text-[#40916c] font-medium">Yes</span> : "—"}</td>
                    <td className="p-3">{e.contracting ? <span className="text-[#40916c] font-medium">Yes</span> : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const monthName = today.toLocaleString("en-US", { month: "long", year: "numeric" });

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        const endPadded = new Date(lastDay);
        endPadded.setDate(endPadded.getDate() + (6 - endPadded.getDay()));

        const days: Date[] = [];
        const cur = new Date(startDate);
        while (cur <= endPadded) {
          days.push(new Date(cur));
          cur.setDate(cur.getDate() + 1);
        }

        const jobsByDate = new Map<string, CalendarJob[]>();
        data.upcomingJobs.forEach((j) => {
          const key = j.date.slice(0, 10);
          if (!jobsByDate.has(key)) jobsByDate.set(key, []);
          jobsByDate.get(key)!.push(j);
        });

        const todayStr = today.toISOString().slice(0, 10);

        return (
          <>
            <h2 className="text-xl font-semibold text-[#2d6a4f] mb-4 mt-8">{monthName} — Upcoming Jobs</h2>
            <div className="bg-white rounded-lg border border-[#d8e4dc] overflow-hidden">
              <div className="grid grid-cols-7 bg-[#f0f4f1]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="p-2 text-center text-xs font-medium text-[#2d3436]">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((day) => {
                  const key = day.toISOString().slice(0, 10);
                  const jobs = jobsByDate.get(key) || [];
                  const isToday = key === todayStr;
                  const isCurrentMonth = day.getMonth() === month;

                  return (
                    <div key={key} className={`min-h-[80px] p-1 border border-[#eef2ef] ${isToday ? "bg-[#d8f3dc]" : isCurrentMonth ? "bg-white" : "bg-[#f8f9fa]"}`}>
                      <div className={`text-xs font-medium mb-1 ${isToday ? "text-[#1b4332] font-bold" : isCurrentMonth ? "text-[#2d3436]" : "text-[#b2bec3]"}`}>
                        {day.getDate()}
                      </div>
                      {jobs.map((j) => {
                        const contact = contactMap.get(j.contactId);
                        return (
                          <div key={j.id} className={`text-xs rounded px-1 py-0.5 mb-0.5 truncate ${j.status === "done" ? "bg-[#b7e4c7] text-[#1b4332]" : "bg-[#52b788] text-white"}`}>
                            {contact ? `${contact.firstName} ${contact.lastName.charAt(0)}.` : j.description || "Job"}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-[#d8e4dc]">
      <p className="text-sm text-[#636e72]">{label}</p>
      <p className="text-2xl font-bold text-[#2d6a4f]">{value}</p>
    </div>
  );
}
