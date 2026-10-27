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
import { getAllSubCategories, createSubCategory, deleteSubCategory } from "@/api/sub-categoryApi";
import { getAllCategories } from "@/api/categoryApi";
import Select from "react-select";

export default function SubCategoryManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newSubCategory, setNewSubCategory] = useState({ name: "", description: "", parentCategoryId: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [subCatRes, catRes] = await Promise.all([
        getAllSubCategories(),
        getAllCategories()
      ]);
      
      if (subCatRes && Array.isArray(subCatRes.data)) {
        setSubCategories(subCatRes.data);
      } else if (Array.isArray(subCatRes)) {
        setSubCategories(subCatRes);
      } else {
        setSubCategories([]);
      }

      if (catRes && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
      } else if (Array.isArray(catRes)) {
        setCategories(catRes);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setSubCategories([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubCategory = async () => {
    try {
      setIsSaving(true);
      await createSubCategory({
        name: newSubCategory.name,
        description: newSubCategory.description,
        parentCategoryId: Number(newSubCategory.parentCategoryId)
      });
      setIsModalOpen(false);
      setNewSubCategory({ name: "", description: "", parentCategoryId: "" });
      fetchData();
    } catch (error) {
      console.error("Failed to create sub-category:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubCategory = async (id: number | string) => {
    if (confirm("Are you sure you want to delete this sub-category?")) {
      try {
        await deleteSubCategory(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete sub-category:", error);
      }
    }
  };

  // Filter and Search logic
  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((sub) => {
      const parentName = sub.parentCategory?.name || "";
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (sub.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [subCategories, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
  const paginatedSubCategories = filteredSubCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Sub-Category Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3b82f6] text-white px-6 py-2 text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
        >
          Add New Sub-Category
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-black hover:scale-110 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 className="text-2xl font-black uppercase border-b-4 border-black w-max pb-1 mb-6 text-black">Add New Sub-Category</h2>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-black uppercase text-black">Sub-Category Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={newSubCategory.name}
                  onChange={(e) => setNewSubCategory({...newSubCategory, name: e.target.value})}
                  placeholder="E.G. SMARTPHONES" 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="parent" className="text-sm font-black uppercase text-black">Parent Category</label>
                <Select 
                  id="parent" 
                  options={categories.map(cat => ({ value: String(cat.id), label: cat.name }))}
                  value={
                    newSubCategory.parentCategoryId 
                      ? { 
                          value: newSubCategory.parentCategoryId, 
                          label: categories.find(c => String(c.id) === newSubCategory.parentCategoryId)?.name || "" 
                        } 
                      : null
                  }
                  onChange={(selectedOption: any) => setNewSubCategory({...newSubCategory, parentCategoryId: selectedOption ? selectedOption.value : ""})}
                  placeholder="SELECT A PARENT CATEGORY"
                  isClearable
                  className="text-sm text-gray-900 font-bold"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: '3px solid black',
                      borderRadius: '0px',
                      boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                      minHeight: '42px',
                    })
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-black uppercase text-black">Description</label>
                <textarea 
                  id="description" 
                  rows={3}
                  value={newSubCategory.description}
                  onChange={(e) => setNewSubCategory({...newSubCategory, description: e.target.value})}
                  placeholder="SUB-CATEGORY DESCRIPTION..." 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black resize-none uppercase" 
                />
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="border-2 border-[#0D4B2D]/40 bg-[#FDFBF7] px-6 py-2 text-sm font-extrabold uppercase text-[#0D4B2D] shadow-[4px_4px_0px_0px_rgba(13,75,45,0.2)] transition-all hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400 hover:shadow-[5px_5px_0px_0px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleCreateSubCategory}
                  disabled={isSaving || !newSubCategory.name || !newSubCategory.parentCategoryId}
                  className="bg-[#106840] text-white px-6 py-2 text-sm font-extrabold uppercase border-2 border-[#0D4B2D] shadow-[4px_4px_0px_0px_#0D4B2D] hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all rounded-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? "SAVING..." : "SAVE SUB-CATEGORY"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        <TableControls 
          searchQuery={searchQuery}
          setSearchQuery={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          statusFilter="All"
          setStatusFilter={() => {}}
          statusOptions={[{label: "All Status", value: "All"}]}
          searchPlaceholder="Search sub-categories..."
        />
        <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">SL</TableHead>
                <TableHead>Sub-Category Name</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    Loading sub-categories...
                  </TableCell>
                </TableRow>
              ) : paginatedSubCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No sub-categories found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSubCategories.map((sub, index) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell>{sub.name}</TableCell>
                    <TableCell>{sub.parentCategory?.name || "-"}</TableCell>
                    <TableCell>{sub.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/dotadmin/subcategory/${sub.id}`}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/dotadmin/subcategory/${sub.id}`}
                          className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          type="button"
                          onClick={() => handleDeleteSubCategory(sub.id)}
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
