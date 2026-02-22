"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { ContactMessage } from "@/lib/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);

  const load = () => { api.get("/contact/admin").then((r) => setMessages(r.data)); };
  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    await api.put(`/contact/admin/${id}`);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    await api.delete(`/contact/admin/${id}`);
    toast.success("Message deleted.");
    load();
  };

  if (!messages) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e0d5b8] border-t-[#b8860b]" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1a1a1a] mb-6">Messages</h1>
      {messages.length === 0 ? (
        <p className="text-[#6b6350] bg-white p-4 rounded-lg border border-[#e0d5b8]">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`bg-white rounded-lg p-4 border ${m.is_read ? "border-[#e0d5b8]" : "border-[#d4a017] border-2"}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-[#b8860b]">{m.name} {!m.is_read && <span className="text-xs bg-[#d4a017] text-white px-2 py-0.5 rounded ml-2">New</span>}</h3>
                  <p className="text-sm text-[#6b6350]">{m.email} {m.phone && `| ${m.phone}`}</p>
                </div>
                <span className="text-xs text-[#6b6350]">{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              {m.subject && <p className="text-sm font-medium text-[#2d2d2d] mb-1">{m.subject}</p>}
              <p className="text-sm text-[#2d2d2d] mb-3">{m.message}</p>
              <div className="flex gap-2">
                {!m.is_read && (
                  <button onClick={() => markRead(m.id)} className="text-xs bg-[#b8860b] text-white px-2 py-1 rounded">Mark Read</button>
                )}
                <button onClick={() => remove(m.id)} className="text-xs text-red-500 hover:text-red-700 ml-auto">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
