"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserById, updateUser, banUser } from "@/api/userApi";
import { BASE_URL } from "@/api/baseApi";
import { GlobalLoader } from "@/components/ui/global-loader";
import { SimpleSelect } from "@/components/ui/simple-select";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [status, setStatus] = useState("Active");
  const [pictureUrl, setPictureUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(userId);
        if (res.data) {
          setName(res.data.name);
          setEmail(res.data.email);
          setRole(res.data.role || "customer");
          setStatus(res.data.isBanned ? "Inactive" : "Active");
          setPictureUrl(res.data.picture || "");
        }
      } catch (err) {
        console.error("Failed to fetch user details", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update general info with FormData if file is selected, else json
      let updatePayload: any;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("role", role);
        formData.append("picture", selectedFile);
        updatePayload = formData;
      } else {
        updatePayload = { name, email, role };
      }
      
      await updateUser(userId, updatePayload);
      
      // 2. Update banned status
      await banUser(userId, status === "Inactive");

      router.push("/dotadmin/usermanagement");
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Failed to update user. See console for details.");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <GlobalLoader />}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
        <Link href="/dotadmin/usermanagement" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">User Details: USR-{userId}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <h2 className="text-xl font-semibold mb-6">Edit User Information</h2>
          <form onSubmit={handleSaveChanges} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase text-black">Profile Picture</label>
              <div className="flex items-center gap-4">
                {selectedFile ? (
                  <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-16 h-16 rounded-full object-cover border" />
                ) : pictureUrl ? (
                  <img src={pictureUrl.startsWith('http') ? pictureUrl : `${BASE_URL}${pictureUrl}`} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 border">No Pic</div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="text-sm" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-black uppercase text-black">Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-black uppercase text-black">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="role" className="text-sm font-black uppercase text-black">Role</label>
                <SimpleSelect 
                  id="role" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={[
                    { label: "Admin", value: "admin" },
                    { label: "Manager", value: "manager" },
                    { label: "Customer", value: "customer" }
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="status" className="text-sm font-black uppercase text-black">Status</label>
                <SimpleSelect 
                  id="status" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" }
                  ]}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                type="submit"
                className="bg-[#3b82f6] text-white px-6 py-2 text-sm font-black uppercase border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800 flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="flex flex-col gap-4">
            <div className="border-b pb-4 dark:border-gray-800">
              <p className="text-sm font-black uppercase text-black">Account created</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Activity logs coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
