"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getInventoryById, updateInventory, getInventoryHistory } from "../../../../api/inventoryApi";

export default function InventoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const inventoryId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [product, setProduct] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("In Stock");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await getInventoryById(inventoryId as string);
        const data = res.data ? res.data : res;
        if (data) {
          setProduct(data.product || "");
          setSku(data.sku || "");
          setStock(data.stock?.toString() || "0");
          setStatus(data.status || "In Stock");
        }

        const historyRes = await getInventoryHistory(inventoryId as string);
        if (historyRes) {
          setHistory(Array.isArray(historyRes) ? historyRes : (historyRes.data || []));
        }
      } catch (error) {
        console.error("Failed to fetch inventory", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (inventoryId) {
      fetchInventory();
    }
  }, [inventoryId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateInventory(inventoryId as string, {
        product,
        sku,
        stock: Number(stock),
        status,
      });
      alert("Inventory updated successfully!");
      router.push("/dotadmin/inventory");
    } catch (error) {
      console.error("Failed to update inventory", error);
      alert("Failed to update inventory. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading inventory details...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/inventory" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Inventory Details: INV-{inventoryId}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <h2 className="text-xl font-semibold mb-6">Edit Inventory Record</h2>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="product" className="text-sm font-black uppercase text-black">Product Name</label>
              <input 
                type="text" 
                id="product" 
                value={product}
                disabled
                className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sku" className="text-sm font-black uppercase text-black">SKU</label>
              <input 
                type="text" 
                id="sku" 
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="stock" className="text-sm font-black uppercase text-black">Current Stock</label>
              <input 
                type="number" 
                id="stock" 
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm font-black uppercase text-black">Status</label>
              <select 
                id="status" 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                type="submit"
                disabled={isSaving}
                className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800 flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Stock History</h2>
          <div className="flex flex-col gap-4">
            {history.length === 0 ? (
              <p className="text-sm text-gray-500">No stock history available.</p>
            ) : (
              history.map((record) => (
                <div key={record.id} className="border-b pb-4 dark:border-gray-800">
                  <p className={`text-sm font-medium ${record.changeAmount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {record.changeAmount > 0 ? `+${record.changeAmount}` : record.changeAmount} Units
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(record.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {record.reason}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
