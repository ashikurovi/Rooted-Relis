"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { getAllProducts } from "@/api/productApi";

export function AllProducts() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["ALL"]);
  const [loading, setLoading] = useState(true);

  const { items, addToCart, updateQuantity, removeFromCart, openCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts();
        if (res.data) {
          setProducts(res.data);

          const uniqueCats = new Set<string>();
          res.data.forEach((p: any) => {
            if (p.category && p.category.name) {
              uniqueCats.add(p.category.name);
            }
          });
          setCategories(["ALL", ...Array.from(uniqueCats)]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
        window.dispatchEvent(new CustomEvent("landing-data-ready", { detail: "products" }));
      }
    };
    fetchProducts();
  }, []);

  const getImgUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `https://rooted-relis-f4g9.vercel.app${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const filteredProducts = activeCategory === "ALL"
    ? products
    : products.filter(p => p.category?.name === activeCategory);

  const displayProducts = filteredProducts.slice(0, 8);

  return (
    <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-[#106840] tracking-wide uppercase mb-3">
          TASTE THE AUTHENTICITY
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-8 font-medium">
          Handcrafted heritage relishes, traditional sweets, and artisanal delicacies curated for unforgettable flavor.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider transition-all uppercase rounded-lg border ${activeCategory === category
                ? "bg-[#106840] text-white border-[#106840] shadow-md shadow-[#106840]/20"
                : "bg-white text-gray-700 border-gray-200 hover:border-[#106840] hover:text-[#106840]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
        {displayProducts.map((product) => {
          let primaryImg = product.thumbnail ? getImgUrl(product.thumbnail) : "";
          let hoverImg = primaryImg;

          if (product.images) {
            let parsed: string[] = [];
            if (typeof product.images === 'string') {
              try {
                parsed = JSON.parse(product.images);
              } catch (e) {
                parsed = [product.images];
              }
            } else if (Array.isArray(product.images)) {
              parsed = product.images;
            }
            if (parsed.length > 0) {
              if (!primaryImg) primaryImg = getImgUrl(parsed[0]);
              hoverImg = parsed.length > 1 ? getImgUrl(parsed[1]) : getImgUrl(parsed[0]);
            }
          }

          if (!primaryImg) primaryImg = "https://via.placeholder.com/600";
          if (!hoverImg) hoverImg = primaryImg;

          return (
            <div key={product.id} className="group block bg-transparent transition-transform hover:-translate-y-1 flex flex-col h-full">
              <Link href={`/main/product/${product.id}`} className="flex flex-col flex-1">
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden rounded-none">
                  {/* Discount Badge */}
                  {product.originalPrice && product.currentPrice && product.originalPrice > product.currentPrice && (
                    <div className="absolute top-2 left-2 z-10 bg-[#D9941E] text-white text-[10px] sm:text-xs font-black px-2.5 py-1 uppercase rounded-md shadow-sm">
                      -{Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  {/* Primary Image */}
                  <img
                    src={primaryImg || "https://via.placeholder.com/600"}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:opacity-0"
                  />
                  {/* Hover Image */}
                  <img
                    src={hoverImg || "https://via.placeholder.com/600"}
                    alt={`${product.title} Alternate`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col items-start text-left pt-4 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#106840] transition-colors mb-2 line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Variant Label as Badge */}
                  {product.variantLabel && (
                    <div className="bg-[#106840]/10 text-[#106840] text-[10px] sm:text-xs font-bold px-2 py-0.5 uppercase mb-2 rounded">
                      {product.variantLabel}
                    </div>
                  )}

                  {product.selectSizeText ? (
                    <div className="text-yellow-600 text-xs sm:text-sm font-bold uppercase tracking-wide mt-auto mb-2">
                      {product.selectSizeText}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 mt-auto mb-2">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-xs sm:text-sm font-medium">
                          ৳{product.originalPrice}
                        </span>
                      )}
                      <span className="text-black font-semibold text-sm sm:text-base">
                        ৳{product.currentPrice}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 mt-auto">
                {(() => {
                  const cartItem = items.find((i) => i.id === product.id);
                  if (cartItem) {
                    return (
                      <div className="flex items-center justify-between border border-[#106840] rounded-lg bg-white w-full overflow-hidden">
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
                    <div className="flex flex-col gap-2 w-full">
                      <button
                        className="w-full bg-[#106840] text-white text-center text-xs sm:text-sm font-bold py-3 uppercase tracking-wider hover:bg-[#0D4B2D] transition-colors rounded-lg shadow-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({
                            id: product.id,
                            title: product.title,
                            price: product.currentPrice || product.originalPrice || 0,
                            image: primaryImg,
                            quantity: 1,
                            variantLabel: product.variantLabel,
                          });
                          openCart();
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )
        })}
      </div>

      {/* See More Button */}
      <div className="mt-16 flex justify-center">
        <Link
          href="/main/shop"
          className="inline-block bg-[#106840] text-white px-10 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#0D4B2D] shadow-md shadow-[#106840]/20 transition-all hover:scale-105"
        >
          EXPLORE ALL TASTES
        </Link>
      </div>
    </section>
  );
}
