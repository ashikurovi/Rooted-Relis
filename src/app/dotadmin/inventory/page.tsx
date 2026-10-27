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
import { createInventory, deleteInventory, getAllInventory } from "@/api/inventoryApi";
import { getAllProducts } from "@/api/productApi";

export default function InventoryManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal form state
  const [newProduct, setNewProduct] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newStatus, setNewStatus] = useState("In Stock");

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setAvailableProducts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await getAllInventory();
      const items = Array.isArray(res) ? res : (res.data || []);
      setInventoryItems(items);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newProduct || !newSku || !newStock) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      await createInventory({
        product: newProduct,
        sku: newSku,
        stock: Number(newStock),
        status: newStatus
      });
      setIsModalOpen(false);
      setNewProduct("");
      setNewSku("");
      setNewStock("");
      setNewStatus("In Stock");
      fetchInventory();
    } catch (error) {
      console.error("Failed to create inventory record", error);
      alert("Failed to create record.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this inventory record?")) {
      try {
        await deleteInventory(id);
        setInventoryItems(inventoryItems.filter((i) => i.id !== id));
      } catch (error) {
        console.error("Failed to delete record", error);
      }
    }
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "In Stock", value: "In Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Out of Stock", value: "Out of Stock" },
  ];

  // Filter and Search logic
  const filteredInventory = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [inventoryItems, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Inventory Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3b82f6] text-white px-6 py-2 text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
        >
          Add Inventory Record
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
            <h2 className="text-2xl font-black uppercase border-b-4 border-black w-max pb-1 mb-6 text-black">Update Inventory</h2>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="product" className="text-sm font-black uppercase text-black">Product</label>
                <select
                  id="product"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="">SELECT A PRODUCT</option>
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.title || p.name}>{p.title || p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="sku" className="text-sm font-black uppercase text-black">SKU</label>
                <input
                  type="text"
                  id="sku"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  placeholder="E.G. SKU-1234"
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="stock" className="text-sm font-black uppercase text-black">Initial Stock</label>
                <input
                  type="number"
                  id="stock"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="E.G. 50"
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="status" className="text-sm font-black uppercase text-black">Status</label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="In Stock">IN STOCK</option>
                  <option value="Low Stock">LOW STOCK</option>
                  <option value="Out of Stock">OUT OF STOCK</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border-2 border-black bg-white px-6 py-2 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all text-black rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="bg-[#3b82f6] text-white px-6 py-2 text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
                >
                  Save Record
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
          statusFilter={statusFilter}
          setStatusFilter={(val) => { setStatusFilter(val); setCurrentPage(1); }}
          statusOptions={statusOptions}
          searchPlaceholder="Search inventory..."
        />
        <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    Loading inventory records...
                  </TableCell>
                </TableRow>
              ) : paginatedInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No inventory records found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">INV-{item.id}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md 
                        ${item.status === "In Stock" ? "bg-emerald-50 text-[#106840] border border-emerald-300" : ""}
                        ${item.status === "Low Stock" ? "bg-amber-50 text-[#B87B14] border border-amber-300" : ""}
                        ${item.status === "Out of Stock" ? "bg-rose-50 text-rose-700 border border-rose-300" : ""}
                      `}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dotadmin/inventory/${item.id}`}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dotadmin/inventory/${item.id}`}
                          className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
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
