"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllCosting, deleteCosting } from "@/api/costingApi";

export default function CostingPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllCosting();
      setItems(res?.data || []);
    } catch (error) {
      console.error("Failed to load costing data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this cost record?")) return;

    try {
      await deleteCosting(id);
      await fetchData();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete cost record.");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-2 py-4 sm:px-4">
      <div className="flex items-center justify-between border-b border-black pb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide text-black md:text-4xl">Costing</h1>
        <Link
          href="/dotadmin/costing/add"
          className="border border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition-colors hover:bg-gray-800"
        >
          + Add Cost
        </Link>
      </div>

      <div className="overflow-hidden border border-black bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead className="bg-gray-100">
              <tr className="border-b border-black text-[10px] uppercase tracking-[0.2em] text-gray-600">
                <th className="px-4 py-3 font-bold">ID</th>
                <th className="px-4 py-3 font-bold">Note</th>
                <th className="px-4 py-3 font-bold">Cost</th>
                <th className="px-4 py-3 font-bold">Reason</th>
                <th className="px-4 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No costing data found.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 last:border-b-0 align-top">
                    <td className="px-4 py-3 font-bold text-black">{item.id}</td>
                    <td className="px-4 py-3 text-gray-700">{item.note || "-"}</td>
                    <td className="px-4 py-3 font-bold text-red-600">৳{Number(item.cost || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700">{item.reason || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dotadmin/costing/${item.id}/invoice`}
                          className="border border-black bg-[#3b82f6] px-3 py-1.5 text-xs font-black uppercase text-white transition-colors hover:bg-blue-600"
                        >
                          Print
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="border border-red-500 bg-red-50 px-3 py-1.5 text-xs font-black uppercase text-red-600 transition-colors hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
