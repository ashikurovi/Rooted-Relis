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
} from "@/components/ui/table";
import { TablePagination } from "@/components/admin/table-pagination";
import { Edit, Trash2, Plus, Search, ChevronsUpDown } from "lucide-react";
import { getAllBlogs, deleteBlog } from "@/api/blogApi";

export default function BlogManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortField, setSortField] = useState<string>("sl");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    setLoading(true);
    getAllBlogs()
      .then((res) => {
        if (res.data) setBlogs(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        loadBlogs();
      } catch (err) {
        console.error("Failed to delete blog", err);
      }
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatPublishedDate = (dateVal: any) => {
    if (!dateVal) return "-";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "-";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mon = months[d.getMonth()];
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${mon} ${day}, ${year} ${hours}:${mins}`;
  };

  const filteredAndSortedBlogs = useMemo(() => {
    let result = blogs.filter((blog) => {
      const q = searchQuery.toLowerCase();
      const title = (blog.title || "").toLowerCase();
      const category = (blog.category || "Latest News").toLowerCase();
      const status = (blog.status || "Draft").toLowerCase();
      return title.includes(q) || category.includes(q) || status.includes(q);
    });

    result = [...result].sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";

      if (sortField === "published" || sortField === "date") {
        valA = new Date(a.date || a.createdAt || 0).getTime();
        valB = new Date(b.date || b.createdAt || 0).getTime();
      } else if (sortField === "category") {
        valA = a.category || "Latest News";
        valB = b.category || "Latest News";
      } else if (sortField === "sl") {
        valA = a.id;
        valB = b.id;
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [blogs, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedBlogs.length / itemsPerPage) || 1;
  const paginatedBlogs = filteredAndSortedBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isAllSelected =
    paginatedBlogs.length > 0 &&
    paginatedBlogs.every((blog) => selectedIds.includes(blog.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedBlogs.map((b) => b.id));
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-[1400px] mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage articles and content for the store's blog.</p>
        </div>
        <Link 
          href="/dotadmin/blogs/add"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-black transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Blog
        </Link>
      </div>

      {/* Search Bar matching screenshot */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search blogs..."
          className="w-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-normal text-gray-800 placeholder-gray-400 rounded-xl focus:border-gray-300 focus:outline-none transition-all shadow-2xs" 
        />
      </div>

      {/* Main Table Card matching screenshot */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-[#fcfdfd] border-b border-gray-100">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                {/* Select All Checkbox */}
                <TableHead className="w-12 px-6 py-4">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-0 cursor-pointer accent-gray-900"
                  />
                </TableHead>

                {/* SL Header */}
                <TableHead className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("sl")}
                    className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 group"
                  >
                    <span>SL</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
                  </button>
                </TableHead>

                {/* TITLE Header */}
                <TableHead className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("title")}
                    className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 group"
                  >
                    <span>TITLE</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
                  </button>
                </TableHead>

                {/* CATEGORY Header */}
                <TableHead className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("category")}
                    className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 group"
                  >
                    <span>CATEGORY</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
                  </button>
                </TableHead>

                {/* STATUS Header */}
                <TableHead className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("status")}
                    className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 group"
                  >
                    <span>STATUS</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
                  </button>
                </TableHead>

                {/* PUBLISHED Header */}
                <TableHead className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleSort("published")}
                    className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-gray-600 hover:text-gray-900 group"
                  >
                    <span>PUBLISHED</span>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
                  </button>
                </TableHead>

                {/* Actions Header */}
                <TableHead className="px-6 py-4 text-right">
                  <span className="font-bold text-xs uppercase tracking-wider text-gray-600">
                    ACTIONS
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-400 font-medium">
                    Loading blogs...
                  </TableCell>
                </TableRow>
              ) : paginatedBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-400 font-medium">
                    No blogs found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBlogs.map((blog, idx) => {
                  const sl = (currentPage - 1) * itemsPerPage + idx + 1;
                  const isPublished = blog.status === "Published" || !blog.status;
                  const categoryName = blog.category || "Latest News";
                  const publishedDate = formatPublishedDate(blog.date || blog.createdAt);
                  const isSelected = selectedIds.includes(blog.id);

                  return (
                    <TableRow
                      key={blog.id}
                      className={`border-b border-gray-100 transition-colors hover:bg-gray-50/60 ${
                        isSelected ? "bg-gray-50/70" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <TableCell className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(blog.id)}
                          className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-0 cursor-pointer accent-gray-900"
                        />
                      </TableCell>

                      {/* SL */}
                      <TableCell className="px-6 py-4 font-normal text-gray-800 text-sm">
                        {sl}
                      </TableCell>

                      {/* TITLE */}
                      <TableCell className="px-6 py-4 font-normal text-gray-900 text-sm max-w-md">
                        <div className="truncate" title={blog.title}>
                          {blog.title}
                        </div>
                      </TableCell>

                      {/* CATEGORY */}
                      <TableCell className="px-6 py-4 font-normal text-gray-800 text-sm whitespace-nowrap">
                        {categoryName}
                      </TableCell>

                      {/* STATUS Badge */}
                      <TableCell className="px-6 py-4">
                        {isPublished ? (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-[#e6f7ed] text-[#12a150]">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {blog.status || "Draft"}
                          </span>
                        )}
                      </TableCell>

                      {/* PUBLISHED Date */}
                      <TableCell className="px-6 py-4 font-normal text-gray-800 text-sm whitespace-nowrap">
                        {publishedDate}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/dotadmin/blogs/${blog.id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Blog"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(blog.id)}
                            type="button"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Blog"
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

        {/* Pagination inside card matching screenshot */}
        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAndSortedBlogs.length}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
          itemsPerPageOptions={[5, 10, 20, 50]}
        />
      </div>
    </div>
  );
}
