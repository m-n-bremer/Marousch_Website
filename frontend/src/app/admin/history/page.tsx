"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { HistoryRecord, Contact } from "@/lib/types";

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[] | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    api.get("/history").then((r) => setRecords(r.data.records || []));
    api.get("/contacts").then((r) => setContacts(r.data.contacts || []));
  }, []);

  if (!records) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d8e4dc] border-t-[#2d6a4f]" /></div>;

  const contactMap = new Map<string, Contact>();
  contacts.forEach((c) => contactMap.set(c.id, c));

  const grouped = new Map<string, HistoryRecord[]>();
  records.forEach((r) => {
    const list = grouped.get(r.contactId) || [];
    list.push(r);
    grouped.set(r.contactId, list);
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1b4332] mb-6">History</h1>
      {grouped.size === 0 ? (
        <p className="text-[#636e72] bg-white p-4 rounded-lg border border-[#d8e4dc]">No history records.</p>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([contactId, recs]) => {
            const c = contactMap.get(contactId);
            return (
              <details key={contactId} className="bg-white rounded-lg border border-[#d8e4dc]">
                <summary className="p-4 cursor-pointer font-semibold text-[#2d6a4f] hover:bg-[#f0f4f1]">
                  {c ? `${c.firstName} ${c.lastName}` : contactId} ({recs.length} records)
                </summary>
                <div className="px-4 pb-4 space-y-2">
                  {recs.map((r, i) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-[#d8e4dc] last:border-0">
                      <span>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs mr-2 ${
                          r.type === "check" ? "bg-[#b7e4c7] text-[#1b4332]" : "bg-[#95d5b2] text-[#1b4332]"
                        }`}>{r.type}</span>
                        {r.label}
                      </span>
                      <span className="text-[#636e72]">{r.timestamp}</span>
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
