"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Invoice, Contact, LineItem } from "@/lib/types";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [notes, setNotes] = useState("");
  const [headline, setHeadline] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    api.get(`/invoices/${id}`).then((r) => {
      setInvoice(r.data.invoice);
      setContact(r.data.contact);
      setLineItems(r.data.invoice.lineItems || []);
      setNotes(r.data.invoice.contractingNotes || "");
      setHeadline(r.data.invoice.headline || "");
      setCreatedDate(r.data.invoice.createdDate || "");
    }).catch(() => toast.error("Invoice not found"));
  }, [id]);

  const total = lineItems.reduce((sum, li) => sum + (li.amount || 0), 0);

  const addLine = () => setLineItems([...lineItems, { description: "", amount: 0 }]);

  const updateLine = (idx: number, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((li, i) => i === idx ? { ...li, [field]: value } : li));
  };

  const removeLine = (idx: number) => setLineItems(lineItems.filter((_, i) => i !== idx));

  const save = async () => {
    try {
      await api.put(`/invoices/${id}`, { lineItems, contractingNotes: notes, headline: headline || null, createdDate: createdDate || null });
      toast.success("Invoice saved!");
    } catch { toast.error("Failed to save."); }
  };

  const send = async () => {
    try {
      await api.post(`/invoices/${id}/send`);
      toast.success("Invoice sent via SMS!");
      router.push("/admin/work");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send";
      toast.error(msg);
    }
  };

  if (!invoice) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d8e4dc] border-t-[#2d6a4f]" /></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Invoice Headline"
            className="text-3xl font-bold text-[#1b4332] bg-transparent border-b-2 border-transparent hover:border-[#d8e4dc] focus:border-[#52b788] focus:outline-none px-1 py-0.5 transition-colors" />
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${invoice.sent ? "bg-[#b7e4c7] text-[#1b4332]" : "bg-amber-100 text-amber-800"}`}>
            {invoice.sent ? "Sent" : "Draft"}
          </span>
        </div>
        <button onClick={() => router.push("/admin/work")} className="text-[#2d6a4f] hover:text-[#52b788]">&larr; Back to Work</button>
      </div>

      <div className="bg-white rounded-lg p-6 border border-[#d8e4dc] mb-6">
        <div className="flex justify-between mb-4 pb-4 border-b-2 border-[#2d6a4f]">
          <div>
            <h2 className="font-bold text-[#1b4332] text-xl">Marousch Brothers Landscaping</h2>
            <p className="text-sm text-[#636e72]">Mike and Randy Marousch</p>
            <p className="text-sm text-[#636e72]">3790 Summit RD, Norton, Ohio, 44203</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end print:hidden">
              <span className="text-sm text-[#636e72]">Date:</span>
              <input type="date" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)}
                className="border border-[#d8e4dc] rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#52b788]" />
            </div>
            <p className="hidden print:block text-sm text-[#636e72]">Date: {createdDate}</p>
            <p className="text-sm text-[#636e72] mt-1">ID: {invoice.invoiceId}</p>
          </div>
        </div>

        {contact && (
          <div className="mb-6 p-4 bg-[#f0f4f1] rounded-lg">
            <p className="font-medium">Bill To: {contact.firstName} {contact.lastName}</p>
            {contact.primaryPhone && <p className="text-sm text-[#636e72]">Phone: {contact.primaryPhone}</p>}
            {contact.address && <p className="text-sm text-[#636e72]">Address: {contact.address}</p>}
          </div>
        )}

        <table className="w-full mb-4">
          <thead>
            <tr className="border-b-2 border-[#2d6a4f]">
              <th className="text-left py-2 text-sm font-semibold text-[#1b4332]">Description</th>
              <th className="text-right py-2 text-sm font-semibold text-[#1b4332] w-32">Amount</th>
              <th className="w-10 print:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((li, i) => (
              <tr key={i} className={`border-b border-[#d8e4dc] ${i % 2 === 1 ? "bg-[#f8faf9]" : ""}`}>
                <td className="py-2">
                  <input value={li.description} onChange={(e) => updateLine(i, "description", e.target.value)}
                    className="w-full border border-[#d8e4dc] rounded px-2 py-1 text-sm print:border-none print:px-0" />
                </td>
                <td className="py-2">
                  <input type="number" value={li.amount} onChange={(e) => updateLine(i, "amount", parseFloat(e.target.value) || 0)}
                    className="w-full border border-[#d8e4dc] rounded px-2 py-1 text-sm text-right print:border-none print:px-0" />
                </td>
                <td className="py-2 text-center print:hidden">
                  <button onClick={() => removeLine(i)} className="text-red-500 text-sm hover:text-red-700">X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addLine} className="text-[#2d6a4f] text-sm hover:text-[#52b788] mb-4 print:hidden">+ Add Line Item</button>

        {!headline && (
          <div className="mb-4 print:hidden">
            <label className="block text-sm font-medium text-[#2d3436] mb-1">Additional Job Details</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              className="w-full border border-[#d8e4dc] rounded px-3 py-2 text-sm" />
          </div>
        )}

        <div className="bg-[#d8f3dc] rounded-lg p-4 text-right">
          <span className="text-sm text-[#2d6a4f] font-medium mr-2">Total:</span>
          <span className="text-2xl font-bold text-[#1b4332]">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3 print:hidden">
        <button onClick={save} className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-6 py-2 rounded-lg font-medium">Save Invoice</button>
        <button onClick={send} className="bg-[#52b788] hover:bg-[#40916c] text-white px-6 py-2 rounded-lg font-medium">Send via SMS</button>
      </div>
    </div>
  );
}
