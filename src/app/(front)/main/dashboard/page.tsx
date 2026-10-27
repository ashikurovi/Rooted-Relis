"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/api/baseApi";
import { useRouter } from "next/navigation";
import { User, Package, Settings, LogOut, CheckCircle, Clock, Truck } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      if (data.statusCode === 200) {
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
    try {
      const res = await fetchApi(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.statusCode === 200) {
        toast.success("Profile updated successfully!");
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Update profile error", error);
      toast.error("An error occurred.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/main/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col items-center">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User size={32} className="text-gray-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            
            <div className="p-3">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "orders" 
                    ? "bg-black text-white" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Package size={18} />
                Order History
              </button>
              
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mt-1 ${
                  activeTab === "settings" 
                    ? "bg-black text-white" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Settings size={18} />
                Account Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "orders" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6">Order History</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                  <p className="text-gray-500">When you place orders, they will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-100 rounded-lg p-5 hover:border-gray-200 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-700">CG-{String(order.id).padStart(4, '0')}</p>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`CG-${String(order.id).padStart(4, '0')}`);
                                toast.success("Order ID copied!");
                              }}
                              className="text-gray-400 hover:text-black transition-colors"
                              title="Copy Order ID"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </button>
                          </div>
                          <p className="font-medium">৳{order.totalAmount}</p>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium border
                          ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                            order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                        >
                          {order.status === 'Delivered' && <CheckCircle size={14} />}
                          {order.status === 'Processing' && <Truck size={14} />}
                          {order.status === 'Pending' && <Clock size={14} />}
                          {order.status}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-md p-4">
                        <p className="text-sm font-medium mb-3">Items:</p>
                        <ul className="space-y-2">
                          {order.items?.map((item: any) => (
                            <li key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-600 line-clamp-1">{item.product?.title || 'Unknown Product'} x{item.quantity}</span>
                              {/* <span className="text-gray-900 font-medium whitespace-nowrap ml-4">৳{item.price}</span> */}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    value={formData.deliveryaddress}
                    onChange={(e) => setFormData({ ...formData, deliveryaddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Division
                  </label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-colors w-full sm:w-auto"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
