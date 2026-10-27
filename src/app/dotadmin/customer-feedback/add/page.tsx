"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

export default function AddCustomerFeedbackPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/customer-feedback" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Add Customer to Showcase</h1>
      </div>

      <div className="border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800 max-w-2xl">
        <form className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-4 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Customer Details</h3>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-black uppercase text-black">Name and Title</label>
              <input 
                type="text" 
                id="name" 
                placeholder="e.g. Tanmoy Cartoons, Artist" 
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
              />
              <p className="text-xs text-gray-500">This will appear directly below their photo.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm font-black uppercase text-black">Status</label>
              <select 
                id="status" 
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Portrait Image</h3>
            <p className="text-sm text-gray-500 mb-2">Recommended resolution: 600x750 (4:5 aspect ratio).</p>
            <div className="border-[3px] border-dashed border-black rounded-none p-10 flex flex-col items-center justify-center bg-white hover:bg-gray-100 transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 text-black">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="font-medium text-gray-600 dark:text-gray-300 text-sm">Click to upload photo</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 3MB</p>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button 
              type="button"
              onClick={() => router.push("/dotadmin/customer-feedback")}
              className="border-2 border-[#0D4B2D] bg-[#106840] px-8 py-3 text-sm font-extrabold uppercase text-white shadow-[4px_4px_0px_0px_#0D4B2D] transition-all hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md disabled:opacity-50"
            >
              Save Customer
            </button>
            <button 
              type="button"
              onClick={() => router.push("/dotadmin/customer-feedback")}
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
