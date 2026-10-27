"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { TableControls } from "@/components/admin/table-controls";
import { TablePagination } from "@/components/admin/table-pagination";
import { Edit, Trash2, Plus } from "lucide-react";
import { getAllCoupons, deleteCoupon } from "@/api/couponApi";

export default function CouponsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await getAllCoupons();
      setCoupons(res.data || []);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await deleteCoupon(id);
      fetchCoupons();
    } catch (error) {
      console.error("Failed to delete coupon", error);
    }
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch = (coupon.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (coupon.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || (coupon.isActive ? "Active" : "Inactive") === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredCoupons.length / cardsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage,
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">Coupon Management</h1>
          <p className="mt-1 text-black font-bold uppercase">Create and manage discount codes for checkout.</p>
        </div>
        <Link
          href="/dotadmin/coupons/add"
          className="flex items-center gap-2 bg-[#3b82f6] text-white px-6 py-2 text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
        >
          <Plus className="h-4 w-4" /> Add Coupon
        </Link>
      </div>

      <div>
        <TableControls
          searchQuery={searchQuery}
          setSearchQuery={(value) => { setSearchQuery(value); setCurrentPage(1); }}
          statusFilter={statusFilter}
          setStatusFilter={(value) => { setStatusFilter(value); setCurrentPage(1); }}
          statusOptions={statusOptions}
          searchPlaceholder="Search coupon code or description..."
        />

        <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500 font-bold uppercase">
                    Loading coupons...
                  </TableCell>
                </TableRow>
              ) : paginatedCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No coupons found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-black uppercase">{coupon.code}</TableCell>
                    <TableCell className="font-medium uppercase">
                      {coupon.discountType === "percentage" ? "Percentage" : "Fixed"}
                    </TableCell>
                    <TableCell className="font-bold">
                      {coupon.discountType === "percentage" ? `${coupon.value}%` : `৳${coupon.value}`}
                    </TableCell>
                    <TableCell>৳{Number(coupon.minOrderAmount || 0)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dotadmin/coupons/${coupon.id}`}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(coupon.id)}
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
