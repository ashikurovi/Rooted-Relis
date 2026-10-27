"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { createOrder } from "@/api/orderApi";
import { getAllProducts } from "@/api/productApi";
import { getAllUsers } from "@/api/userApi";

export default function AddOrderPage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [userId, setUserId] = useState<number | "">("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [status, setStatus] = useState("Pending");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [deliveryType, setDeliveryType] = useState("INSIDE_DHAKA");
  const [deliveryFee, setDeliveryFee] = useState<number>(60);

  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch products
    getAllProducts()
      .then(data => setProducts(data?.data || []))
      .catch(console.error);

    // Fetch users (optional, if they want to select an existing user)
    getAllUsers()
      .then(data => setUsers(data?.data || []))
      .catch(console.error);
  }, []);

  // Calculate total
  const totalAmount = items.reduce((acc, item) => {
    if (!item.productId) return acc;
    const prod = products.find(p => p.id === Number(item.productId));
    if (prod) {
      // Assuming 'currentPrice' or 'price' exists on product
      const price = prod.currentPrice || prod.price || 0;
      return acc + (price * item.quantity);
    }
    return acc;
  }, 0) + deliveryFee;

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // validate
    const validItems = items.filter(item => item.productId !== "" && item.quantity > 0);
    if (validItems.length === 0) {
      setError("Please add at least one valid product.");
      return;
    }
    if (!shippingAddress) {
      setError("Shipping address is required.");
      return;
    }

    setLoading(true);
    try {
      const orderNotes = customerName || customerEmail
        ? `Customer: ${customerName} (${customerEmail})`
        : "";

      const payload = {
        userId: userId ? Number(userId) : undefined,
        items: validItems.map(i => ({
          productId: Number(i.productId),
          quantity: Number(i.quantity)
        })),
        shippingAddress,
        status,
        paymentMethod,
        deliveryType,
        deliveryFee,
        totalAmount,
        orderNotes
      };

      await createOrder(payload);
      router.push("/dotadmin/orders");
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/orders" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Create New Order</h1>
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
              <div className="flex flex-col gap-2">
                <label htmlFor="customerName" className="text-sm font-black uppercase text-black">Customer Name</label>
                <input 
                  type="text" 
                  id="customerName" 
                  placeholder="e.g. John Doe" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="customerEmail" className="text-sm font-black uppercase text-black">Customer Email</label>
                <input 
                  type="email" 
                  id="customerEmail" 
                  placeholder="john@example.com" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Order Items</h3>
            
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-black uppercase text-black">Product</label>
                  <select 
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                    className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                  >
                    <option value="">Select a product...</option>
                    {products.map(prod => (
                      <option key={prod.id} value={prod.id}>{prod.title} - ৳{prod.currentPrice || prod.price}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2 relative">
                  <label className="text-sm font-black uppercase text-black">Quantity</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      min={1}
                      className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                    />
                    {items.length > 1 && (
                      <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 font-bold ml-2">X</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <button type="button" onClick={handleAddItem} className="text-sm font-medium text-blue-600 self-start mt-2 hover:underline">
              + Add another product
            </button>
          </div>

          <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Shipping Details</h3>
            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="text-sm font-black uppercase text-black">Shipping Address</label>
              <textarea 
                id="address" 
                rows={3}
                placeholder="Full address..." 
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase resize-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="deliveryType" className="text-sm font-black uppercase text-black">Delivery Type</label>
              <select 
                id="deliveryType" 
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
              >
                <option value="INSIDE_DHAKA">Inside Dhaka</option>
                <option value="OUTSIDE_DHAKA">Outside Dhaka</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="deliveryFee" className="text-sm font-black uppercase text-black">Delivery Fee (৳)</label>
              <input 
                type="number" 
                id="deliveryFee" 
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                min={0}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="paymentMethod" className="text-sm font-black uppercase text-black">Payment Method</label>
              <select 
                id="paymentMethod" 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
              >
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="BKASH">bKash</option>
                <option value="NAGAD">Nagad</option>
                <option value="ROCKET">Rocket</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm font-black uppercase text-black">Order Status</label>
              <select 
                id="status" 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-start-2">
              <label htmlFor="total" className="text-sm font-black uppercase text-black">Total Amount (৳) [Inc. Delivery]</label>
              <input 
                type="number" 
                id="total" 
                placeholder="0.00" 
                value={totalAmount}
                readOnly
                className="w-full border border-gray-300 p-2 text-sm focus:outline-none bg-gray-50 text-gray-500 dark:bg-gray-900 dark:border-gray-700 font-bold" 
              />
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="border-2 border-[#0D4B2D] bg-[#106840] px-8 py-3 text-sm font-extrabold uppercase text-white shadow-[4px_4px_0px_0px_#0D4B2D] transition-all hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Order"}
            </button>
            <button 
              type="button"
              onClick={() => router.push("/dotadmin/orders")}
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
