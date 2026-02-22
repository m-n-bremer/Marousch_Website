"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Service } from "@/lib/types";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  const load = () => {
    api.get("/services").then((r) => setServices(r.data));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        await api.put(`/services/${editing.id}`, editing);
      } else {
        await api.post("/services", editing);
      }
      toast.success("Service saved!");
      setEditing(null);
      load();
    } catch { toast.error("Failed to save."); }
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    await api.delete(`/services/${id}`);
    toast.success("Service removed.");
    load();
  };

  if (!services) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d8e4dc] border-t-[#2d6a4f]" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1b4332]">Services</h1>
        <button onClick={() => setEditing({ title: "", short_description: "", full_description: "", display_order: 0 })}
          className="bg-[#2d6a4f] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1b4332]">+ Add Service</button>
      </div>

      {editing && (
        <div className="bg-white rounded-lg p-6 border border-[#d8e4dc] mb-6 space-y-3">
          <input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            placeholder="Title" className="w-full border border-[#d8e4dc] rounded px-3 py-2" />
          <input value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })}
            placeholder="Short Description" className="w-full border border-[#d8e4dc] rounded px-3 py-2" />
          <textarea value={editing.full_description || ""} onChange={(e) => setEditing({ ...editing, full_description: e.target.value })}
            placeholder="Full Description" rows={4} className="w-full border border-[#d8e4dc] rounded px-3 py-2" />
          <div className="flex gap-2">
            <button onClick={save} className="bg-[#2d6a4f] text-white px-4 py-2 rounded text-sm">Save</button>
            <button onClick={() => setEditing(null)} className="text-[#636e72] px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="bg-white rounded-lg p-4 border border-[#d8e4dc] flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-[#2d6a4f]">{s.title}</h3>
              <p className="text-sm text-[#636e72]">{s.short_description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(s)} className="text-[#2d6a4f] text-sm hover:text-[#52b788]">Edit</button>
              <button onClick={() => remove(s.id)} className="text-red-500 text-sm hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
