"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { getFlashSells } from "@/api/flashsellApi";
import { getAllCategories } from "@/api/categoryApi";



export default function BigSalePage() {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { items, addToCart, updateQuantity, removeFromCart, openCart } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sales, catRes] = await Promise.all([
          getFlashSells(),
          getAllCategories()
        ]);

        // find active flash sale
        const activeSale = sales.find((s: any) => s.isActive) || sales[0];
        if (activeSale && activeSale.products) {
          setProducts(activeSale.products);
        } else {
          setProducts([]);
        }

        if (catRes && catRes.data) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImgUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `https://rooted-relis-f4g9.vercel.app${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Main Container */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Huge Title */}
        <div className="w-full py-6 md:py-10 mb-8 border-b border-emerald-950/10 text-center">
          <div className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-[#D9941E] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 mb-3">
            Limited Time Offers
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-center text-[#0D4B2D] uppercase tracking-tight">Flash Sale</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-xl mx-auto">
            Exclusive discounts on handcrafted relishes and artisan culinary treats.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-1/4 flex-shrink-0 space-y-10">
            {/* Search Box */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D4B2D] mb-3">
                SEARCH IN OUR SHOP
              </h3>
              <div className="relative border border-emerald-950/15 rounded-xl bg-white shadow-sm focus-within:border-[#106840] focus-within:ring-2 focus-within:ring-[#106840]/10 transition-all">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-2.5 pl-4 pr-10 text-sm font-medium text-slate-800 focus:outline-none placeholder-slate-400"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#106840] transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter by Categories */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0D4B2D] mb-3">
                FILTER BY CATEGORIES
              </h3>
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <Link
                    key={cat.id || idx}
                    href={`/main/shop?category=${cat.id}`}
                    className="flex items-center justify-between cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-emerald-50/70 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#106840] transition-colors" />
                      <span className="text-sm font-medium transition-colors group-hover:text-[#106840] text-slate-700">
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="flex-1">
            {/* Top Bar: Breadcrumb & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="text-xs text-[#106840] uppercase tracking-wider font-semibold border border-emerald-950/10 px-3.5 py-1.5 bg-emerald-50/50 rounded-lg">
                <Link href="/" className="hover:text-[#0D4B2D] transition-colors">Home</Link>
                <span className="mx-2 text-slate-300">/</span>
                <span className="hover:text-[#0D4B2D] transition-colors cursor-pointer">Offers</span>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-[#0D4B2D] font-bold">Flash Sale</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-700 bg-white border border-emerald-950/15 rounded-xl px-4 py-2 hover:border-[#106840] hover:text-[#106840] transition-all shadow-sm"
                >
                  SORT BY POPULARITY <ChevronDown className="w-4 h-4 text-[#106840]" />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-emerald-950/10 rounded-xl shadow-xl z-20 flex flex-col overflow-hidden">
                    <button className="px-4 py-3 text-xs text-white bg-[#106840] text-left font-bold uppercase tracking-wide">Sort by popularity</button>
                    <button className="px-4 py-3 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#106840] border-b border-slate-100 text-left font-medium uppercase transition-colors">Sort by average rating</button>
                    <button className="px-4 py-3 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#106840] border-b border-slate-100 text-left font-medium uppercase transition-colors">Sort by latest</button>
                    <button className="px-4 py-3 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#106840] border-b border-slate-100 text-left font-medium uppercase transition-colors">Sort by price: low to high</button>
                    <button className="px-4 py-3 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#106840] text-left font-medium uppercase transition-colors">Sort by price: high to low</button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-4 rounded-2xl border border-slate-100">
                    <div className="mb-4 aspect-square w-full rounded-xl bg-slate-200" />
                    <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                    <div className="mb-4 h-3 w-1/3 rounded bg-slate-200" />
                    <div className="mb-2 h-5 w-1/2 rounded bg-slate-200" />
                    <div className="h-10 w-full rounded-xl bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-emerald-950/10 rounded-2xl bg-white shadow-sm">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#0D4B2D] mb-3">No Flash Sale Right Now</h2>
                <p className="text-sm font-medium text-slate-500">Please check back soon for our next artisanal deals!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {products
                  .filter((product) =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((product) => {
                    const primaryImg = product.thumbnail ? getImgUrl(product.thumbnail) : "https://via.placeholder.com/600";

                    return (
                      <div key={product.id} className="group block bg-white rounded-2xl border border-emerald-950/10 hover:border-[#106840]/30 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(16,104,64,0.09)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full p-3.5">
                        <Link href={`/main/product/${product.id}`} className="flex flex-col flex-1 pb-0">
                          {/* Image */}
                          <div className="relative aspect-square sm:aspect-[4/5] bg-[#FDFBF7] overflow-hidden rounded-xl mb-3">
                            {/* Discount Badge */}
                            {product.originalPrice && product.currentPrice && product.originalPrice > product.currentPrice && (
                              <div className="absolute top-2.5 left-2.5 z-10 bg-[#D9941E] text-white text-[10px] sm:text-xs font-black px-2.5 py-1 uppercase rounded-md shadow-sm">
                                -{Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)}%
                              </div>
                            )}
                            <img
                              src={primaryImg}
                              alt={product.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* FLASH SALE Badge Overlay */}
                            <div className="absolute left-0 bottom-3 bg-[#106840] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10 rounded-r-md shadow-sm">
                              FLASH SALE
                            </div>
                          </div>

                          {/* Title */}
                          <div className="flex flex-col flex-1 px-1">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#106840] transition-colors mb-2 line-clamp-2">
                              {product.title}
                            </h3>

                            {/* Price */}
                            <div className="flex items-center space-x-2 mt-auto mb-3">
                              {product.originalPrice && product.originalPrice > product.currentPrice && (
                                <span className="text-gray-400 line-through text-xs sm:text-sm font-medium">
                                  ৳{product.originalPrice || 0}
                                </span>
                              )}
                              <span className="text-[#106840] font-black text-base sm:text-lg">
                                ৳{product.currentPrice || 0}
                              </span>
                            </div>
                          </div>
                        </Link>
                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2 mt-auto px-1">
                          {(() => {
                            const cartItem = items.find((i) => i.id === product.id);
                            if (cartItem) {
                              return (
                                <div className="flex items-center justify-between border border-[#106840] rounded-xl bg-white w-full overflow-hidden shadow-sm">
                                  <button
                                    className="px-4 py-2.5 font-bold text-lg hover:bg-emerald-50 text-[#106840] border-r border-[#106840]/30 transition-colors"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (cartItem.quantity === 1) {
                                        removeFromCart(cartItem.id);
                                      } else {
                                        updateQuantity(cartItem.id, cartItem.quantity - 1);
                                      }
                                    }}
                                  >
                                    <Minus className="w-4 h-4" strokeWidth={2.5} />
                                  </button>
                                  <span className="font-bold text-sm text-[#106840] px-2">
                                    {cartItem.quantity}
                                  </span>
                                  <button
                                    className="px-4 py-2.5 font-bold text-lg hover:bg-emerald-50 text-[#106840] border-l border-[#106840]/30 transition-colors"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      updateQuantity(cartItem.id, cartItem.quantity + 1);
                                    }}
                                  >
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <button
                                className="w-full bg-[#106840] text-white text-center text-xs sm:text-sm font-bold py-3 uppercase tracking-wider hover:bg-[#0D4B2D] transition-all rounded-xl shadow-sm hover:shadow active:scale-[0.98]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCart({
                                    id: product.id,
                                    title: product.title,
                                    price: product.currentPrice || product.originalPrice || 0,
                                    image: primaryImg,
                                    quantity: 1,
                                  });
                                  openCart();
                                }}
                              >
                                Add to Cart
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
