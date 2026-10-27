"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCostingById } from "@/api/costingApi";

export default function CostingInvoicePage() {
  const params = useParams();
  const costingId = params.id as string;
  const [record, setRecord] = useState<any>(null);

  useEffect(() => {
    if (costingId) {
      getCostingById(costingId)
        .then((res) => {
          if (res?.data) setRecord(res.data);
        })
        .catch((error) => {
          console.error("Failed to load costing invoice", error);
        });
    }
  }, [costingId]);

  useEffect(() => {
    if (record) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [record]);

  if (!record) {
    return <div className="p-8 text-center text-gray-600">Loading Invoice...</div>;
  }

  const invoiceDate = new Date(record.createdAt || Date.now()).toLocaleDateString();

  return (
    <div
      id="print-costing-invoice"
      className="mx-auto min-h-screen max-w-3xl bg-white p-8 text-black"
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
    >
      <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-start justify-between border-b-[3px] border-black pb-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Rooted Relish" className="h-12 w-12 object-contain" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#106840]">Rooted Relish</p>
              <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#0D4B2D]">Cost Invoice</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold uppercase text-gray-700">Invoice #</p>
            <p className="text-2xl font-black">RR-{String(record.id).padStart(4, "0")}</p>
            <p className="mt-2 text-sm font-bold text-gray-700">Date: {invoiceDate}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border-2 border-black p-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-600">Cost Note</p>
            <p className="mt-2 font-medium text-gray-800">{record.note || "-"}</p>
          </div>
          <div className="border-2 border-black p-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-600">Reason</p>
            <p className="mt-2 font-medium text-gray-800">{record.reason || "-"}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden border-[3px] border-black">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-r-[3px] border-black p-3 text-xs font-black uppercase tracking-[0.25em]">Item</th>
                <th className="border-r-[3px] border-black p-3 text-xs font-black uppercase tracking-[0.25em] text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t-[3px] border-black">
                <td className="border-r-[3px] border-black p-3 font-bold">{record.note || "Cost Entry"}</td>
                <td className="p-3 text-right font-black text-red-600">৳{Number(record.cost || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between border-b-[3px] border-black pb-2">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-gray-700">Total</span>
              <span className="text-2xl font-black text-red-600">৳{Number(record.cost || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t-[3px] border-black pt-5 text-center">
          <p className="text-lg font-black uppercase">Thank you</p>
          <p className="mt-2 text-sm font-bold text-gray-600">This cost record is generated for accounting and review.</p>
        </div>

        <div className="mt-6 flex justify-center print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="border-[3px] border-black bg-[#106840] px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:bg-[#0D4B2D] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            Print Invoice
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * { visibility: hidden; }
            #print-costing-invoice, #print-costing-invoice * { visibility: visible; }
            #print-costing-invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `,
      }} />
    </div>
  );
}
