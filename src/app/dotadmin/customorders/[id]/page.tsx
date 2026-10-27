"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCustomOrderById, updateCustomOrder } from "@/api/customOrderApi";

export default function CustomOrderDetailsPage() {
  const params = useParams();
  const orderId = params.id;
  
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState("New Request");
  const [price, setPrice] = useState<number | "">("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (orderId) {
      getCustomOrderById(orderId as string).then((res) => {
        if (res.data) {
          setOrder(res.data);
          setStatus(res.data.status || "New Request");
          setPrice(res.data.price || "");
        }
      });
    }
  }, [orderId]);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await updateCustomOrder(orderId as string, { status, price: price === "" ? undefined : Number(price) });
      alert("Order updated successfully!");
      const res = await getCustomOrderById(orderId as string);
      if (res.data) setOrder(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    } finally {
      setIsSaving(false);
    }
  };

  if (!order) return <div className="p-8 font-bold">Loading...</div>;

  const customerName = order.customerName || order.user?.name || "Unknown";
  const customerPhone = order.customerPhone || order.user?.phone || "N/A";
  const customerEmail = order.customerEmail || order.user?.email || "N/A";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dotadmin/customorders" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">Custom Request: CUST-{order.id}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.open(`/dotadmin/customorders/${order.id}/invoice`, '_blank')}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 text-sm font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print Invoice
          </button>
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 text-sm font-medium border border-blue-200 dark:border-blue-800/50">
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Request Info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <h2 className="text-xl font-semibold mb-6 border-b pb-4 dark:border-gray-800">Request Details</h2>
            <div className="flex flex-col gap-6">
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Category</span>
                  <p className="font-medium">{order.category}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Item/Package</span>
                  <p className="font-medium">{order.item}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Quantity</span>
                  <p className="font-medium text-blue-600">{order.quantity} Units</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Instructions & Customization Info</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-white border dark:bg-gray-950 dark:border-gray-800 p-4 rounded-md">
                  {order.details || "No additional details provided."}
                </p>
              </div>

              <div className="border-t pt-6 mt-2 dark:border-gray-800">
                <h4 className="text-sm font-semibold mb-4">Pricing Quote</h4>
                <div className="flex flex-col gap-3">
                  <div className="mt-2 pt-4 border-t border-dashed dark:border-gray-800">
                    <label htmlFor="quotedTotal" className="text-xs font-bold block mb-1">Final Quoted Total to Customer (৳)</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number"
                        id="quotedTotal"
                        value={price}
                        onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        className="border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase flex-1 max-w-[200px]"
                      />
                      <button 
                        onClick={handleUpdate}
                        disabled={isSaving}
                        className="border-2 border-[#0D4B2D] bg-[#106840] px-6 py-2 text-sm font-extrabold uppercase text-white shadow-[4px_4px_0px_0px_#0D4B2D] transition-all hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Quote"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800 flex flex-col gap-4">
            <h2 className="text-xl font-semibold border-b pb-4 dark:border-gray-800">Update Status</h2>
            <div className="flex items-center gap-4">
              <select 
                id="status" 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full max-w-xs border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
              >
                <option value="New Request">New Request</option>
                <option value="Quoted">Quoted</option>
                <option value="In Production">In Production</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button 
                type="button"
                onClick={handleUpdate}
                disabled={isSaving}
                className="bg-black text-white px-6 py-2 text-sm font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
              >
                {isSaving ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & File Info */}
        <div className="flex flex-col gap-8">
          <div className="border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800 flex flex-col gap-6">
            <h2 className="text-xl font-semibold border-b pb-4 dark:border-gray-800">Customer Details</h2>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Name / Company</span>
              <p className="font-medium">{customerName}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Phone Number</span>
              <p className="font-medium">{customerPhone}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
              <p className="font-medium text-blue-600 hover:underline cursor-pointer">{customerEmail}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Date Requested</span>
              <p className="font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
            </div>
          </div>

          {order.user && (
            <div className="border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800 flex flex-col gap-6">
              <h2 className="text-xl font-semibold border-b pb-4 dark:border-gray-800">Linked Account</h2>
              <div className="flex items-center gap-4">
                {order.user.picture ? (
                  <img src={order.user.picture} alt={order.user.name} className="w-12 h-12 rounded-full object-cover border-[2px] border-black" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 border-[2px] border-black flex items-center justify-center text-gray-600 font-bold">
                    {order.user.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <p className="font-bold text-black">{order.user.name}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">{order.user.role}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between border-b pb-1 dark:border-gray-800">
                  <span className="text-gray-500 font-bold uppercase">Account ID</span>
                  <span className="font-bold">#{order.user.id}</span>
                </div>
                <div className="flex justify-between border-b pb-1 dark:border-gray-800">
                  <span className="text-gray-500 font-bold uppercase">Email</span>
                  <span className="font-bold">{order.user.email}</span>
                </div>
                {order.user.phone && (
                  <div className="flex justify-between border-b pb-1 dark:border-gray-800">
                    <span className="text-gray-500 font-bold uppercase">Phone</span>
                    <span className="font-bold">{order.user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
