"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Contact, ZoneNote } from "@/lib/types";

export default function ZonesPage() {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [zones, setZones] = useState<ZoneNote[]>([]);

  useEffect(() => {
    api.get("/contacts").then((r) => setContacts(r.data.contacts || []));
    api.get("/zones").then((r) => setZones(r.data.zones || []));
  }, []);

  if (!contacts) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e0d5b8] border-t-[#b8860b]" /></div>;

  const getNote = (contactId: string) => zones.find((z) => z.contactId === contactId)?.notes || "";

  const saveZone = async (contactId: string, notes: string) => {
    try {
      await api.post("/zones", { contactId, notes });
      toast.success("Zone saved!");
      setZones((prev) => {
        const existing = prev.find((z) => z.contactId === contactId);
        if (existing) return prev.map((z) => z.contactId === contactId ? { ...z, notes } : z);
        return [...prev, { contactId, notes }];
      });
    } catch { toast.error("Failed to save."); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1a1a1a] mb-6">Zone Notes</h1>
      <div className="space-y-3">
        {contacts.map((c) => (
          <details key={c.id} className="bg-white rounded-lg border border-[#e0d5b8]">
            <summary className="p-4 cursor-pointer font-semibold text-[#b8860b] hover:bg-[#f9f5e8]">
              {c.firstName} {c.lastName}
            </summary>
            <div className="px-4 pb-4">
              <ZoneEditor contactId={c.id} initial={getNote(c.id)} onSave={saveZone} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function ZoneEditor({ contactId, initial, onSave }: { contactId: string; initial: string; onSave: (id: string, notes: string) => void }) {
  const [notes, setNotes] = useState(initial);
  return (
    <div>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
        className="w-full border border-[#e0d5b8] rounded px-3 py-2 text-sm mb-2" placeholder="Add notes about this zone..." />
      <button onClick={() => onSave(contactId, notes)}
        className="bg-[#b8860b] text-white px-4 py-1 rounded text-sm hover:bg-[#1a1a1a]">Save</button>
    </div>
  );
}
