"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createCustomOrder } from "@/api/customOrderApi";
import { getAllUsers } from "@/api/userApi";
import { getAllCustomProducts } from "@/api/customproductsApi";

export default function AddCustomOrderPage() {
  const router = useRouter();
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [userId, setUserId] = useState<number | "">("");
  const [users, setUsers] = useState<any[]>([]);
  const [customProducts, setCustomProducts] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("New Request");
  const [price, setPrice] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers()
      .then(data => setUsers(data?.data || []))
      .catch(console.error);
      
    getAllCustomProducts()
      .then(data => {
        const products = data?.data || [];
        setCustomProducts(products);
        if (products.length > 0) {
          const firstCat = products[0].category;
          setCategory(firstCat);
          const firstItem = products.find((p: any) => p.category === firstCat)?.productName;
          setItem(firstItem || "");
        }
      })
      .catch(console.error);
  }, []);

  const categories = Array.from(new Set(customProducts.map(p => p.category)));
  const availableItems = customProducts.filter(p => p.category === category).map(p => p.productName);

  useEffect(() => {
    if (availableItems.length > 0 && !availableItems.includes(item)) {
      setItem(availableItems[0]);
    }
  }, [category, customProducts, availableItems, item]);

  useEffect(() => {
    if (item && quantity) {
      const selectedProduct = customProducts.find(p => p.productName === item);
      if (selectedProduct) {
        const basePrice = Number(selectedProduct.price) || 0;
        setPrice((basePrice * quantity).toString());
      }
    }
  }, [item, quantity, customProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const payload: any = {
        category,
        item,
        quantity: Number(quantity),
        status,
      };

      if (userId) payload.userId = Number(userId);
      if (customerName) payload.customerName = customerName;
      if (customerPhone) payload.customerPhone = customerPhone;
      if (customerEmail) payload.customerEmail = customerEmail;
      if (details) payload.details = details;
      if (price) payload.price = Number(price);

      const res = await createCustomOrder(payload);
      if (res.data) {
        router.push("/dotadmin/customorders");
      } else {
        setError(res.message || "Failed to create custom order.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/customorders" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Add Custom Order</h1>
      </div>

      <div className="border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800 max-w-3xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          
          <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="userId" className="text-sm font-black uppercase text-black">Select User (Optional)</label>
                <select 
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="">Guest (No Account)</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.fullName} ({user.email})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="customerName" className="text-sm font-black uppercase text-black">Name / Company Name</label>
                <input 
                  type="text" 
                  id="customerName" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. John Doe / Tech Innovators" 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="customerPhone" className="text-sm font-black uppercase text-black">Phone Number</label>
                <input 
                  type="text" 
                  id="customerPhone" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+880 1..." 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="customerEmail" className="text-sm font-black uppercase text-black">Email Address (Optional)</label>
                <input 
                  type="email" 
                  id="customerEmail" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com" 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-sm font-black uppercase text-black">Category</label>
                <select 
                  id="category" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  {categories.map((cat: any) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="item" className="text-sm font-black uppercase text-black">Specific Item / Package</label>
                <select 
                  id="item" 
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  {availableItems.map((itm: any) => (
                    <option key={itm} value={itm}>{itm}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="quantity" className="text-sm font-black uppercase text-black">Quantity</label>
                <input 
                  type="number" 
                  id="quantity" 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={1}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="details" className="text-sm font-black uppercase text-black">Additional Details & Instructions</label>
              <textarea 
                id="details" 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="Details about colors, sizes, logo placement..." 
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase resize-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm font-black uppercase text-black">Order Status</label>
              <select 
                id="status" 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
              >
                <option value="New Request">New Request</option>
                <option value="Quoted">Quoted</option>
                <option value="In Production">In Production</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="price" className="text-sm font-black uppercase text-black">Quoted Total Price (৳)</label>
              <input 
                type="number" 
                id="price" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Optional" 
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
              />
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="border-2 border-[#0D4B2D] bg-[#106840] px-8 py-3 text-sm font-extrabold uppercase text-white shadow-[4px_4px_0px_0px_#0D4B2D] transition-all hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Custom Order"}
            </button>
            <button 
              type="button"
              onClick={() => router.push("/dotadmin/customorders")}
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
