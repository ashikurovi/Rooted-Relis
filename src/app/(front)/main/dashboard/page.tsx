"use client";

import React, { useEffect, useState, useMemo } from "react";
import { fetchApi } from "@/api/baseApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  Settings,
  LogOut,
  CheckCircle,
  Clock,
  Truck,
  Search,
  Leaf,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Copy,
  Check,
  LayoutDashboard,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "settings">("overview");
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Search and filter for orders
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Edit Profile state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    deliveryaddress: "",
    division: "",
    city: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || "",
        phone: parsedUser.phone || "",
        deliveryaddress: parsedUser.deliveryaddress || "",
        division: parsedUser.division || "",
        city: parsedUser.city || "",
      });
      fetchOrders(parsedUser.id);
    } else {
      router.push("/main/login");
    }
  }, [router]);

  const fetchOrders = async (userId: number) => {
    try {
      const res = await fetchApi(`/orders/user/${userId}`);
      const data = await res.json();
      if (data.statusCode === 200 && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetchApi(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.statusCode === 200 || res.ok) {
        toast.success("Profile updated successfully!");
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update profile error", error);
      toast.error("An error occurred while updating profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    router.push("/main/login");
  };

  const copyOrderId = (orderId: number) => {
    const formatted = `CG-${String(orderId).padStart(4, "0")}`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(orderId);
    toast.success(`Copied ${formatted}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Stats calculation
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const formattedId = `CG-${String(order.id).padStart(4, "0")}`.toLowerCase();
      const rawId = String(order.id);
      const matchesSearch =
        formattedId.includes(orderSearchQuery.toLowerCase()) ||
        rawId.includes(orderSearchQuery.toLowerCase()) ||
        order.items?.some((i: any) =>
          (i.product?.title || "").toLowerCase().includes(orderSearchQuery.toLowerCase())
        );

      const matchesStatus =
        orderStatusFilter === "All" ||
        (orderStatusFilter === "Pending" && (order.status === "Pending" || order.status === "Processing")) ||
        order.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  const getUserInitials = (name?: string) => {
    if (!name) return "RR";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-[#fbfbf9]">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-[#106840]/20 border-t-[#106840] rounded-full animate-spin"></div>
          <Leaf className="w-6 h-6 text-[#106840] absolute animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcf9] pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#106840] via-[#0E5836] to-[#0A4128] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#106840]/15 mb-8">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 -mb-12 w-48 h-48 bg-[#D9941E]/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl sm:text-2xl font-bold tracking-wider shadow-inner">
                {getUserInitials(user?.name)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                    Welcome back, {user?.name?.split(" ")[0] || "Valued Customer"}!
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 bg-[#D9941E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Leaf size={10} /> Member
                  </span>
                </div>
                <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-lg">
                  Track your orders, view previous purchases, and manage your delivery details all in one place.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/main/shop"
                className="inline-flex items-center gap-2 bg-[#D9941E] hover:bg-[#c48214] text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md shadow-[#D9941E]/20"
              >
                <ShoppingBag size={16} />
                <span>Browse Shop</span>
              </Link>
              <Link
                href="/main/ordertraking"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all"
              >
                <Search size={16} />
                <span>Track Order</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100/90 shadow-sm overflow-hidden sticky top-24">
              {/* User Card */}
              <div className="p-6 border-b border-gray-100/80 bg-gradient-to-b from-[#106840]/5 to-transparent flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#106840] to-[#0A4128] text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#106840]/25 ring-4 ring-[#106840]/10 mb-3">
                  {getUserInitials(user?.name)}
                </div>
                <h3 className="font-bold text-gray-900 text-base">{user?.name || "Customer"}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                {user?.phone && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Phone size={12} /> {user.phone}
                  </p>
                )}
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#106840]/10 text-[#106840]">
                  <ShieldCheck size={13} />
                  <span>Verified Customer</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="p-3 space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === "overview"
                      ? "bg-[#106840] text-white shadow-md shadow-[#106840]/25"
                      : "text-gray-600 hover:text-[#106840] hover:bg-[#106840]/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={18} />
                    <span>Overview</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === "overview" ? "text-white/70" : "text-gray-400"} />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === "orders"
                      ? "bg-[#106840] text-white shadow-md shadow-[#106840]/25"
                      : "text-gray-600 hover:text-[#106840] hover:bg-[#106840]/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package size={18} />
                    <span>My Orders</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === "orders" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {totalOrders}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === "settings"
                      ? "bg-[#106840] text-white shadow-md shadow-[#106840]/25"
                      : "text-gray-600 hover:text-[#106840] hover:bg-[#106840]/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} />
                    <span>Account Settings</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === "settings" ? "text-white/70" : "text-gray-400"} />
                </button>

                <div className="pt-2 my-2 border-t border-gray-100">
                  <Link
                    href="/main/ordertraking"
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-[#106840] hover:bg-[#106840]/5 transition-all"
                  >
                    <Truck size={18} />
                    <span>Live Order Tracker</span>
                    <ExternalLink size={14} className="ml-auto text-gray-400" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all mt-1"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Total Orders */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100/90 shadow-2xs hover:border-[#106840]/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-[#106840]/10 flex items-center justify-center text-[#106840] mb-3">
                      <Package size={20} />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</p>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{totalOrders}</h3>
                  </div>

                  {/* Pending Orders */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100/90 shadow-2xs hover:border-[#D9941E]/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-[#D9941E]/10 flex items-center justify-center text-[#D9941E] mb-3">
                      <Clock size={20} />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">In Progress</p>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{pendingOrders}</h3>
                  </div>

                  {/* Delivered Orders */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100/90 shadow-2xs hover:border-emerald-500/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                      <CheckCircle size={20} />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivered</p>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{deliveredOrders}</h3>
                  </div>

                  {/* Total Spent */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100/90 shadow-2xs hover:border-[#106840]/20 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#106840]/10 to-[#D9941E]/10 flex items-center justify-center text-[#106840] mb-3">
                      <Sparkles size={20} />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</p>
                    <h3 className="text-2xl font-extrabold text-[#106840] mt-1">৳{totalSpent.toLocaleString()}</h3>
                  </div>
                </div>

                {/* Quick Info & Recent Orders */}
                <div className="bg-white rounded-2xl border border-gray-100/90 shadow-2xs p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Your most recent purchases with Rooted Relish</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-bold text-[#106840] hover:text-[#0D4B2D] flex items-center gap-1 hover:underline"
                    >
                      View All Orders ({totalOrders}) <ChevronRight size={14} />
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
                      <Package size={40} className="mx-auto text-gray-300 mb-2" />
                      <h4 className="text-sm font-bold text-gray-800">No orders placed yet</h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                        Explore our handcrafted products and wholesome pantry staples to place your first order.
                      </p>
                      <Link
                        href="/main/shop"
                        className="mt-4 inline-flex items-center gap-2 bg-[#106840] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#0D4B2D] transition-colors"
                      >
                        <ShoppingBag size={14} /> Shop Now
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => {
                        const orderCode = `CG-${String(order.id).padStart(4, "0")}`;
                        return (
                          <div
                            key={order.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#106840]/30 hover:bg-[#106840]/[0.02] transition-all gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-xl bg-[#106840]/10 flex items-center justify-center text-[#106840] shrink-0 font-bold text-sm">
                                <Package size={20} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-gray-900">{orderCode}</span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                  {order.items?.length || 0} items •{" "}
                                  {order.items?.map((i: any) => i.product?.title || "Product").join(", ") ||
                                    "Handcrafted Goods"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                              <span className="text-sm font-bold text-gray-900">৳{order.totalAmount}</span>

                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                                  order.status === "Delivered"
                                    ? "bg-[#e6f7ed] text-[#12a150]"
                                    : order.status === "Processing"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-amber-50 text-[#B87B14]"
                                }`}
                              >
                                {order.status === "Delivered" && <CheckCircle size={12} />}
                                {order.status === "Processing" && <Truck size={12} />}
                                {order.status === "Pending" && <Clock size={12} />}
                                {order.status || "Pending"}
                              </span>

                              <Link
                                href={`/main/ordertraking?order=${orderCode}`}
                                className="p-2 text-gray-400 hover:text-[#106840] hover:bg-[#106840]/10 rounded-lg transition-colors"
                                title="Track this order"
                              >
                                <Truck size={16} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Account Details Quick View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-100/90 shadow-2xs p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#106840] font-bold text-sm mb-3">
                        <MapPin size={18} />
                        <span>Default Shipping Address</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        {formData.deliveryaddress || "No delivery address added yet."}
                      </p>
                      {(formData.city || formData.division) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {[formData.city, formData.division].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("settings")}
                      className="mt-4 text-xs font-bold text-[#106840] hover:text-[#0D4B2D] self-start flex items-center gap-1 hover:underline"
                    >
                      Update Address <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-[#106840]/10 via-[#106840]/5 to-transparent rounded-2xl border border-[#106840]/20 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#106840] font-bold text-sm mb-2">
                        <Leaf size={18} />
                        <span>Rooted Relish Guarantee</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        100% authentic, naturally sourced ingredients, freshly prepared with care. Need assistance with an
                        order? We are always here to help.
                      </p>
                    </div>
                    <Link
                      href="/main/refund-returns"
                      className="mt-4 text-xs font-bold text-[#106840] hover:text-[#0D4B2D] self-start flex items-center gap-1 hover:underline"
                    >
                      View Return & Refund Policy <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl border border-gray-100/90 shadow-2xs p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                    <p className="text-xs text-gray-500 mt-1">View details and live tracking for all your orders.</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl self-start sm:self-auto">
                    {["All", "Pending", "Delivered"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setOrderStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          orderStatusFilter === status
                            ? "bg-white text-[#106840] shadow-xs"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search orders */}
                <div className="relative mb-6">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by order ID (e.g. CG-0001) or product name..."
                    className="w-full bg-[#fbfbf9] border border-gray-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#106840] focus:ring-2 focus:ring-[#106840]/10 transition-all"
                  />
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 bg-[#fbfbf9]/60 rounded-2xl border border-dashed border-gray-200">
                    <Package size={52} className="mx-auto text-gray-300 mb-3" />
                    <h3 className="text-base font-bold text-gray-800 mb-1">
                      {orderSearchQuery ? "No matching orders found" : "No orders yet"}
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                      {orderSearchQuery
                        ? "Try clearing your search query or status filter to see other orders."
                        : "When you place orders, they will appear here with live tracking updates."}
                    </p>
                    <Link
                      href="/main/shop"
                      className="inline-flex items-center gap-2 bg-[#106840] hover:bg-[#0D4B2D] text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md shadow-[#106840]/20"
                    >
                      <ShoppingBag size={16} />
                      <span>Start Shopping</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => {
                      const orderCode = `CG-${String(order.id).padStart(4, "0")}`;
                      const isDelivered = order.status === "Delivered";
                      const isProcessing = order.status === "Processing";

                      return (
                        <div
                          key={order.id}
                          className="border border-gray-200/80 hover:border-[#106840]/40 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-sm bg-white"
                        >
                          {/* Order Card Top Bar */}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-gray-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-base text-gray-900 tracking-tight">
                                  {orderCode}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyOrderId(order.id)}
                                  className="text-gray-400 hover:text-[#106840] transition-colors p-1"
                                  title="Copy Order ID"
                                >
                                  {copiedId === order.id ? (
                                    <Check size={14} className="text-emerald-600" />
                                  ) : (
                                    <Copy size={14} />
                                  )}
                                </button>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Payment: <span className="font-semibold text-gray-700 capitalize">{order.paymentMethod || "Cash on Delivery"}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <span
                                className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold ${
                                  isDelivered
                                    ? "bg-[#e6f7ed] text-[#12a150]"
                                    : isProcessing
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-amber-50 text-[#B87B14]"
                                }`}
                              >
                                {isDelivered && <CheckCircle size={13} />}
                                {isProcessing && <Truck size={13} />}
                                {!isDelivered && !isProcessing && <Clock size={13} />}
                                <span>{order.status || "Pending"}</span>
                              </span>
                            </div>
                          </div>

                          {/* Items List */}
                          <div className="py-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                              Ordered Items ({order.items?.length || 0})
                            </p>
                            <div className="divide-y divide-gray-50">
                              {order.items?.map((item: any) => (
                                <div key={item.id} className="py-2.5 flex items-center justify-between gap-4 text-sm">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400 overflow-hidden border border-gray-100">
                                      {item.product?.thumbnail ? (
                                        <img
                                          src={item.product.thumbnail}
                                          alt={item.product?.title || "Product"}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <Leaf size={16} className="text-[#106840]" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-gray-900 truncate">
                                        {item.product?.title || "Handcrafted Product"}
                                      </p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                  </div>

                                  {item.product?.currentPrice && (
                                    <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">
                                      ৳{Number(item.product.currentPrice) * Number(item.quantity)}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Card Footer */}
                          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-[#fbfbf9]/60 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl">
                            <div>
                              <span className="text-xs text-gray-500">Total Amount:</span>
                              <span className="ml-2 font-extrabold text-base sm:text-lg text-[#106840]">
                                ৳{order.totalAmount}
                              </span>
                            </div>

                            <Link
                              href={`/main/ordertraking?order=${orderCode}`}
                              className="inline-flex items-center justify-center gap-2 bg-[#106840] hover:bg-[#0D4B2D] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
                            >
                              <Truck size={14} />
                              <span>Track Live Shipment</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl border border-gray-100/90 shadow-2xs p-6 md:p-8">
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage your personal profile and default shipping destination.
                  </p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                  {/* Readonly Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                      <ShieldCheck size={13} className="text-[#106840]" /> Verified account login email (cannot be modified).
                    </p>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#106840] focus:ring-2 focus:ring-[#106840]/15 transition-all shadow-2xs"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#106840] focus:ring-2 focus:ring-[#106840]/15 transition-all shadow-2xs"
                        placeholder="+880 1XXXXXXXXX"
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                      Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <textarea
                        value={formData.deliveryaddress}
                        onChange={(e) => setFormData({ ...formData, deliveryaddress: e.target.value })}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-white rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#106840] focus:ring-2 focus:ring-[#106840]/15 transition-all shadow-2xs"
                        placeholder="House / Road / Area details..."
                      />
                    </div>
                  </div>

                  {/* Division & City Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                        Division
                      </label>
                      <input
                        type="text"
                        value={formData.division}
                        onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#106840] focus:ring-2 focus:ring-[#106840]/15 transition-all shadow-2xs"
                        placeholder="e.g. Dhaka, Chittagong"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                        City / District
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#106840] focus:ring-2 focus:ring-[#106840]/15 transition-all shadow-2xs"
                        placeholder="e.g. Dhanmondi, Sylhet"
                      />
                    </div>
                  </div>

                  {/* Save Changes Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#106840] hover:bg-[#0D4B2D] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#106840]/25 hover:shadow-xl hover:shadow-[#106840]/35 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      {isSaving ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving Profile...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
