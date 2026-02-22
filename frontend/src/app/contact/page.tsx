"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/lib/api";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/contact", data);
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">Contact Us</h1>
      <p className="text-[#6b6350] mb-8">Have a question? Send us a message and we&apos;ll respond promptly.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-8 shadow-sm border border-[#e0d5b8] space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">Name *</label>
          <input {...register("name")} className="w-full border border-[#e0d5b8] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a017]" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">Email *</label>
          <input type="email" {...register("email")} className="w-full border border-[#e0d5b8] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a017]" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">Phone</label>
          <input {...register("phone")} className="w-full border border-[#e0d5b8] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a017]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">Subject</label>
          <input {...register("subject")} className="w-full border border-[#e0d5b8] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a017]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">Message *</label>
          <textarea {...register("message")} rows={5} className="w-full border border-[#e0d5b8] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a017]" />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}
          className="bg-[#b8860b] hover:bg-[#1a1a1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
