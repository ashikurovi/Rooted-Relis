"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/api/orderApi";

export default function InvoicePage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId)
        .then((res) => {
          if (res.data) setOrder(res.data);
        })
        .catch(console.error);
    }
  }, [orderId]);

  useEffect(() => {
    if (order) {
      // Auto-trigger print dialog after a short delay to allow images to load
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [order]);

  if (!order) return <div className="p-8">Loading Invoice...</div>;

  const customerName = order.user?.name || order.orderNotes || "Guest";
  const customerEmail = order.user?.email || "N/A";
  const customerPhone = order.user?.phone || "N/A";

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

  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString();

  return (
    <div id="print-invoice" className="bg-white text-black p-8 max-w-4xl mx-auto min-h-screen" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Rooted Relish" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-[#106840]">Rooted Relish</h1>
              <p className="text-xs font-bold uppercase text-[#D9941E]">Authentic Heritage Taste • Est. 2026</p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="mt-4 print:hidden bg-[#106840] text-white px-6 py-2 text-sm font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
          >
            Print Now
          </button>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black uppercase">INVOICE</h2>
          <p className="font-bold text-gray-700 mt-2">Order ID: CG-{String(order.id).padStart(4, '0')}</p>
          <p className="font-bold text-gray-700">Date: {orderDate}</p>
          <p className="font-bold text-gray-700">Status: <span className="uppercase px-2 py-1 bg-gray-200 border-2 border-black ml-1">{order.status}</span></p>
        </div>
      </div>

      {/* Addresses */}
      <div className="flex justify-between border-b-4 border-black pb-6 mb-6">
        <div className="w-1/2">
          <h3 className="font-black uppercase border-b-2 border-black w-max pb-1 mb-2">Billed To</h3>
          <p className="font-bold">{customerName}</p>
          <p className="font-bold text-gray-700">{customerEmail}</p>
          <p className="font-bold text-gray-700">{customerPhone}</p>
        </div>
        <div className="w-1/2 text-right">
          <h3 className="font-black uppercase border-b-2 border-black w-max pb-1 mb-2 ml-auto">Shipped To</h3>
          <p className="font-bold whitespace-pre-wrap">{order.shippingAddress}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full text-left border-collapse border-[3px] border-black">
          <thead>
            <tr className="border-b-[3px] border-black bg-gray-100">
              <th className="p-3 font-black uppercase border-r-[3px] border-black">Item</th>
              <th className="p-3 font-black uppercase border-r-[3px] border-black text-center w-24">Qty</th>
              <th className="p-3 font-black uppercase border-r-[3px] border-black text-right w-32">Price</th>
              <th className="p-3 font-black uppercase text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any) => {
              const price = getItemPrice(item);
              return (
                <tr key={item.id} className="border-b-[3px] border-black last:border-0">
                  <td className="p-3 font-bold border-r-[3px] border-black">{getItemName(item)}</td>
                  <td className="p-3 font-bold border-r-[3px] border-black text-center">{item.quantity}</td>
                  <td className="p-3 font-bold border-r-[3px] border-black text-right">৳{price}</td>
                  <td className="p-3 font-black text-right">৳{item.quantity * price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-12">
        <div className="w-72">
          <div className="flex justify-between py-2 border-b-2 border-black">
            <span className="font-bold uppercase text-gray-600">Subtotal</span>
            <span className="font-bold">৳{(Number(order.totalAmount) - Number(order.deliveryFee || 0)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b-2 border-black">
            <span className="font-bold uppercase text-gray-600">Delivery ({order.deliveryType?.replace(/_/g, " ") || "N/A"})</span>
            <span className="font-bold">৳{order.deliveryFee || "0.00"}</span>
          </div>
          <div className="flex justify-between py-4 border-b-[4px] border-black mt-2">
            <span className="text-2xl font-black uppercase">Total</span>
            <span className="text-2xl font-black">৳{order.totalAmount}</span>
          </div>
          <div className="flex justify-between py-2 mt-2">
            <span className="font-bold uppercase text-gray-600">Payment Method</span>
            <span className="font-bold uppercase">{order.paymentMethod || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t-4 border-black">
        <p className="font-black uppercase text-xl">Thank you for your business!</p>
        <p className="font-bold text-gray-600 mt-2">If you have any questions about this invoice, please contact us at support@rootedrelish.com</p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-invoice, #print-invoice * {
            visibility: visible;
          }
          #print-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}
