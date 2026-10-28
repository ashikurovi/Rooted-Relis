"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { getAllProducts } from "@/api/productApi";
import { getAllCategories } from "@/api/categoryApi";

export default function ShopPage() {
  const { items, addToCart, updateQuantity, removeFromCart, openCart } = useCartStore();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);

        if (prodRes.data) {
          setProducts(prodRes.data);
        }

        if (catRes.data) {
          setCategories(catRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryId === parseInt(selectedCategory) || product.category?.id === parseInt(selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Main Container */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Huge Shop Title */}
        <div className="w-full py-6 md:py-10 mb-8 border-b border-emerald-950/10 text-center">
          <div className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-[#D9941E] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 mb-3">
            Handcrafted &amp; Wholesome
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-center text-[#0D4B2D] uppercase tracking-tight">Our Pantry</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-xl mx-auto">
            Explore authentic pickles, artisanal chutneys, gourmet preserves, and heritage delicacies.
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search relishes & treats..."
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
                <label className="flex items-center justify-between cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-emerald-50/70 transition-colors">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="w-4 h-4 accent-[#106840] cursor-pointer"
                    />
                    <span className="text-sm font-medium transition-colors group-hover:text-[#106840] text-slate-700">
                      All Products
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-[#106840] border border-emerald-900/10">
                    {products.length}
                  </span>
                </label>

                {categories.map((cat: any) => {
                  const count = products.filter(p => p.categoryId === cat.id || p.category?.id === cat.id).length;
                  return (
                    <label
                      key={cat.id}
                      className="flex items-center justify-between cursor-pointer group py-1.5 px-2 rounded-lg hover:bg-emerald-50/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="category"
                          value={cat.id.toString()}
                          checked={selectedCategory === cat.id.toString()}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 accent-[#106840] cursor-pointer"
                        />
                        <span className="text-sm font-medium transition-colors group-hover:text-[#106840] text-slate-700">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-[#106840] border border-emerald-900/10">
                        {count}
                      </span>
                    </label>
                  );
                })}
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
                <span className="text-[#0D4B2D] font-bold">Shop</span>
              </div>

              <button className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-slate-700 bg-white border border-emerald-950/15 rounded-xl px-4 py-2 hover:border-[#106840] hover:text-[#106840] transition-all shadow-sm">
                SORT BY POPULARITY <ChevronDown className="w-4 h-4 text-[#106840]" />
              </button>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse bg-white p-4 rounded-2xl border border-slate-100">
                    <div className="mb-4 aspect-square w-full rounded-xl bg-slate-200" />
                    <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                    <div className="mb-4 h-3 w-1/3 rounded bg-slate-200" />
                    <div className="mb-2 h-5 w-1/2 rounded bg-slate-200" />
                    <div className="h-10 w-full rounded-xl bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-emerald-950/10 rounded-2xl bg-white shadow-sm">
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#0D4B2D] mb-2">No Products Found</h3>
                <p className="text-sm font-medium text-slate-500">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
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
                        imgUrl = product.images;
                      }
                    }
                  }

                  if (imgUrl && !imgUrl.startsWith('http')) {
                    imgUrl = `https://rooted-relis-f4g9.vercel.app${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
                  }

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
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={product.title || "Product image"}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-medium text-slate-300">NO IMAGE</div>
                          )}
                        </div>

                        {/* Title */}
                        <div className="flex flex-col flex-1 px-1">
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#106840] transition-colors mb-2 line-clamp-2">
                            {product.title}
                          </h3>

                          {/* Tags / Badges */}
                          <div className="flex flex-wrap gap-2 mb-2 min-h-[22px]">
                            {product.stock > 0 ? (
                              <span className="bg-emerald-50 text-[#106840] border border-[#106840]/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                                In Stock
                              </span>
                            ) : (
                              <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                                Out of Stock
                              </span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center space-x-2 mt-auto mb-3">
                            {product.originalPrice && product.currentPrice && Number(product.originalPrice) > Number(product.currentPrice) && (
                              <span className="text-gray-400 line-through text-xs sm:text-sm font-medium">
                                ৳{product.originalPrice}
                              </span>
                            )}
                            <span className="text-[#106840] font-black text-base sm:text-lg">
                              {product.currentPrice && Number(product.currentPrice) > 0 ? `৳${product.currentPrice}` : product.originalPrice && Number(product.originalPrice) > 0 ? `৳${product.originalPrice}` : 'Coming Soon'}
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
                                  disabled={cartItem.quantity >= product.stock}
                                >
                                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div className="flex flex-col gap-2 w-full">
                              <button
                                className="w-full bg-[#106840] text-white text-center text-xs sm:text-sm font-bold py-3 uppercase tracking-wider hover:bg-[#0D4B2D] transition-all rounded-xl shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={product.stock <= 0}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (product.stock <= 0) return;
                                  addToCart({
                                    id: product.id,
                                    title: product.title,
                                    price: Number(product.currentPrice) || Number(product.originalPrice) || 0,
                                    image: imgUrl || "",
                                    quantity: 1,
                                  });
                                  openCart();
                                }}
                              >
                                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                              </button>
                            </div>
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
