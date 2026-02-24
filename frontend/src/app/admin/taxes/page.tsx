"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Contact } from "@/lib/types";

interface TaxInvoice {
  invoiceId: string;
  contactId: string;
  createdDate: string;
  headline: string | null;
  totalAmount: number;
  sentAt: string | null;
}

export default function TaxesPage() {
  const [invoices, setInvoices] = useState<TaxInvoice[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [grandTotal, setGrandTotal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/taxes"),
      api.get("/contacts"),
    ]).then(([taxRes, contactRes]) => {
      setInvoices(taxRes.data.invoices || []);
      setGrandTotal(taxRes.data.grandTotal || 0);
      setContacts(contactRes.data.contacts || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d8e4dc] border-t-[#2d6a4f]" /></div>;

  const contactMap = new Map<string, Contact>();
  contacts.forEach((c) => contactMap.set(c.id, c));

  const filtered = invoices.filter((inv) => {
    if (startDate && inv.createdDate < startDate) return false;
    if (endDate && inv.createdDate > endDate) return false;
    return true;
  });

  const selectedTotal = filtered.reduce((sum, inv) => selected.has(inv.invoiceId) ? sum + inv.totalAmount : sum, 0);
  const selectedCount = filtered.filter((inv) => selected.has(inv.invoiceId)).length;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(filtered.map((inv) => inv.invoiceId)));
  const deselectAll = () => setSelected(new Set());

  return (
    <div className="pb-28">
      <h1 className="text-3xl font-bold text-[#1b4332] mb-6">Taxes</h1>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#636e72]">From:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="border border-[#d8e4dc] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#52b788]" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#636e72]">To:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="border border-[#d8e4dc] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#52b788]" />
        </div>
        <button onClick={selectAll} className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-3 py-2 rounded-lg text-sm">Select All</button>
        <button onClick={deselectAll} className="bg-white border border-[#d8e4dc] hover:bg-[#f0f4f1] text-[#2d3436] px-3 py-2 rounded-lg text-sm">Deselect All</button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#636e72] bg-white p-4 rounded-lg border border-[#d8e4dc]">No sent invoices found.</p>
      ) : (
        <div className="bg-white rounded-lg border border-[#d8e4dc] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f0f4f1]">
              <tr>
                <th className="p-3 w-10"></th>
                <th className="text-left p-3 text-sm font-medium text-[#2d3436]">Invoice</th>
                <th className="text-left p-3 text-sm font-medium text-[#2d3436]">Contact</th>
                <th className="text-left p-3 text-sm font-medium text-[#2d3436]">Date</th>
                <th className="text-right p-3 text-sm font-medium text-[#2d3436]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const c = contactMap.get(inv.contactId);
                return (
                  <tr key={inv.invoiceId} className={`border-t border-[#d8e4dc] ${selected.has(inv.invoiceId) ? "bg-[#d8f3dc]" : ""}`}>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={selected.has(inv.invoiceId)} onChange={() => toggleSelect(inv.invoiceId)}
                        className="accent-[#2d6a4f]" />
                    </td>
                    <td className="p-3 text-sm text-[#2d6a4f] font-medium">{inv.headline || inv.invoiceId}</td>
                    <td className="p-3 text-sm">{c ? `${c.firstName} ${c.lastName}` : inv.contactId}</td>
                    <td className="p-3 text-sm text-[#636e72]">{inv.createdDate}</td>
                    <td className="p-3 text-sm text-right font-medium">${inv.totalAmount.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-[#d8e4dc] p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-sm text-[#636e72]">Selected: <strong className="text-[#1b4332]">{selectedCount}</strong></span>
          <span className="text-sm text-[#636e72]">Selected Total: <strong className="text-[#2d6a4f] text-lg">${selectedTotal.toFixed(2)}</strong></span>
        </div>
        <span className="text-sm text-[#636e72]">Grand Total (all sent): <strong className="text-[#1b4332] text-lg">${grandTotal.toFixed(2)}</strong></span>
      </div>
    </div>
  );
}
