"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { ContactMessage } from "@/lib/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const load = () => { api.get("/contact/admin").then((r) => setMessages(r.data)); };
  useEffect(() => { load(); }, []);

  const markRead = async (id: number) => {
    await api.put(`/contact/admin/${id}`);
    load();
  };

  const remove = async (id: number) => {
    await api.delete(`/contact/admin/${id}`);
    toast.success("Message deleted.");
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1b4332] mb-6">Messages</h1>
      {messages.length === 0 ? (
        <p className="text-[#636e72] bg-white p-4 rounded-lg border border-[#d8e4dc]">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`bg-white rounded-lg p-4 border ${m.is_read ? "border-[#d8e4dc]" : "border-[#52b788] border-2"}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-[#2d6a4f]">{m.name} {!m.is_read && <span className="text-xs bg-[#52b788] text-white px-2 py-0.5 rounded ml-2">New</span>}</h3>
                  <p className="text-sm text-[#636e72]">{m.email} {m.phone && `| ${m.phone}`}</p>
                </div>
                <span className="text-xs text-[#636e72]">{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              {m.subject && <p className="text-sm font-medium text-[#2d3436] mb-1">{m.subject}</p>}
              <p className="text-sm text-[#2d3436] mb-3">{m.message}</p>
              <div className="flex gap-2">
                {!m.is_read && (
                  <button onClick={() => markRead(m.id)} className="text-xs bg-[#2d6a4f] text-white px-2 py-1 rounded">Mark Read</button>
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
