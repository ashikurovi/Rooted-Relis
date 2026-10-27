"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navber from "@/components/admin/navber";
import Sideber from "@/components/admin/sideber";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login page if no token is found
      router.push("/main/login"); 
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Prevent rendering the dashboard until authentication is verified
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#ffffff] bg-[linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:100%_32px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#106840]"></div>
      </div>
    );
  }

  return (
    <div className="admin-shell flex h-screen w-full font-sans">
      <Sideber />
      <div className="flex flex-col w-full overflow-hidden">
        <Navber />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
