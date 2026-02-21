"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Service } from "@/lib/types";

const schema = z.object({
  client_name: z.string().min(1, "Name is required"),
  client_email: z.string().email("Valid email required"),
  client_phone: z.string().optional(),
  service_id: z.coerce.number().optional(),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  address: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function QuotePage() {
  const [services, setServices] = useState<Service[]>([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api.get("/services").then((r) => setServices(r.data)).catch(() => {});
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/bookings", data);
      toast.success("Quote request submitted! We'll contact you soon.");
      reset();
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1b4332] mb-4">Get a Free Quote</h1>
      <p className="text-[#636e72] mb-8">Fill out the form and we&apos;ll provide a free estimate for your project.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-8 shadow-sm border border-[#d8e4dc] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2d3436] mb-1">Name *</label>
            <input {...register("client_name")} className="w-full border border-[#d8e4dc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52b788]" />
            {errors.client_name && <p className="text-red-500 text-sm mt-1">{errors.client_name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2d3436] mb-1">Email *</label>
            <input type="email" {...register("client_email")} className="w-full border border-[#d8e4dc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52b788]" />
            {errors.client_email && <p className="text-red-500 text-sm mt-1">{errors.client_email.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2d3436] mb-1">Phone</label>
            <input {...register("client_phone")} className="w-full border border-[#d8e4dc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52b788]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2d3436] mb-1">Service</label>
            <select {...register("service_id")} className="w-full border border-[#d8e4dc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52b788]">
              <option value="">General Inquiry</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2d3436] mb-1">Preferred Date</label>
            <input type="date" {...register("preferred_date")} className="w-full border border-[#d8e4dc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52b788]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2d3436] mb-1">Preferred Time</label>
            <select {...register("preferred_time")} className="w-full border border-[#d8e4dc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52b788]">
              <option value="">No preference</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2d3436] mb-1">Property Address</label>
          <input {...register("address")} className="w-full border border-[#d8e4dc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52b788]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2d3436] mb-1">Additional Details</label>
          <textarea {...register("message")} rows={4} className="w-full border border-[#d8e4dc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52b788]" />
        </div>
        <button type="submit" disabled={isSubmitting}
          className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 w-full">
          {isSubmitting ? "Submitting..." : "Request Free Quote"}
        </button>
      </form>
    </div>
  );
}
