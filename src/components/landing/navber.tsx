"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown, Search, User, X, Menu, ShoppingBag, Package } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { getAllProducts } from "@/api/productApi";

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const { items, openCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [apiProducts, setApiProducts] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    // Calculate total items in cart
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        setMounted(true);

        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }

        const fetchProducts = async () => {
            try {
                const res = await getAllProducts();
                if (res && res.data) {
                    setApiProducts(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch products for search", error);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = apiProducts
        .filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(product => {
            let imgUrl = product.thumbnail;
            if (!imgUrl && product.images) {
                if (Array.isArray(product.images) && product.images.length > 0) {
                    imgUrl = product.images[0];
                } else if (typeof product.images === 'string') {
                    try {
                        const parsed = JSON.parse(product.images);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            imgUrl = parsed[0];
                        }
                    } catch (e) {
                        // fallback
                    }
                }
            }
            if (imgUrl && !imgUrl.startsWith('http')) {
                imgUrl = `https://codegrid-api.vercel.app${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
            }
            return {
                id: product.id,
                title: product.title,
                image: imgUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop"
            };
        });

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            // Focus the input when modal opens
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            // Clear query when closed
            setSearchQuery("");
        }
    }, [isSearchOpen]);

    return (
        <div className="w-full flex flex-col font-sans sticky top-0 z-50">
            {/* Top Bar */}
            <div className="w-full bg-[#0D4B2D] text-white text-[13px] font-medium tracking-wide flex justify-between items-center px-4 py-2.5 sm:px-8 border-b border-[#146342]/40">
                <div className="text-white/95 text-[12px] sm:text-[13px] truncate max-w-[70%] flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#E5A83B] animate-pulse"></span>
                    <span>Welcome to Rooted Relish — Authentic Taste & Relish • Est. 2026</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-6 text-white/80">
                    <Link href="/main/ordertraking" className="text-[11px] sm:text-[13px] hover:text-[#E5A83B] transition-colors hidden sm:block uppercase tracking-wider font-semibold">
                        Track Order
                    </Link>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="w-full bg-white/95 backdrop-blur-md border-b-[1px] border-emerald-900/10 flex items-center justify-between px-4 sm:px-8 py-3.5 relative shadow-sm">
                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image
                            src="/logo.png"
                            alt="Rooted Relish Logo"
                            width={54}
                            height={54}
                            className="object-contain w-11 h-11 sm:w-13 sm:h-13 transition-transform group-hover:scale-105"
                            priority
                        />
                        <div className="flex flex-col">
                            <span className="text-lg sm:text-xl font-black tracking-tight text-[#106840] leading-none group-hover:text-[#0D4B2D] transition-colors">
                                ROOTED RELISH
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.24em] text-[#C58B24] uppercase mt-0.5">
                                EST. 2026
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="hidden lg:flex items-center space-x-8">
                    <Link
                        href="/main/big-sale"
                        className={`text-sm uppercase tracking-wider transition-colors ${pathname === '/main/big-sale'
                            ? 'text-[#106840] font-bold border-b-2 border-[#106840] pb-1'
                            : 'text-gray-700 hover:text-[#106840] font-semibold'
                            }`}
                    >
                        Big Sale
                    </Link>

                    <Link href="/main/budget-pick" className={`text-sm uppercase tracking-wider transition-colors ${pathname === '/main/budget-pick'
                        ? 'text-[#106840] font-bold border-b-2 border-[#106840] pb-1'
                        : 'text-gray-700 hover:text-[#106840] font-semibold'
                        }`}>
                        Budget Pick
                    </Link>

                    <Link href="/main/shop" className={`text-sm uppercase tracking-wider transition-colors ${pathname === '/main/shop'
                        ? 'text-[#106840] font-bold border-b-2 border-[#106840] pb-1'
                        : 'text-gray-700 hover:text-[#106840] font-semibold'
                        }`}>
                        Collections
                    </Link>

                    <Link href="/main/blogs" className={`text-sm uppercase tracking-wider transition-colors ${pathname === '/main/blogs'
                        ? 'text-[#106840] font-bold border-b-2 border-[#106840] pb-1'
                        : 'text-gray-700 hover:text-[#106840] font-semibold'
                        }`}>
                        Blogs
                    </Link>
                </div>

                {/* Right Icons */}
                <div className="flex items-center space-x-1 sm:space-x-3">
                    <Link href={user ? "/main/dashboard" : "/main/login"} className="p-2 text-gray-700 hover:text-[#106840] hover:bg-emerald-50/60 rounded-full transition-colors hidden sm:block">
                        <User className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Link>
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 text-gray-700 hover:text-[#106840] hover:bg-emerald-50/60 rounded-full transition-colors"
                    >
                        <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                        onClick={openCart}
                        className="p-2 relative text-gray-700 hover:text-[#106840] hover:bg-emerald-50/60 rounded-full transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                        {mounted && cartCount > 0 && (
                            <span className="absolute top-1 right-1 bg-[#106840] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-gray-700 hover:text-[#106840] hover:bg-emerald-50/60 rounded-full transition-colors lg:hidden"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* --- SEARCH MODAL (Collapses from Top) --- */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSearchOpen(false)}
            >
                {/* Search Panel */}
                <div
                    className={`absolute top-0 left-0 w-full bg-white border-b-[1px] border-gray-200 shadow-sm transition-transform duration-500 ease-out transform ${isSearchOpen ? 'translate-y-0' : '-translate-y-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-8">

                        {/* Search Input Area */}
                        <div className="flex items-center gap-4 border-[1px] border-emerald-900/20 rounded-lg p-2 bg-white focus-within:border-[#106840] focus-within:ring-2 focus-within:ring-[#106840]/20 transition-all mb-4">
                            <Search className="w-5 h-5 text-gray-400 ml-2" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search for products, categories..."
                                className="flex-1 bg-transparent text-lg sm:text-xl font-medium text-black focus:outline-none placeholder-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="text-gray-400 hover:text-black hover:bg-gray-100 p-1.5 rounded-md transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Search Results Area */}
                        <div className="mt-8 max-h-[60vh] overflow-y-auto hide-scrollbar">
                            {!searchQuery ? (
                                <div className="flex justify-center py-10 text-gray-400 text-sm font-medium">
                                    Start typing to see results...
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {filteredProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/main/product/${product.id}`}
                                            onClick={() => setIsSearchOpen(false)}
                                            className="group flex flex-col p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="relative aspect-square mb-3 overflow-hidden rounded-lg border-[1px] border-gray-100">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-2 leading-tight">
                                                {product.title}
                                            </h4>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center py-10 text-red-500 text-sm font-medium">
                                    No products found for "{searchQuery}"
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* --- MOBILE MENU (Side Drawer - Premium) --- */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div
                    className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] rounded-l-[24px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform overflow-hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col h-full bg-white">
                        <div className="flex justify-between items-center p-6 border-b-[1px] border-gray-100">
                            <span className="font-semibold text-lg text-gray-900 tracking-wide">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-400 hover:bg-gray-100 hover:text-black transition-colors rounded-full p-2"
                            >
                                <X className="w-5 h-5" strokeWidth={2} />
                            </button>
                        </div>
                        <div className="flex flex-col p-4 space-y-1 overflow-y-auto hide-scrollbar flex-1 mt-2">
                            {[
                                { name: "Big Sale", path: "/main/big-sale" },
                                { name: "Budget Pick", path: "/main/budget-pick" },
                                { name: "Collections", path: "/main/shop" },
                                { name: "Blogs", path: "/main/blogs" },
                                { name: "Account", path: user ? "/main/dashboard" : "/main/login" }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 ${pathname === item.path ? 'bg-emerald-50 text-[#106840] font-bold border-l-4 border-[#106840]' : 'text-gray-700 hover:bg-emerald-50/50 hover:text-[#106840] font-medium'}`}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        {item.name === "Account" && user && (
                                            <div className="w-7 h-7 rounded-full bg-emerald-100 overflow-hidden border border-emerald-300 flex-shrink-0 flex items-center justify-center">
                                                {user.image || user.profileImage || user.avatar ? (
                                                    <img src={user.image || user.profileImage || user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-4 h-4 text-[#106840]" />
                                                )}
                                            </div>
                                        )}
                                        {item.name === "Account" && !user && (
                                            <User className="w-5 h-5 text-[#106840]" />
                                        )}
                                        <span className="text-base">{item.name}</span>
                                    </div>
                                </Link>
                            ))}

                            <div className="px-4 pt-6 mt-4 border-t-[1px] border-gray-100 flex flex-col space-y-3">
                                <Link href="/main/ordertraking" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm transition-colors ${pathname === '/main/ordertraking' ? 'text-[#106840] font-bold' : 'text-gray-600 hover:text-[#106840] font-medium'}`}>Track Order</Link>
                                <Link href="/main/custom-order" onClick={() => setIsMobileMenuOpen(false)} className={`text-sm transition-colors ${pathname === '/main/custom-order' ? 'text-[#106840] font-bold' : 'text-gray-600 hover:text-[#106840] font-medium'}`}>Custom/Bulk Order</Link>
                            </div>
                        </div>

                        {/* Footer area of mobile menu */}
                        <div className="p-6 bg-emerald-50/30 border-t-[1px] border-emerald-900/10 mt-auto">
                            <Link href={user ? "/main/dashboard" : "/main/login"} onClick={() => setIsMobileMenuOpen(false)} className="bg-[#106840] text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#0D4B2D] transition-colors flex items-center justify-center gap-3 w-full py-3.5 shadow-md hover:shadow-lg">
                                <User className="w-4 h-4" /> {user ? "My Dashboard" : "Sign In / Register"}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODERN MOBILE BOTTOM NAVBAR --- */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-white/80 backdrop-blur-xl border-[1px] border-white/40 rounded-2xl z-[90] flex items-center justify-between px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                {/* Home */}
                <Link href="/" className={`flex flex-col items-center justify-center w-[60px] h-12 rounded-xl transition-all ${pathname === '/' ? 'bg-black/5 text-black' : 'text-gray-500 hover:text-black'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={pathname === '/' ? 'scale-110 transition-transform' : ''}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    <span className="text-[9px] font-bold tracking-wide mt-1">Home</span>
                </Link>

                {/* Shop */}
                <Link href="/main/shop" className={`flex flex-col items-center justify-center w-[60px] h-12 rounded-xl transition-all ${pathname === '/main/shop' ? 'bg-black/5 text-black' : 'text-gray-500 hover:text-black'}`}>
                    <Search className={`w-5 h-5 ${pathname === '/main/shop' ? 'scale-110 transition-transform stroke-[2.5px]' : 'stroke-2'}`} />
                    <span className="text-[9px] font-bold tracking-wide mt-1">Shop</span>
                </Link>

                {/* Track Order */}
                <Link href="/main/ordertraking" className={`flex flex-col items-center justify-center w-[60px] h-12 rounded-xl transition-all ${pathname === '/main/ordertraking' ? 'bg-black/5 text-black' : 'text-gray-500 hover:text-black'}`}>
                    <Package className={`w-5 h-5 ${pathname === '/main/ordertraking' ? 'scale-110 transition-transform stroke-[2.5px]' : 'stroke-2'}`} />
                    <span className="text-[9px] font-bold tracking-wide mt-1">Track</span>
                </Link>

                {/* Cart */}
                <button onClick={openCart} className="flex flex-col items-center justify-center w-[60px] h-12 rounded-xl text-gray-500 hover:text-black transition-all">
                    <div className="relative">
                        <ShoppingBag className="w-5 h-5 stroke-2" />
                        {mounted && cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[9px] font-bold tracking-wide mt-1">Cart</span>
                </button>

                {/* Account */}
                <Link href={user ? "/main/dashboard" : "/main/login"} className={`flex flex-col items-center justify-center w-[60px] h-12 rounded-xl transition-all ${pathname.includes('/main/dashboard') || pathname.includes('/main/login') ? 'bg-black/5 text-black' : 'text-gray-500 hover:text-black'}`}>
                    <User className={`w-5 h-5 ${pathname.includes('/main/dashboard') || pathname.includes('/main/login') ? 'scale-110 transition-transform stroke-[2.5px]' : 'stroke-2'}`} />
                    <span className="text-[9px] font-bold tracking-wide mt-1">Account</span>
                </Link>
            </div>

        </div>
    );
}
