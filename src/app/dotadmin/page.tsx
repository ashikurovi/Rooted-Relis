"use client";

import { useEffect, useState } from "react";
import { getDashboardData } from "@/api/dashboardApi";

type SummaryItem = {
  date?: string;
  weekStart?: string;
  weekEnd?: string;
  totalSell: number;
  totalCost: number;
  income: number;
  pending: number;
  shipped: number;
  delivered: number;
  refunded: number;
};

type DashboardData = {
  totalRevenue: { value: string; percentageChange: string };
  subscriptions: { value: string; percentageChange: string };
  sales: { value: string; percentageChange: string };
  activeNow: { value: string; percentageChange: string };
  totalSell?: number;
  totalCost?: number;
  income?: number;
  statusSummary?: {
    pending: number;
    shipped: number;
    delivered: number;
    refunded: number;
  };
  dailySummary?: SummaryItem[];
  weeklySummary?: SummaryItem[];
  chartData: { name: string; total: number }[];
  recentSales: { id: number; name: string; email: string; amount: string }[];
};

const emptyDashboard: DashboardData = {
  totalRevenue: { value: "-", percentageChange: "" },
  subscriptions: { value: "-", percentageChange: "" },
  sales: { value: "-", percentageChange: "" },
  activeNow: { value: "-", percentageChange: "" },
  chartData: [],
  recentSales: [],
  dailySummary: [],
  weeklySummary: [],
  statusSummary: { pending: 0, shipped: 0, delivered: 0, refunded: 0 },
};

export default function AdminPage() {
  const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardData()
      .then(setDashboard)
      .catch(() => setError("Unable to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Revenue", data: dashboard.totalRevenue, icon: "$" },
    { label: "Subscriptions", data: dashboard.subscriptions, icon: "U" },
    { label: "Sales", data: dashboard.sales, icon: "C" },
    { label: "Active Now", data: dashboard.activeNow, icon: "~" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-2 py-4 sm:px-4">
      <div className="mb-2 flex items-center justify-between border-b border-black pb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide text-black md:text-4xl">Dashboard</h1>
      </div>

      {error && <div className="border border-red-600 bg-red-50 p-4 font-bold text-red-700">{error}</div>}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => <div key={card.label} className="border border-black bg-white p-6 transition-colors hover:bg-gray-50">
          <div className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="text-sm font-black uppercase tracking-tight text-black">{card.label}</h3>
            <span className="text-lg font-black text-black">{card.icon}</span>
          </div>
          <div className="text-3xl font-black text-[#106840] mt-2">{loading ? "..." : card.data.value}</div>
          <p className="text-xs font-bold text-gray-600 uppercase mt-1">{card.data.percentageChange || "No change data"}</p>
        </div>)}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="border border-black bg-white p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Total Sell</p>
          <p className="mt-3 text-2xl font-black text-black">৳{loading ? "..." : Number(dashboard.totalSell || 0).toLocaleString()}</p>
        </div>
        <div className="border border-black bg-white p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Total Cost</p>
          <p className="mt-3 text-2xl font-black text-black">৳{loading ? "..." : Number(dashboard.totalCost || 0).toLocaleString()}</p>
        </div>
        <div className="border border-black bg-white p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Income</p>
          <p className="mt-3 text-2xl font-black text-[#106840]">৳{loading ? "..." : Number(dashboard.income || 0).toLocaleString()}</p>
        </div>
        <div className="border border-black bg-white p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Order Status</p>
          <div className="mt-3 space-y-1 text-sm font-bold text-gray-700">
            <div>Pending: {dashboard.statusSummary?.pending ?? 0}</div>
            <div>Shipped: {dashboard.statusSummary?.shipped ?? 0}</div>
            <div>Delivered: {dashboard.statusSummary?.delivered ?? 0}</div>
            <div>Refunded: {dashboard.statusSummary?.refunded ?? 0}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="border border-black bg-white p-6">
          <h3 className="mb-4 text-xl font-black uppercase tracking-wide text-black">Daily Review</h3>
          <div className="space-y-3">
            {dashboard.dailySummary?.map((item) => (
              <div key={item.date} className="grid grid-cols-4 gap-2 border-b border-gray-200 pb-2 text-sm">
                <div className="font-bold text-black">{item.date}</div>
                <div>Sell: <span className="font-bold text-green-600">৳{Number(item.totalSell || 0).toLocaleString()}</span></div>
                <div>Cost: <span className="font-bold text-red-600">৳{Number(item.totalCost || 0).toLocaleString()}</span></div>
                <div>Income: <span className="font-bold text-[#106840]">৳{Number(item.income || 0).toLocaleString()}</span></div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-black bg-white p-6">
          <h3 className="mb-4 text-xl font-black uppercase tracking-wide text-black">Weekly Review</h3>
          <div className="space-y-3">
            {dashboard.weeklySummary?.map((item) => (
              <div key={`${item.date ?? item.weekStart ?? 'week'}-${item.weekEnd ?? ''}`} className="grid grid-cols-4 gap-2 border-b border-gray-200 pb-2 text-sm">
                <div className="font-bold text-black">{item.date || `${item.weekStart ?? ''} → ${item.weekEnd ?? ''}`}</div>
                <div>Sell: <span className="font-bold text-green-600">৳{Number(item.totalSell || 0).toLocaleString()}</span></div>
                <div>Cost: <span className="font-bold text-red-600">৳{Number(item.totalCost || 0).toLocaleString()}</span></div>
                <div>Income: <span className="font-bold text-[#106840]">৳{Number(item.income || 0).toLocaleString()}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-7">
        <div className="border border-black bg-white p-6 lg:col-span-4">
          <h3 className="mb-6 w-max border-b border-black pb-2 text-2xl font-bold uppercase tracking-wide text-black">Overview</h3>
          <div className="h-[300px] flex items-end gap-2 border-b-4 border-l-4 border-black px-2 pb-0 pt-8">
            {dashboard.chartData.map((point) => {
              const maxTotal = Math.max(...dashboard.chartData.map((item) => item.total), 1);
              return <div key={point.name} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="w-full bg-[#106840]" style={{ height: `${Math.max((point.total / maxTotal) * 100, 4)}%` }} title={`${point.name}: ${point.total}`} />
                <span className="text-[10px] font-bold text-gray-600">{point.name}</span>
              </div>;
            })}
            {!loading && dashboard.chartData.length === 0 && <span className="m-auto text-sm font-bold text-gray-500">No chart data available</span>}
          </div>
        </div>
        
        <div className="border border-black bg-white p-6 lg:col-span-3">
          <h3 className="mb-2 text-2xl font-bold uppercase tracking-wide text-black">Recent Sales</h3>
          <p className="mb-6 border-b border-black pb-4 text-sm font-bold uppercase tracking-widest text-gray-500">Latest dashboard activity</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-black text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="px-2 py-3 font-bold">Customer</th>
                  <th className="px-2 py-3 font-bold">Email</th>
                  <th className="px-2 py-3 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-200 last:border-b-0">
                    <td className="px-2 py-4 font-bold uppercase text-black">{sale.name}</td>
                    <td className="px-2 py-4 text-xs text-gray-500">{sale.email}</td>
                    <td className="px-2 py-4 text-right font-black text-[#106840]">{sale.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && dashboard.recentSales.length === 0 && <p className="py-4 text-sm font-bold text-gray-500">No recent sales available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
