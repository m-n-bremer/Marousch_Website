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
  const router = useRouter();

  useEffect(() => {
    api.get(`/invoices/${id}`).then((r) => {
      setInvoice(r.data.invoice);
      setContact(r.data.contact);
      setLineItems(r.data.invoice.lineItems || []);
      setNotes(r.data.invoice.contractingNotes || "");
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
      await api.put(`/invoices/${id}`, { lineItems, contractingNotes: notes });
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

  if (!invoice) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e0d5b8] border-t-[#b8860b]" /></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">
          {invoice.headline || "Invoice"}
        </h1>
        <button onClick={() => router.push("/admin/work")} className="text-[#b8860b] hover:text-[#d4a017]">&larr; Back to Work</button>
      </div>

      <div className="bg-white rounded-lg p-6 border border-[#e0d5b8] mb-6">
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="font-bold text-[#1a1a1a] text-lg">Marousch Brothers Landscaping</h2>
            <p className="text-sm text-[#6b6350]">Summit County, Ohio</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#6b6350]">Date: {invoice.createdDate}</p>
            <p className="text-sm text-[#6b6350]">ID: {invoice.invoiceId}</p>
          </div>
        </div>

        {contact && (
          <div className="mb-6 p-4 bg-[#f9f5e8] rounded-lg">
            <p className="font-medium">Bill To: {contact.firstName} {contact.lastName}</p>
            {contact.primaryPhone && <p className="text-sm text-[#6b6350]">Phone: {contact.primaryPhone}</p>}
          </div>
        )}

        <table className="w-full mb-4">
          <thead>
            <tr className="border-b border-[#e0d5b8]">
              <th className="text-left py-2 text-sm">Description</th>
              <th className="text-right py-2 text-sm w-32">Amount</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((li, i) => (
              <tr key={i} className="border-b border-[#e0d5b8]">
                <td className="py-2">
                  <input value={li.description} onChange={(e) => updateLine(i, "description", e.target.value)}
                    className="w-full border border-[#e0d5b8] rounded px-2 py-1 text-sm" />
                </td>
                <td className="py-2">
                  <input type="number" value={li.amount} onChange={(e) => updateLine(i, "amount", parseFloat(e.target.value) || 0)}
                    className="w-full border border-[#e0d5b8] rounded px-2 py-1 text-sm text-right" />
                </td>
                <td className="py-2 text-center">
                  <button onClick={() => removeLine(i)} className="text-red-500 text-sm">X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addLine} className="text-[#b8860b] text-sm hover:text-[#d4a017] mb-4">+ Add Line Item</button>

        {!invoice.headline && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">Additional Job Details</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              className="w-full border border-[#e0d5b8] rounded px-3 py-2 text-sm" />
          </div>
        )}

        <div className="text-right text-xl font-bold text-[#b8860b] border-t border-[#e0d5b8] pt-4">
          Total: ${total.toFixed(2)}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={save} className="bg-[#b8860b] hover:bg-[#1a1a1a] text-white px-6 py-2 rounded-lg font-medium">Save Invoice</button>
        <button onClick={send} className="bg-[#d4a017] hover:bg-[#9a7209] text-white px-6 py-2 rounded-lg font-medium">Send via SMS</button>
      </div>
    </div>
  );
}
