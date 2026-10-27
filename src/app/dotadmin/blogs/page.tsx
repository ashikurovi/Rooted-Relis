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
import { Edit, Trash2, Plus } from "lucide-react";
import { getAllBlogs, deleteBlog } from "@/api/blogApi";

export default function BlogManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Published", value: "Published" },
    { label: "Draft", value: "Draft" },
  ];

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = (blog.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (blog.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || blog.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black">Blog Management</h1>
          <p className="text-black font-bold uppercase mt-1">Manage articles and content for the store's blog.</p>
        </div>
        <Link 
          href="/dotadmin/blogs/add"
          className="flex items-center gap-2 bg-[#3b82f6] text-white px-6 py-2 text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
        >
          <Plus className="w-4 h-4" /> Add Blog
        </Link>
      </div>

      <div>
        <TableControls 
          searchQuery={searchQuery}
          setSearchQuery={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          statusOptions={statusOptions}
          searchPlaceholder="Search by title or excerpt..."
        />
        <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Image</TableHead>
                <TableHead>Title & Excerpt</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500 font-bold uppercase">
                    Loading blogs...
                  </TableCell>
                </TableRow>
              ) : paginatedBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No blogs found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="w-20 h-14 relative overflow-hidden bg-gray-100 rounded-sm border-2 border-black">
                        {blog.image ? (
                          <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-xs font-bold text-gray-400">NO IMG</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="font-bold text-gray-900 dark:text-gray-100 truncate">{blog.title}</div>
                      <div className="text-sm text-gray-500 truncate">{blog.excerpt}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {blog.date ? new Date(blog.date).toLocaleDateString() : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${blog.status === "Published" ? "bg-emerald-50 text-[#106840] border border-emerald-300" : "bg-amber-50 text-[#B87B14] border border-amber-300"}`}>
                        {blog.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/dotadmin/blogs/${blog.id}`}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="View/Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog.id)}
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
