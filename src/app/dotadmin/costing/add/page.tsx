"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCosting } from "@/api/costingApi";

export default function AddCostingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    note: "",
    cost: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.cost) {
      alert("Cost is required.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        note: form.note,
        cost: Number(form.cost),
        reason: form.reason,
      };

      await createCosting(payload);
      alert("Cost added successfully!");
      router.push("/dotadmin/costing");
    } catch (error) {
      console.error("Failed to add cost record", error);
      alert("Failed to add cost record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-2 py-4 sm:px-4">
      <div className="flex items-center gap-4 border-b border-black pb-6">
        <Link
          href="/dotadmin/costing"
          className="flex items-center justify-center border border-black bg-white p-2 text-black transition-colors hover:bg-gray-100 hover:text-[#3b82f6]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-bold uppercase tracking-wide text-black">Add Cost Record</h1>
      </div>

      <form onSubmit={handleSubmit} className="border border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000000]">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-700">Note</label>
            <textarea
              rows={4}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="border border-black bg-white p-3 text-sm font-medium text-black focus:outline-none resize-none"
              placeholder="Short note about the cost"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-700">Cost</label>
            <input
              type="number"
              step="0.01"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              className="border border-black bg-white p-3 text-sm font-medium text-black focus:outline-none"
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-700">Reason</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="border border-black bg-white p-3 text-sm font-medium text-black focus:outline-none"
              placeholder="Why this cost happened"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="border border-black bg-[#3b82f6] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Cost"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dotadmin/costing")}
            className="border border-black bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
