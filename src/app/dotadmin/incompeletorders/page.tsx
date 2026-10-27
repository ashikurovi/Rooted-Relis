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
import { Eye, Mail, MessageCircle, ArrowRightLeft, Trash2 } from "lucide-react";
import { getAllIncompleteOrders, deleteIncompleteOrder } from "@/api/incompleteOrderApi";

export default function IncompleteOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);
    getAllIncompleteOrders()
      .then((res) => {
        if (res.data) setOrders(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this incomplete order?")) {
      try {
        await deleteIncompleteOrder(id);
        loadOrders();
      } catch (err) {
        console.error("Failed to delete order", err);
      }
    }
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Recovered", value: "Recovered" },
    { label: "Lost", value: "Lost" },
  ];

  // Filter and Search logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName = order.customerName || "";
      const customerPhone = order.customerPhone || "";
      const customerEmail = order.customerEmail || "";
      
      const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            customerPhone.includes(searchQuery) ||
                            customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
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
      case "Pending": return "bg-amber-50 text-[#B87B14] border border-amber-300 font-bold rounded-md px-2.5 py-1";
      case "Lost": return "bg-rose-50 text-rose-700 border border-rose-300 font-bold rounded-md px-2.5 py-1";
      case "Recovered": return "bg-emerald-50 text-[#106840] border border-emerald-300 font-bold rounded-md px-2.5 py-1";
      default: return "bg-gray-100 text-gray-700 border border-gray-300 font-bold rounded-md px-2.5 py-1";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#0D4B2D]">Incomplete Orders</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-[#D9941E] mt-1">Manage abandoned carts and follow up with customers</p>
        </div>
      </div>

      <div>
        <TableControls 
          searchQuery={searchQuery}
          setSearchQuery={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          statusOptions={statusOptions}
          searchPlaceholder="Search by name, phone or email..."
        />
        <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Details</TableHead>
                <TableHead>Cart / Items</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500 font-bold uppercase">
                    Loading incomplete orders...
                  </TableCell>
                </TableRow>
              ) : paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No incomplete orders found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.customerName || "Unknown"}</div>
                      <div className="text-xs text-gray-500 flex flex-col gap-1 mt-1">
                        <span>{order.customerPhone || "N/A"}</span>
                        <span>{order.customerEmail || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.selectedProducts && order.selectedProducts.map((p: any, i: number) => (
                        <div key={i} className="text-sm">
                          {p.quantity}x {p.productName || `Product #${p.productId}`}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        {order.customerPhone && (
                          <a 
                            href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=Hi ${order.customerName}, we noticed you left some items in your cart...`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 hover:text-green-700 transition-colors"
                            title="Message on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                        
                        {order.customerEmail && (
                          <a 
                            href={`mailto:${order.customerEmail}?subject=Your items are waiting!&body=Hi ${order.customerName},`}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 hover:text-blue-700 transition-colors"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}

                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1"></div>

                        <button 
                          onClick={() => handleDelete(order.id)}
                          type="button"
                          className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
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
