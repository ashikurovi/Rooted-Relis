"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { deleteBudgetPick, getAllBudgetPicks } from "@/api/buget-pickApi";


export default function BudgetPickManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [budgetProducts, setBudgetProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await getAllBudgetPicks();
      setBudgetProducts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch budget picks", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this budget pick package?")) {
      try {
        await deleteBudgetPick(id);
        alert("Deleted successfully");
        fetchProducts();
      } catch (error) {
        console.error("Failed to delete", error);
        alert("Failed to delete product");
      }
    }
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  // Filter and Search logic
  const filteredProducts = useMemo(() => {
    return budgetProducts.filter((product) => {
      const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#0D4B2D]">Budget Pick Management</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-[#D9941E] mt-1">Special combo & budget packages</p>
        </div>
        <Link
          href="/dotadmin/budget-pick/add"
          className="bg-[#106840] text-white px-6 py-2 text-sm font-bold uppercase border-2 border-[#0D4B2D] shadow-[4px_4px_0px_0px_#0D4B2D] hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] transition-all rounded-md"
        >
          Add Budget Pick Package
        </Link>
      </div>

      <div>
        <TableControls
          searchQuery={searchQuery}
          setSearchQuery={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          statusOptions={statusOptions}
          searchPlaceholder="Search budget packages..."
        />
        <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Package Name</TableHead>
                <TableHead>Original Price</TableHead>
                <TableHead>Package Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No budget packages found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">BP-{product.id}</TableCell>
                    <TableCell>
                      <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell className="line-through text-gray-500">৳{product.originalPrice}</TableCell>
                    <TableCell className="font-bold text-[#106840]">৳{product.currentPrice}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${product.status === "Active" ? "bg-emerald-50 text-[#106840] border border-emerald-300" : "bg-rose-50 text-rose-700 border border-rose-300"}`}>
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dotadmin/budget-pick/${product.id}`}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dotadmin/budget-pick/${product.id}/edit`}
                          className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
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
