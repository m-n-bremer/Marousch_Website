"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Contact, CalendarJob } from "@/lib/types";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-[#b7e4c7] text-[#1b4332]",
  cancelled: "bg-red-100 text-red-800",
};

const calendarCellColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-900",
  completed: "bg-[#b7e4c7] text-[#1b4332]",
  cancelled: "bg-red-100 text-red-800",
};

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [jobs, setJobs] = useState<CalendarJob[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newJobContact, setNewJobContact] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [editingJob, setEditingJob] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editDate, setEditDate] = useState("");

  const load = useCallback(() => {
    api.get(`/calendar/month?year=${year}&month=${month}`).then((r) => setJobs(r.data.jobs || []));
    api.get("/contacts").then((r) => setContacts(r.data.contacts || []));
  }, [year, month]);

  useEffect(() => { load(); }, [load]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long" });

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(year + 1); } else setMonth(month + 1); };

  const getJobsForDay = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return jobs.filter((j) => j.date === dateStr);
  };

  const contactMap = new Map<string, Contact>();
  contacts.forEach((c) => contactMap.set(c.id, c));

  const addJob = async () => {
    if (!newJobContact || selectedDay === null) return;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    try {
      await api.post("/calendar/jobs", { contactId: newJobContact, date: dateStr, description: newJobDesc });
      setNewJobContact(""); setNewJobDesc("");
      load();
      toast.success("Job scheduled!");
    } catch { toast.error("Failed to add job."); }
  };

  const deleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    await api.delete(`/calendar/jobs/${jobId}`);
    load();
  };

  const startEdit = (job: CalendarJob) => {
    setEditingJob(job.id);
    setEditDesc(job.description || "");
    setEditStatus(job.status);
    setEditDate(job.date);
  };

  const cancelEdit = () => setEditingJob(null);

  const sendReminder = async (jobId: number) => {
    try {
      await api.post(`/calendar/jobs/${jobId}/remind`);
      toast.success("Reminder sent!");
    } catch { toast.error("Failed to send reminder."); }
  };

  const updateJob = async (jobId: number) => {
    try {
      await api.put(`/calendar/jobs/${jobId}`, { description: editDesc, status: editStatus, date: editDate });
      setEditingJob(null);
      load();
      toast.success("Job updated!");
    } catch { toast.error("Failed to update job."); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1b4332] mb-6">Calendar</h1>

      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="bg-white border border-[#d8e4dc] px-4 py-2 rounded-lg hover:bg-[#f0f4f1]">&larr; Prev</button>
        <h2 className="text-xl font-semibold text-[#2d6a4f]">{monthName} {year}</h2>
        <button onClick={nextMonth} className="bg-white border border-[#d8e4dc] px-4 py-2 rounded-lg hover:bg-[#f0f4f1]">Next &rarr;</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-sm font-medium text-[#636e72] py-2">{d}</div>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dayJobs = getJobsForDay(day);
          const isToday = day === now.getDate() && month === now.getMonth() + 1 && year === now.getFullYear();
          return (
            <div key={day} onClick={() => setSelectedDay(day)}
              className={`bg-white border rounded-lg p-2 min-h-[80px] cursor-pointer hover:border-[#52b788] ${
                isToday ? "border-[#52b788] border-2" : "border-[#d8e4dc]"
              } ${selectedDay === day ? "ring-2 ring-[#52b788]" : ""}`}>
              <span className="text-sm font-medium">{day}</span>
              {dayJobs.map((j) => {
                const c = contactMap.get(j.contactId);
                const colorClass = calendarCellColors[j.status] || "bg-[#b7e4c7] text-[#1b4332]";
                return (
                  <div key={j.id} className={`text-xs rounded px-1 mt-1 truncate ${colorClass}`}>
                    {c ? c.firstName : "?"}: {j.description || "Job"}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {selectedDay !== null && (
        <div className="bg-white rounded-lg p-6 border border-[#d8e4dc]">
          <h3 className="font-semibold text-[#2d6a4f] mb-4">
            {monthName} {selectedDay}, {year}
          </h3>
          {getJobsForDay(selectedDay).map((j) => {
            const c = contactMap.get(j.contactId);
            if (editingJob === j.id) {
              return (
                <div key={j.id} className="py-3 border-b border-[#d8e4dc] space-y-2">
                  <div className="flex gap-2">
                    <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description"
                      className="flex-1 border border-[#d8e4dc] rounded px-3 py-1.5 text-sm" />
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}
                      className="border border-[#d8e4dc] rounded px-3 py-1.5 text-sm">
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                      className="border border-[#d8e4dc] rounded px-3 py-1.5 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateJob(j.id)} className="bg-[#2d6a4f] text-white px-3 py-1 rounded text-sm hover:bg-[#1b4332]">Save</button>
                    <button onClick={cancelEdit} className="bg-white border border-[#d8e4dc] px-3 py-1 rounded text-sm hover:bg-[#f0f4f1]">Cancel</button>
                  </div>
                </div>
              );
            }
            return (
              <div key={j.id} className="flex items-center justify-between py-2 border-b border-[#d8e4dc]">
                <div className="flex items-center gap-2">
                  <span>{c ? `${c.firstName} ${c.lastName}` : j.contactId} — {j.description || "No description"}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[j.status] || "bg-gray-100 text-gray-600"}`}>
                    {j.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => sendReminder(j.id)} className="text-blue-600 text-sm hover:text-blue-800">Remind</button>
                  <button onClick={() => startEdit(j)} className="text-[#2d6a4f] text-sm hover:text-[#52b788]">Edit</button>
                  <button onClick={() => deleteJob(j.id)} className="text-red-500 text-sm hover:text-red-700">Delete</button>
                </div>
              </div>
            );
          })}
          <div className="mt-4 flex gap-2">
            <select value={newJobContact} onChange={(e) => setNewJobContact(e.target.value)}
              className="border border-[#d8e4dc] rounded px-3 py-2 text-sm flex-1">
              <option value="">Select contact</option>
              {contacts.map((c) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
            </select>
            <input value={newJobDesc} onChange={(e) => setNewJobDesc(e.target.value)} placeholder="Description"
              className="border border-[#d8e4dc] rounded px-3 py-2 text-sm flex-1" />
            <button onClick={addJob} className="bg-[#2d6a4f] text-white px-4 py-2 rounded text-sm hover:bg-[#1b4332]">Add</button>
          </div>
        </div>
      )}
    </div>
  );
}
