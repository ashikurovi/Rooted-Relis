"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { getAllBudgetPicks } from "@/api/buget-pickApi";
import { getAllCategories } from "@/api/categoryApi";



export default function BudgetPickPage() {
  const { items, addToCart, updateQuantity, removeFromCart, openCart } = useCartStore();
  const [budgetProducts, setBudgetProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getImgUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `https://codegrid-api.vercel.app${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetRes, catRes] = await Promise.all([
          getAllBudgetPicks(),
          getAllCategories()
        ]);

        if (budgetRes) {
          const activePicks = budgetRes.filter((p: any) => p.isActive);
          setBudgetProducts(activePicks);
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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Main Container */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Huge Title */}
        <div className="w-full py-6 md:py-10 mb-8 border-b border-emerald-950/10 text-center">
          <div className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-[#D9941E] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 mb-3">
            Gourmet Value Bundles
          </div>
          <h1 className="text-3xl sm:text-6xl md:text-7xl font-black text-center text-[#0D4B2D] uppercase tracking-tight">Budget Pick</h1>
          <p className="text-center text-slate-600 font-medium text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Get more authentic flavor for less. Explore our curated gift bundles, relish pairings, and family combo packages at special prices.
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
                  placeholder="Search packages..."
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
                <span className="text-[#0D4B2D] font-bold">Budget Pick</span>
              </div>

              <button className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-700 bg-white border border-emerald-950/15 rounded-xl px-4 py-2 hover:border-[#106840] hover:text-[#106840] transition-all shadow-sm">
                SORT BY POPULARITY <ChevronDown className="w-4 h-4 text-[#106840]" />
              </button>
            </div>

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
            ) : budgetProducts.length === 0 ? (
              <div className="text-center py-20 border border-emerald-950/10 rounded-2xl bg-white shadow-sm">
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#0D4B2D] mb-2">No Budget Picks Found</h3>
                <p className="text-sm font-medium text-slate-500">Currently, there are no active combo packages available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {budgetProducts
                  .filter((product) =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((product) => (
                    <div key={product.id} className="group block bg-white rounded-2xl border border-emerald-950/10 hover:border-[#106840]/30 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(16,104,64,0.09)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full p-3.5">
                      <Link href={`/main/budget-pick/${product.id}`} className="flex flex-col flex-1 pb-0">
                        {/* Image */}
                        <div className="relative aspect-square sm:aspect-[4/5] bg-[#FDFBF7] overflow-hidden rounded-xl mb-3">
                          <div className="absolute top-2.5 left-2.5 z-10 bg-[#D9941E] text-white text-[10px] sm:text-xs font-black px-2.5 py-1 uppercase rounded-md shadow-sm">
                            COMBO BUNDLE
                          </div>
                          <img
                            src={getImgUrl(product.image)}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Title */}
                        <div className="flex flex-col flex-1 px-1">
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#106840] transition-colors mb-2 line-clamp-2">
                            {product.title}
                          </h3>

                          {/* Price */}
                          <div className="flex items-center space-x-2 mt-auto mb-3">
                            <span className="text-[#106840] font-black text-base sm:text-lg">
                              ৳{product.packagePrice}
                            </span>
                          </div>
                        </div>
                      </Link>
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 mt-auto px-1">
                        {(() => {
                          const cartItem = items.find((i) => i.id === `bp_${product.id}`);
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
                                  id: `bp_${product.id}`,
                                  title: product.title,
                                  price: product.packagePrice,
                                  image: product.image,
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
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
