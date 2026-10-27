"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createCoupon } from "@/api/couponApi";

export default function AddCouponPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    value: 10,
    minOrderAmount: 0,
    maxDiscount: 0,
    isActive: true,
    usageLimit: 0,
    expiresAt: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createCoupon({
        ...form,
        code: String(form.code).trim(),
        value: Number(form.value),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxDiscount: Number(form.maxDiscount || 0),
        usageLimit: Number(form.usageLimit || 0),
      });
      router.push("/dotadmin/coupons");
    } catch (error) {
      console.error("Failed to create coupon", error);
      alert("Failed to create coupon. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/coupons" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          ←
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Add Coupon</h1>
      </div>

      <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-black uppercase text-black">Coupon Code</label>
            <input
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
              required
              className="w-full border-[3px] border-black p-3 text-sm font-bold uppercase"
              placeholder="SAVE10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-black uppercase text-black">Discount Type</label>
            <select
              value={form.discountType}
              onChange={(e) => handleChange("discountType", e.target.value)}
              className="w-full border-[3px] border-black p-3 text-sm font-bold uppercase"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-black uppercase text-black">Value</label>
            <input
              type="number"
              min="0"
              value={form.value}
              onChange={(e) => handleChange("value", Number(e.target.value))}
              required
              className="w-full border-[3px] border-black p-3 text-sm font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-black uppercase text-black">Min Order</label>
            <input
              type="number"
              min="0"
              value={form.minOrderAmount}
              onChange={(e) => handleChange("minOrderAmount", Number(e.target.value))}
              className="w-full border-[3px] border-black p-3 text-sm font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-black uppercase text-black">Max Discount</label>
            <input
              type="number"
              min="0"
              value={form.maxDiscount}
              onChange={(e) => handleChange("maxDiscount", Number(e.target.value))}
              className="w-full border-[3px] border-black p-3 text-sm font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-black uppercase text-black">Usage Limit</label>
            <input
              type="number"
              min="0"
              value={form.usageLimit}
              onChange={(e) => handleChange("usageLimit", Number(e.target.value))}
              className="w-full border-[3px] border-black p-3 text-sm font-bold"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-black uppercase text-black">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full border-[3px] border-black p-3 text-sm font-bold"
              placeholder="Optional coupon description"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-black uppercase text-black">Expiry Date</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => handleChange("expiresAt", e.target.value)}
              className="w-full border-[3px] border-black p-3 text-sm font-bold"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="h-4 w-4 border-black"
            />
            <label className="text-sm font-black uppercase text-black">Active</label>
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="border-2 border-[#0D4B2D] bg-[#106840] px-8 py-3 text-sm font-extrabold uppercase text-white shadow-[4px_4px_0px_0px_#0D4B2D] transition-all hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Coupon"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dotadmin/coupons")}
              className="border-2 border-[#0D4B2D]/40 bg-[#FDFBF7] px-8 py-3 text-sm font-extrabold uppercase text-[#0D4B2D] shadow-[4px_4px_0px_0px_rgba(13,75,45,0.2)] transition-all hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400 hover:shadow-[5px_5px_0px_0px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
