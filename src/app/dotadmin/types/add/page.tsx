"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createType } from "../../../../api/typeApi";

export default function AddEditTypePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createType({
        name,
        description: "" // Add a default description if needed by backend, though it might be nullable
      });
      router.push("/dotadmin/types");
    } catch (error) {
      console.error("Failed to create type", error);
      alert("Failed to create type. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/types" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Add / Edit Type</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Form Area */}
        <div className="flex-1 w-full border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <form id="typeForm" onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 text-black">Type Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-black uppercase text-black">Type Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Drop Shoulder" 
                    className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#3b82f6] text-white px-8 py-3 text-sm font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Type"}
              </button>
              <button 
                type="button"
                onClick={() => router.push("/dotadmin/types")}
                className="border-[3px] border-black bg-white px-8 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none text-black"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Form Area */}
        <div className="w-full lg:w-[350px] flex flex-col gap-8">
          <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-4 text-black">Organization</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="status" className="text-sm font-black uppercase text-black">Status</label>
                <select 
                  id="status" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
