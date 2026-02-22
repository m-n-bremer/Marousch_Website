"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Contact } from "@/lib/types";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const load = useCallback(() => {
    api.get("/contacts").then((r) => setContacts(r.data.contacts || [])).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const addContact = () => {
    setContacts((prev) => [...prev, {
      id: `c_${Date.now()}`, firstName: "", lastName: "", primaryPhone: "", address: "", email: "",
    }]);
  };

  const updateField = (idx: number, field: keyof Contact, value: string) => {
    setContacts((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const removeContact = (idx: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    setContacts((prev) => prev.filter((_, i) => i !== idx));
  };

  const save = async () => {
    try {
      await api.post("/contacts", { contacts });
      toast.success("Contacts saved!");
    } catch {
      toast.error("Failed to save contacts.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Contacts</h1>
        <div className="flex gap-2">
          <button onClick={addContact} className="bg-[#d4a017] hover:bg-[#9a7209] text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Contact</button>
          <button onClick={save} className="bg-[#b8860b] hover:bg-[#1a1a1a] text-white px-4 py-2 rounded-lg text-sm font-medium">Save Changes</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e0d5b8] overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f9f5e8]">
            <tr>
              {["First Name", "Last Name", "Phone", "Address", "Email", ""].map((h) => (
                <th key={h} className="text-left p-3 text-sm font-medium text-[#2d2d2d]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, i) => (
              <tr key={c.id} className="border-t border-[#e0d5b8]">
                <td className="p-2"><input value={c.firstName} onChange={(e) => updateField(i, "firstName", e.target.value)}
                  className="w-full border border-[#e0d5b8] rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#d4a017]" /></td>
                <td className="p-2"><input value={c.lastName} onChange={(e) => updateField(i, "lastName", e.target.value)}
                  className="w-full border border-[#e0d5b8] rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#d4a017]" /></td>
                <td className="p-2"><input value={c.primaryPhone} onChange={(e) => updateField(i, "primaryPhone", e.target.value)}
                  className="w-full border border-[#e0d5b8] rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#d4a017]" /></td>
                <td className="p-2"><input value={c.address} onChange={(e) => updateField(i, "address", e.target.value)}
                  className="w-full border border-[#e0d5b8] rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#d4a017]" /></td>
                <td className="p-2"><input value={c.email} onChange={(e) => updateField(i, "email", e.target.value)}
                  className="w-full border border-[#e0d5b8] rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#d4a017]" /></td>
                <td className="p-2">
                  <button onClick={() => removeContact(i)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
