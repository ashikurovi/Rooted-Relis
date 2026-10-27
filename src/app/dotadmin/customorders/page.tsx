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
import { getAllCustomOrders, deleteCustomOrder } from "@/api/customOrderApi";

export default function CustomOrdersManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    getAllCustomOrders()
      .then((res) => {
        if (res.data) setOrders(res.data);
      })
      .catch(console.error);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this custom order?")) {
      try {
        await deleteCustomOrder(id);
        loadOrders();
      } catch (err) {
        console.error("Failed to delete order", err);
      }
    }
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "New Request", value: "New Request" },
    { label: "Quoted", value: "Quoted" },
    { label: "In Production", value: "In Production" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  // Filter and Search logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName = order.customerName || (order.user?.name) || "Unknown Customer";
      const customerPhone = order.customerPhone || (order.user?.phone) || "";
      const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            order.id.toString().includes(searchQuery) ||
                            customerPhone.includes(searchQuery);
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
      case "New Request": return "bg-amber-50 text-[#B87B14] border border-amber-300 font-bold rounded-md px-2.5 py-1";
      case "Quoted": return "bg-yellow-50 text-[#D9941E] border border-[#D9941E]/40 font-bold rounded-md px-2.5 py-1";
      case "In Production": return "bg-teal-50 text-teal-800 border border-teal-300 font-bold rounded-md px-2.5 py-1";
      case "Delivered": return "bg-emerald-50 text-[#106840] border border-emerald-300 font-bold rounded-md px-2.5 py-1";
      case "Cancelled": return "bg-rose-50 text-rose-700 border border-rose-300 font-bold rounded-md px-2.5 py-1";
      default: return "bg-gray-100 text-gray-700 border border-gray-300 font-bold rounded-md px-2.5 py-1";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#0D4B2D]">Custom Orders</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-[#D9941E] mt-1">Special client orders & quotes</p>
        </div>
        <Link 
          href="/dotadmin/customorders/add"
          className="bg-[#106840] text-white px-6 py-2 text-sm font-bold uppercase border-2 border-[#0D4B2D] shadow-[4px_4px_0px_0px_#0D4B2D] hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] transition-all rounded-md"
        >
          Add Custom Order
        </Link>
      </div>

      <div>
        <TableControls 
          searchQuery={searchQuery}
          setSearchQuery={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          statusOptions={statusOptions}
          searchPlaceholder="Search by customer, phone or ID..."
        />
        <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Request ID</TableHead>
                <TableHead>Customer / Phone</TableHead>
                <TableHead>Category / Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No custom orders found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">CUST-{order.id}</TableCell>
                    <TableCell>
                      <div>{order.customerName || order.user?.name || "Unknown Customer"}</div>
                      <div className="text-xs text-gray-500">{order.customerPhone || order.user?.phone || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <div>{order.category}</div>
                      <div className="text-xs text-gray-500">{order.item}</div>
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/dotadmin/customorders/${order.id}`}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/dotadmin/customorders/${order.id}`}
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
