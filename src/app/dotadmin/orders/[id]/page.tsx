"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrderById, updateOrderStatus, updateOrder } from "@/api/orderApi";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = () => {
    setLoading(true);
    getOrderById(orderId)
      .then((res) => {
        if (res.data) {
          setOrder(res.data);
          setStatus(res.data.status);
          setPaymentMethod(res.data.paymentMethod || "COD");
          setDeliveryType(res.data.deliveryType || "INSIDE_DHAKA");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleUpdateOrderInfo = async () => {
    if (!status) return;
    setUpdating(true);
    try {
      await updateOrder(orderId, { status, paymentMethod, deliveryType });
      loadOrder();
      alert("Order info updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update order info");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xl font-bold uppercase">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-xl font-bold uppercase text-red-500">Order not found.</div>;
  }

  const customerName = order.user?.name || order.orderNotes || "Guest";
  const customerEmail = order.user?.email || "N/A";
  const customerPhone = order.user?.phone || "N/A";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Shipped": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getItemName = (item: any) => {
    if (item.product) return item.product.title;
    if (item.flashsell) return item.flashsell.title || 'Flash Sale Item';
    if (item.budgetPick) return item.budgetPick.title || 'Budget Pick Item';
    return "Unknown Item";
  };

  const getItemPrice = (item: any) => {
    if (item.product) return item.product.currentPrice || item.product.price || 0;
    if (item.flashsell) return item.flashsell.currentPrice || item.flashsell.price || 0;
    if (item.budgetPick) return item.budgetPick.currentPrice || item.budgetPick.price || 0;
    return 0;
  };

  const getItemThumbnail = (item: any) => {
    if (item.product) return item.product.thumbnail;
    if (item.flashsell) return item.flashsell.thumbnail;
    if (item.budgetPick) return item.budgetPick.thumbnail;
    return null;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dotadmin/orders" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black uppercase tracking-tight text-black">Order Details: CG-{String(order.id).padStart(4, '0')}</h1>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`CG-${String(order.id).padStart(4, '0')}`);
              }}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
              title="Copy Order ID"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.open(`/dotadmin/orders/${order.id}/invoice`, '_blank')}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 text-sm font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print Invoice
          </button>
          <span className={`px-4 py-2 text-sm font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Order Info and Items */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <h2 className="text-xl font-black uppercase mb-6 border-b-4 border-black w-max pb-1">Order Items</h2>
            <div className="flex flex-col gap-4">
              {order.items?.length > 0 ? (
                order.items.map((item: any) => {
                  const price = getItemPrice(item);
                  return (
                    <div key={item.id} className="flex justify-between items-center py-4 border-b-2 border-black last:border-0">
                      <div className="flex items-center gap-4">
                        {getItemThumbnail(item) && (
                          <img src={getItemThumbnail(item)} alt="Product" className="w-16 h-16 object-cover border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
                        )}
                        <div className="flex flex-col">
                          <span className="font-bold uppercase text-black">{getItemName(item)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-600">{item.quantity} x ৳{price}</span>
                        <p className="font-black text-lg">৳{(item.quantity * price)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 font-bold uppercase">No items found.</p>
              )}
              
              <div className="border-t-4 border-black mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold uppercase py-1">
                  <span className="text-gray-500">Subtotal</span>
                  <span>৳{(Number(order.totalAmount) - Number(order.deliveryFee || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold uppercase py-1">
                  <span className="text-gray-500">Delivery Fee ({order.deliveryType?.replace(/_/g, " ") || "N/A"})</span>
                  <span>৳{order.deliveryFee || "0.00"}</span>
                </div>
                <div className="flex justify-between text-lg font-bold uppercase py-1">
                  <span className="text-gray-500">Payment Method</span>
                  <span>{order.paymentMethod || "N/A"}</span>
                </div>
                <div className="flex justify-between text-2xl font-black uppercase py-3 mt-2 border-t-2 border-black">
                  <span>Total Amount</span>
                  <span>৳{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 rounded-none">
            <h2 className="text-xl font-black uppercase border-b-4 border-black w-max pb-1">Update Order Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border-[3px] border-black p-3 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border-[3px] border-black p-3 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="BKASH">bKash</option>
                  <option value="NAGAD">Nagad</option>
                  <option value="ROCKET">Rocket</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase">Delivery Type</label>
                <select 
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="w-full border-[3px] border-black p-3 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="INSIDE_DHAKA">Inside Dhaka</option>
                  <option value="OUTSIDE_DHAKA">Outside Dhaka</option>
                </select>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleUpdateOrderInfo}
              disabled={updating}
              className="mt-4 border-2 border-[#0D4B2D] bg-[#106840] text-white px-8 py-3 w-max text-sm font-extrabold uppercase shadow-[4px_4px_0px_0px_#0D4B2D] transition-all hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update Info"}
            </button>
          </div>
        </div>

        {/* Right Column: Customer Info */}
        <div className="flex flex-col gap-8">
          <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 rounded-none">
            <h2 className="text-xl font-black uppercase border-b-4 border-black w-max pb-1">Customer Details</h2>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-gray-500 uppercase">Name</span>
              <p className="font-black uppercase">{customerName}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-gray-500 uppercase">Email</span>
              <p className="font-black text-blue-600 hover:underline cursor-pointer">{customerEmail}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-gray-500 uppercase">Phone</span>
              <p className="font-black uppercase">{customerPhone}</p>
            </div>
            {order.orderNotes && (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-sm font-bold text-gray-500 uppercase">Order Notes</span>
                <p className="text-sm font-bold italic">{order.orderNotes}</p>
              </div>
            )}
          </div>

          <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 rounded-none">
            <h2 className="text-xl font-black uppercase border-b-4 border-black w-max pb-1">Shipping Address</h2>
            <p className="text-sm font-bold uppercase leading-relaxed whitespace-pre-wrap">
              {order.shippingAddress || "No shipping address provided."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
