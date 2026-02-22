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

  if (!invoices) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d8e4dc] border-t-[#2d6a4f]" /></div>;

  const contactMap = new Map<string, Contact>();
  contacts.forEach((c) => contactMap.set(c.id, c));

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1b4332] mb-6">Invoices</h1>
      {invoices.length === 0 ? (
        <p className="text-[#636e72] bg-white p-4 rounded-lg border border-[#d8e4dc]">No invoices yet.</p>
      ) : (
        <div className="bg-white rounded-lg border border-[#d8e4dc] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f0f4f1]">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-[#2d3436]">Invoice</th>
                <th className="text-left p-3 text-sm font-medium text-[#2d3436]">Contact</th>
                <th className="text-left p-3 text-sm font-medium text-[#2d3436]">Date</th>
                <th className="text-right p-3 text-sm font-medium text-[#2d3436]">Total</th>
                <th className="text-center p-3 text-sm font-medium text-[#2d3436]">Sent</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const contact = contactMap.get(inv.contactId);
                return (
                  <tr key={inv.invoiceId} className="border-t border-[#d8e4dc]">
                    <td className="p-3 text-sm text-[#2d6a4f] font-medium">{inv.headline || inv.invoiceId}</td>
                    <td className="p-3 text-sm">{contact ? `${contact.firstName} ${contact.lastName}` : inv.contactId}</td>
                    <td className="p-3 text-sm text-[#636e72]">{inv.createdDate}</td>
                    <td className="p-3 text-sm text-right font-medium">${inv.totalAmount.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded ${inv.sent ? "bg-[#b7e4c7] text-[#1b4332]" : "bg-gray-200 text-gray-600"}`}>
                        {inv.sent ? "Sent" : "Draft"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link href={`/admin/invoice/${inv.invoiceId}`} className="text-[#2d6a4f] text-sm hover:text-[#52b788]">View</Link>
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
