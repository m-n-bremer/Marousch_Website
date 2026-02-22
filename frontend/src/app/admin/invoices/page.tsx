"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import type { Invoice, Contact } from "@/lib/types";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    api.get("/invoices").then((r) => setInvoices(r.data.invoices || []));
    api.get("/contacts").then((r) => setContacts(r.data.contacts || []));
  }, []);

  if (!invoices) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e0d5b8] border-t-[#b8860b]" /></div>;

  const contactMap = new Map<string, Contact>();
  contacts.forEach((c) => contactMap.set(c.id, c));

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1a1a1a] mb-6">Invoices</h1>
      {invoices.length === 0 ? (
        <p className="text-[#6b6350] bg-white p-4 rounded-lg border border-[#e0d5b8]">No invoices yet.</p>
      ) : (
        <div className="bg-white rounded-lg border border-[#e0d5b8] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f9f5e8]">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-[#2d2d2d]">Invoice</th>
                <th className="text-left p-3 text-sm font-medium text-[#2d2d2d]">Contact</th>
                <th className="text-left p-3 text-sm font-medium text-[#2d2d2d]">Date</th>
                <th className="text-right p-3 text-sm font-medium text-[#2d2d2d]">Total</th>
                <th className="text-center p-3 text-sm font-medium text-[#2d2d2d]">Sent</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const contact = contactMap.get(inv.contactId);
                return (
                  <tr key={inv.invoiceId} className="border-t border-[#e0d5b8]">
                    <td className="p-3 text-sm text-[#b8860b] font-medium">{inv.headline || inv.invoiceId}</td>
                    <td className="p-3 text-sm">{contact ? `${contact.firstName} ${contact.lastName}` : inv.contactId}</td>
                    <td className="p-3 text-sm text-[#6b6350]">{inv.createdDate}</td>
                    <td className="p-3 text-sm text-right font-medium">${inv.totalAmount.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded ${inv.sent ? "bg-[#fce588] text-[#1a1a1a]" : "bg-gray-200 text-gray-600"}`}>
                        {inv.sent ? "Sent" : "Draft"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link href={`/admin/invoice/${inv.invoiceId}`} className="text-[#b8860b] text-sm hover:text-[#d4a017]">View</Link>
                    </td>
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
