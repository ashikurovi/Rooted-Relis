"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Users, Tags, CornerDownRight, Bookmark,
    ShoppingCart, Warehouse, ClipboardList, Wrench, AlertCircle,
    BarChart, SettingsIcon, ImageIcon, PenTool, MessageSquareHeart, Calculator, Box, Zap, PiggyBank, Ruler, Shirt, LogOut, Percent, Search
} from "lucide-react";
import { logoutUser } from "../../api/authApi";

const navGroups = [
  {
    title: "Overview",
    links: [
      { name: "Dashboard", href: "/dotadmin", icon: LayoutDashboard },
      { name: "Analytics", href: "/dotadmin/analytics", icon: BarChart },
    ]
  },
  {
    title: "Catalog",
    links: [
      { name: "Products", href: "/dotadmin/products", icon: ShoppingCart },
      { name: "Custom Products", href: "/dotadmin/custom-products", icon: Box },
      { name: "Category", href: "/dotadmin/category", icon: Tags },
      { name: "Sub-Category", href: "/dotadmin/subcategory", icon: CornerDownRight },
      { name: "Brands", href: "/dotadmin/bands", icon: Bookmark },
      { name: "Sizes", href: "/dotadmin/sizes", icon: Ruler },
      { name: "Product Types", href: "/dotadmin/types", icon: Shirt },
      { name: "Flash Sale", href: "/dotadmin/big-sell", icon: Zap },
      { name: "Budget Pick", href: "/dotadmin/budget-pick", icon: PiggyBank },
    ]
  },
  {
    title: "Sales & Orders",
    links: [
      { name: "Orders", href: "/dotadmin/orders", icon: ClipboardList },
      { name: "Custom Orders", href: "/dotadmin/customorders", icon: Wrench },
      { name: "Incomplete Orders", href: "/dotadmin/incompeletorders", icon: AlertCircle },
    ]
  },
  {
    title: "Marketing & Content",
    links: [
      { name: "Campaigns", href: "/dotadmin/campaign", icon: ImageIcon },
      { name: "Banners", href: "/dotadmin/banner", icon: ImageIcon },
      { name: "Blogs", href: "/dotadmin/blogs", icon: PenTool },
      { name: "Customer Feedback", href: "/dotadmin/customer-feedback", icon: MessageSquareHeart },
    ]
  },
  {
    title: "System & Tools",
    links: [
      { name: "Coupons", href: "/dotadmin/coupons", icon: Percent },
      { name: "Costing", href: "/dotadmin/costing", icon: Calculator },
      { name: "Inventory", href: "/dotadmin/inventory", icon: Warehouse },
      { name: "Calculator", href: "/dotadmin/calculation", icon: Calculator },
      { name: "Users", href: "/dotadmin/usermanagement", icon: Users },
      { name: "Settings", href: "/dotadmin/setting", icon: SettingsIcon },
    ]
  }
];

export default function Sideber() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    const filteredGroups = navGroups
        .map((group) => ({
            ...group,
            links: group.links.filter((link) =>
                link.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
            ),
        }))
        .filter((group) => group.links.length > 0 || !searchTerm.trim());

    const handleLogout = () => {
        logoutUser();
        window.location.href = "/main/login";
    };

    return (
        <div className="hidden w-[260px] flex-shrink-0 bg-[#0A261A] text-white lg:block border-r border-[#146342]/30">
            <div className="flex h-full max-h-screen flex-col">
                {/* Header */}
                <div className="flex h-[76px] items-center border-b border-white/10 px-5 bg-[#071c13]/60">
                    <Link href="/dotadmin" className="flex items-center gap-3 tracking-tight group">
                        <img src="/logo.png" alt="Rooted Relish" className="w-10 h-10 object-contain drop-shadow" />
                        <div className="flex flex-col">
                            <span className="text-sm font-black uppercase text-white tracking-wide leading-none group-hover:text-[#E5A83B] transition-colors">
                                ROOTED RELISH
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#E5A83B] mt-1">
                                ADMIN PANEL
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="px-3 pt-3">
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-300 focus-within:border-[#D9941E] focus-within:bg-white/10 transition-colors">
                        <Search className="h-4 w-4 text-emerald-400/60" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search menu..."
                            className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
                        />
                    </div>
                </div>
                
                {/* Scrollable Nav Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 hide-scrollbar">
                    <div className="flex flex-col gap-7">
                        {filteredGroups.length === 0 ? (
                            <div className="px-3 py-5 text-sm text-slate-400">
                                No menu found for "{searchTerm}"
                            </div>
                        ) : (
                            filteredGroups.map((group, idx) => (
                                <div key={idx} className="flex flex-col gap-2">
                                    <h4 className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/70">
                                        {group.title}
                                    </h4>
                                    <nav className="grid gap-1.5">
                                        {group.links.map((link) => {
                                            const isActive = pathname === link.href || (link.href !== "/dotadmin" && pathname.startsWith(link.href));
                                            const Icon = link.icon;
                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                                        isActive
                                                            ? "bg-[#106840] text-white shadow-md shadow-black/20 border-l-4 border-[#D9941E] font-bold"
                                                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                                                    }`}
                                                >
                                                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#E5A83B]' : 'text-slate-400'}`} />
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                
                {/* Footer User Area */}
                <div className="border-t border-white/10 p-4 bg-[#071c13]/50">
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-white/10 px-3 py-2">
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#106840] to-[#D9941E] text-xs font-bold text-white shadow-sm ring-1 ring-white/20">
                                {user?.picture ? (
                                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name ? user.name.charAt(0).toUpperCase() : 'R'
                                )}
                            </div>
                            <div className="flex flex-col truncate max-w-[120px]">
                                <span className="truncate text-sm font-semibold uppercase text-white">{user?.name || "Admin User"}</span>
                                <span className="truncate text-[10px] text-slate-400">{user?.email || "admin@rootedrelish.com"}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="shrink-0 p-2 text-slate-300 transition-colors hover:text-[#E5A83B]"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4 font-black" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
