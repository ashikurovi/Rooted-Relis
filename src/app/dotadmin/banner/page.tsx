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
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { getAllBanners, deleteBanner } from "@/api/bannerApi";

export default function BannerManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    setLoading(true);
    getAllBanners()
      .then((res) => {
        if (res.data) setBanners(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(id);
        loadBanners();
      } catch (err) {
        console.error("Failed to delete banner", err);
      }
    }
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  // Filter and Search logic
  const filteredBanners = useMemo(() => {
    return banners.filter((banner) => {
      const matchesSearch = (banner.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (banner.subtitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (banner.tag || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || banner.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [banners, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const paginatedBanners = filteredBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#0D4B2D]">Banner Management</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-[#D9941E] mt-1">Manage the slides showing on the homepage banner</p>
        </div>
        <Link 
          href="/dotadmin/banner/add"
          className="flex items-center gap-2 bg-[#106840] text-white px-6 py-2 text-sm font-bold uppercase border-2 border-[#0D4B2D] shadow-[4px_4px_0px_0px_#0D4B2D] hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] transition-all rounded-md"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </Link>
      </div>

      <div>
        <TableControls 
          searchQuery={searchQuery}
          setSearchQuery={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          statusOptions={statusOptions}
          searchPlaceholder="Search by title, subtitle, or tag..."
        />
        <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Image</TableHead>
                <TableHead>Title & Subtitle</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500 font-bold uppercase">
                    Loading banners...
                  </TableCell>
                </TableRow>
              ) : paginatedBanners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No banners found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBanners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="w-20 h-12 relative overflow-hidden bg-gray-100 rounded-sm border-2 border-black">
                        {banner.image ? (
                          <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-xs font-bold text-gray-400">NO IMG</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-gray-900 dark:text-gray-100">{banner.title}</div>
                      <div className="text-xs text-gray-500 uppercase">{banner.subtitle}</div>
                    </TableCell>
                    <TableCell>
                      {banner.tag ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-600 rounded-sm dark:bg-gray-800 dark:text-gray-300">
                          {banner.tag}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-[#106840] font-bold hover:underline">
                      <a href={banner.link} target="_blank" rel="noreferrer">{banner.link}</a>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${banner.status === "Active" ? "bg-emerald-50 text-[#106840] border border-emerald-300" : "bg-rose-50 text-rose-700 border border-rose-300"}`}>
                        {banner.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/dotadmin/banner/${banner.id}`}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="View/Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(banner.id)}
                          type="button"
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
