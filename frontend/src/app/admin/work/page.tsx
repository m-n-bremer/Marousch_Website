"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Contact, WorkEntry } from "@/lib/types";

export default function WorkPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const router = useRouter();

  const load = useCallback(() => {
    api.get("/contacts").then((r) => setContacts(r.data.contacts || []));
    api.get(`/work?date=${date}`).then((r) => setEntries(r.data.entries || []));
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const getEntry = (contactId: string) => entries.find((e) => e.contactId === contactId);

  const saveServices = async (contactId: string, mowing: boolean, contracting: boolean) => {
    await api.post("/work/save-services", { contactId, date, mowing, contracting });
    load();
  };

  const checkWeek = async (contactId: string, checkIndex: number) => {
    await api.post("/work/check", { contactId, checkIndex, date });
    load();
  };

  const uncheckWeek = async (contactId: string, checkIndex: number) => {
    await api.post("/work/uncheck", { contactId, checkIndex, date });
    load();
  };

  const createMowingInvoice = async (contactId: string) => {
    try {
      const r = await api.post("/work/mowing-invoice", { contactId, date });
      router.push(`/admin/invoice/${r.data.invoiceId}`);
    } catch {
      toast.error("Failed to create mowing invoice.");
    }
  };

  const createContractingInvoice = async (contactId: string) => {
    try {
      const r = await api.post("/work/invoice-check", { contactId, date });
      router.push(`/admin/invoice/${r.data.invoiceId}`);
    } catch {
      toast.error("Failed to create invoice.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Work</h1>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="border border-[#e0d5b8] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#d4a017]" />
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => {
          const entry = getEntry(contact.id);
          const mowing = entry?.mowing || false;
          const contracting = entry?.contracting || false;
          const checks = entry?.jobChecks || [0, 1, 2, 3].map((i) => ({ index: i, checked: false, dateTime: null }));
          const hasChecks = checks.some((jc) => jc.checked);

          return (
            <div key={contact.id} className="bg-white rounded-lg p-4 border border-[#e0d5b8]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#b8860b]">{contact.firstName} {contact.lastName}</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={mowing}
                      onChange={(e) => saveServices(contact.id, e.target.checked, contracting)}
                      className="accent-[#b8860b]" /> Mowing
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={contracting}
                      onChange={(e) => saveServices(contact.id, mowing, e.target.checked)}
                      className="accent-[#b8860b]" /> Contracting
                  </label>
                </div>
              </div>

              {(mowing || entry) && (
                <div className="flex items-center gap-4 mb-3">
                  {checks.map((jc) => (
                    <label key={jc.index} className="flex items-center gap-1 text-sm">
                      <input type="checkbox" checked={jc.checked}
                        onChange={() => jc.checked ? uncheckWeek(contact.id, jc.index) : checkWeek(contact.id, jc.index)}
                        className="accent-[#9a7209]" />
                      Wk {jc.index + 1}
                      {jc.dateTime && <span className="text-xs text-[#6b6350]">({jc.dateTime.slice(0, 10)})</span>}
                    </label>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                {hasChecks && (
                  <button onClick={() => createMowingInvoice(contact.id)}
                    className="bg-[#d4a017] hover:bg-[#9a7209] text-white px-3 py-1 rounded text-sm">
                    Mowing Invoice
                  </button>
                )}
                <button onClick={() => createContractingInvoice(contact.id)}
                  className="bg-[#6b6350] hover:bg-[#2d2d2d] text-white px-3 py-1 rounded text-sm">
                  Contracting Invoice
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
