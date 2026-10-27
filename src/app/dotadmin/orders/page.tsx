"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { TableControls } from "@/components/admin/table-controls";
import { TablePagination } from "@/components/admin/table-pagination";
import { Eye, Edit, Trash2 } from "lucide-react";
import { getAllOrders, deleteOrder, updateOrderStatus } from "@/api/orderApi";

export default function OrdersManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const itemsPerPage = 5;

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    getAllOrders()
      .then((res) => {
        if (res.data) setOrders(res.data);
      })
      .catch(console.error);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id);
        loadOrders();
      } catch (err) {
        console.error("Failed to delete order", err);
      }
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingStatusId(id);
    try {
      await updateOrderStatus(id, { status });
      loadOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Processing", value: "Processing" },
    { label: "Shipped", value: "Shipped" },
    { label: "Delivered", value: "Delivered" },
    { label: "Refunded", value: "Refunded" },
  ];

  // Filter and Search logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName = order.user?.fullName || order.orderNotes || "Guest";
      const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            order.id.toString().includes(searchQuery);
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-emerald-100 text-[#106840] border border-emerald-300 font-bold";
      case "Processing": return "bg-amber-100 text-[#B87B14] border border-amber-300 font-bold";
      case "Shipped": return "bg-teal-100 text-teal-800 border border-teal-300 font-bold";
      case "Pending": return "bg-yellow-100 text-yellow-800 border border-yellow-300 font-bold";
      case "Cancelled": return "bg-rose-100 text-rose-700 border border-rose-300 font-bold";
      case "Refunded": return "bg-rose-100 text-rose-700 border border-rose-300 font-bold";
      default: return "bg-gray-100 text-gray-700 border border-gray-300 font-bold";
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-2 py-4 sm:px-4">
      <div className="flex flex-col justify-between gap-4 border-b border-[#0D4B2D]/20 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-wide text-[#0D4B2D]">Orders Management</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-[#D9941E] mt-1">Rooted Relish Store Orders</p>
        </div>
        <Link 
          href="/dotadmin/orders/add"
          className="border-2 border-[#0D4B2D] bg-[#106840] px-6 py-2 text-sm font-bold uppercase text-white shadow-[3px_3px_0px_0px_#0D4B2D] transition-all hover:bg-[#0D4B2D] hover:shadow-[4px_4px_0px_0px_#D9941E] rounded-md"
        >
          Create New Order
        </Link>
      </div>

      <div>
        <TableControls 
          searchQuery={searchQuery}
          setSearchQuery={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          statusOptions={statusOptions}
          searchPlaceholder="Search by customer or order ID..."
        />
        <div className="overflow-hidden border border-black bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => {
                  const customerName = order.user?.fullName || order.orderNotes || "Guest";
                  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString();
                  
                  return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>CG-{String(order.id).padStart(4, '0')}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`CG-${String(order.id).padStart(4, '0')}`);
                          }}
                          className="text-gray-400 hover:text-black"
                          title="Copy Order ID"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>{orderDate}</TableCell>
                    <TableCell>৳{order.totalAmount}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md inline-block ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={order.status}
                          onChange={(event) => handleStatusChange(order.id, event.target.value)}
                          disabled={updatingStatusId === order.id}
                          aria-label={`Change status for order ${order.id}`}
                          className="border-2 border-[#0D4B2D]/40 bg-[#FDFBF7] px-2 py-1 text-xs font-bold uppercase text-[#0D4B2D] rounded focus:border-[#106840] focus:outline-none disabled:cursor-wait disabled:opacity-50"
                        >
                          {statusOptions.slice(1).map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <Link 
                          href={`/dotadmin/orders/${order.id}`}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/dotadmin/orders/${order.id}`}
                          className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          type="button"
                          onClick={() => handleDelete(order.id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
