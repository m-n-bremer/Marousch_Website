"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Booking } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-[#b7e4c7] text-[#1b4332]",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  const load = () => { api.get("/bookings/admin").then((r) => setBookings(r.data)); };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await api.put(`/bookings/admin/${id}`, { status });
    toast.success(`Status updated to ${status}`);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    await api.delete(`/bookings/admin/${id}`);
    toast.success("Booking deleted.");
    load();
  };

  if (!bookings) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d8e4dc] border-t-[#2d6a4f]" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1b4332] mb-6">Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-[#636e72] bg-white p-4 rounded-lg border border-[#d8e4dc]">No bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-lg p-4 border border-[#d8e4dc]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-[#2d6a4f]">{b.client_name}</h3>
                  <p className="text-sm text-[#636e72]">{b.client_email} {b.client_phone && `| ${b.client_phone}`}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[b.status] || "bg-gray-100"}`}>{b.status}</span>
              </div>
              {b.address && <p className="text-sm text-[#636e72] mb-1">Address: {b.address}</p>}
              {b.preferred_date && <p className="text-sm text-[#636e72] mb-1">Preferred: {b.preferred_date} {b.preferred_time}</p>}
              {b.message && <p className="text-sm text-[#2d3436] mb-2">{b.message}</p>}
              <div className="flex gap-2 mt-2">
                {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                  s !== b.status && (
                    <button key={s} onClick={() => updateStatus(b.id, s)}
                      className="text-xs border border-[#d8e4dc] px-2 py-1 rounded hover:bg-[#f0f4f1]">{s}</button>
                  )
                ))}
                <button onClick={() => remove(b.id)} className="text-xs text-red-500 hover:text-red-700 ml-auto">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
