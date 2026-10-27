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
import { Eye, Edit, Trash2, User as UserIcon, Ban, CheckCircle } from "lucide-react";
import { getAllUsers, createUser, deleteUser, banUser } from "@/api/userApi";
import { BASE_URL } from "@/api/baseApi";
import { GlobalLoader } from "@/components/ui/global-loader";
import { SimpleSelect } from "@/components/ui/simple-select";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function UserManagementPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [userToToggleBan, setUserToToggleBan] = useState<{id: number, isBanned: boolean} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<any[]>([]);
  const itemsPerPage = 5;

  // New user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("customer");
  const [newPassword, setNewPassword] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getAllUsers();
      if (res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUser({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });
      setIsModalOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("customer");
      await fetchUsers();
    } catch (err) {
      console.error("Failed to create user", err);
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (userToDelete !== null) {
      setIsLoading(true);
      try {
        await deleteUser(userToDelete);
        await fetchUsers();
      } catch (err) {
        console.error("Failed to delete user", err);
        setIsLoading(false);
      } finally {
        setUserToDelete(null);
      }
    }
  };

  const confirmToggleBan = async () => {
    if (userToToggleBan) {
      setIsLoading(true);
      try {
        await banUser(userToToggleBan.id, !userToToggleBan.isBanned);
        await fetchUsers();
      } catch (err) {
        console.error("Failed to toggle ban status", err);
      } finally {
        setIsLoading(false);
        setUserToToggleBan(null);
      }
    }
  };

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  // Filter and Search logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const userStatus = user.isBanned ? "Inactive" : "Active";
      const matchesStatus = statusFilter === "All" || userStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {isLoading && <GlobalLoader />}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">User Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3b82f6] text-white px-6 py-2 text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
        >
          Add New User
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
            <h2 className="text-2xl font-black uppercase border-b-4 border-black w-max pb-1 mb-6 text-black">Add New User</h2>
            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-black uppercase text-black">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="JOHN DOE" 
                  required
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-black uppercase text-black">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="JOHN@EXAMPLE.COM" 
                  required
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-black uppercase text-black">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="SECRET PASSWORD" 
                  required
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="role" className="text-sm font-black uppercase text-black">Role</label>
                <SimpleSelect 
                  id="role" 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  options={[
                    { label: "Customer", value: "customer" },
                    { label: "Admin", value: "admin" },
                    { label: "Manager", value: "manager" }
                  ]}
                />
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
                  type="submit" 
                  className="bg-[#3b82f6] text-white px-6 py-2 text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
                >
                  Save User
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
          searchPlaceholder="Search users..."
        />
        <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">SL</TableHead>
                <TableHead>Picture</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => {
                  const isActive = !user.isBanned;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                      <TableCell>
                        {user.picture ? (
                          <img src={`${BASE_URL}${user.picture}`} alt={user.name} className="w-10 h-10 rounded-full object-cover border" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 border">
                            <UserIcon className="w-5 h-5" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium ${isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/dotadmin/usermanagement/${user.id}`}
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link 
                            href={`/dotadmin/usermanagement/${user.id}`}
                            className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            type="button"
                            onClick={() => setUserToToggleBan({ id: user.id, isBanned: user.isBanned })}
                            className={`p-1 transition-colors ${isActive ? "text-gray-500 hover:text-orange-500" : "text-gray-500 hover:text-green-500"}`}
                            title={isActive ? "Ban User" : "Unban User"}
                          >
                            {isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setUserToDelete(user.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
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
    
    <ConfirmModal 
      isOpen={userToDelete !== null}
      title="Delete User"
      message="Are you sure you want to delete this user? This action cannot be undone."
      confirmText="Delete"
      onConfirm={confirmDelete}
      onCancel={() => setUserToDelete(null)}
    />

    <ConfirmModal 
      isOpen={userToToggleBan !== null}
      title={userToToggleBan?.isBanned ? "Unban User" : "Ban User"}
      message={userToToggleBan?.isBanned 
        ? "Are you sure you want to unban this user? They will regain access to the platform." 
        : "Are you sure you want to ban this user? They will lose access to the platform."}
      confirmText={userToToggleBan?.isBanned ? "Unban" : "Ban"}
      onConfirm={confirmToggleBan}
      onCancel={() => setUserToToggleBan(null)}
    />
    </>
  );
}
