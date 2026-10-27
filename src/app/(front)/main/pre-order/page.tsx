"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { getAllProducts } from "@/api/productApi";
import { getAllCategories } from "@/api/categoryApi";

export default function PreOrderPage() {
  const { items, addToCart, updateQuantity, removeFromCart, openCart } = useCartStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);

        let preOrderCategoryIds: number[] = [];

        if (catRes.data) {
          preOrderCategoryIds = catRes.data
            .filter((cat: any) => 
              cat.name.toLowerCase().includes('pre order') || 
              cat.name.toLowerCase().includes('pre-order')
            )
            .map((cat: any) => cat.id);
        }

        if (prodRes.data) {
          const preOrderProducts = prodRes.data.filter((product: any) => 
            preOrderCategoryIds.includes(product.categoryId) || 
            (product.category && preOrderCategoryIds.includes(product.category.id))
          );
          setProducts(preOrderProducts);
        }

      } catch (error) {
        console.error("Failed to fetch pre-order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full py-6 md:py-10 mb-8 border-b-[1px] border-black">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-center text-black uppercase tracking-tight">Pre-Orders</h1>
          <p className="text-center mt-4 text-gray-500 font-medium uppercase tracking-widest text-sm">Secure your favorite items before they run out.</p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="mb-4 aspect-square w-full rounded-none bg-slate-200" />
                <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                <div className="mb-4 h-3 w-1/3 rounded bg-slate-200" />
                <div className="h-9 w-full rounded-none bg-slate-200" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center justify-center border-[1px] border-dashed border-gray-300">
            <h2 className="text-xl font-bold text-black uppercase tracking-widest mb-2">No Pre-Orders Currently Available</h2>
            <p className="text-sm font-medium">Please check back later for exciting upcoming products.</p>
            <Link href="/main/shop" className="mt-6 bg-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
            {products.map((product) => {
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
                imgUrl = `https://codegrid-api.vercel.app${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
              }



              return (
                <div key={product.id} className="group block relative bg-transparent transition-transform hover:-translate-y-1 flex flex-col h-full">
                  <Link href={`/main/product/${product.id}`} className="flex flex-col flex-1 pb-0">
                    <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-4 rounded-none">
                      {/* Discount Badge */}
                      {product.originalPrice && product.currentPrice && product.originalPrice > product.currentPrice && (
                        <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 uppercase rounded-none">
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
                        <div className="w-full h-full flex items-center justify-center font-medium text-gray-400">NO IMAGE</div>
                      )}
                      
                      <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                        PRE-ORDER
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 px-1">
                      <h3 className="text-sm font-bold text-black mb-1 line-clamp-2 uppercase tracking-tight">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center space-x-2 mt-auto mb-3">
                        {Number(product.originalPrice) > Number(product.currentPrice) && (
                          <span className="text-gray-400 line-through text-xs font-medium">
                            ৳{product.originalPrice}
                          </span>
                        )}
                        <span className="text-black font-semibold text-sm">
                          ৳{product.currentPrice || product.originalPrice}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex gap-2 pt-2 mt-auto px-1">
                    {(() => {
                      const cartItem = items.find((i) => i.id === product.id);
                      if (cartItem) {
                        return (
                          <div className="flex items-center justify-between border-[1px] border-black bg-white w-full">
                            <button
                              className="px-4 py-2 font-medium text-lg hover:bg-gray-100 border-r-[1px] border-black transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                if (cartItem.quantity === 1) {
                                  removeFromCart(cartItem.id);
                                } else {
                                  updateQuantity(cartItem.id, cartItem.quantity - 1);
                                }
                              }}
                            >
                              <Minus className="w-4 h-4" strokeWidth={2} />
                            </button>
                            <span className="font-medium text-base px-2">
                              {cartItem.quantity}
                            </span>
                            <button
                              className="px-4 py-2 font-medium text-lg hover:bg-gray-100 border-l-[1px] border-black transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                updateQuantity(cartItem.id, cartItem.quantity + 1);
                              }}
                            >
                              <Plus className="w-4 h-4" strokeWidth={2} />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <button
                          className="w-full bg-black text-white text-center text-xs font-bold py-3 uppercase tracking-widest hover:bg-gray-800 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({
                              id: product.id,
                              title: product.title,
                              price: Number(product.currentPrice) || Number(product.originalPrice) || 0,
                              image: imgUrl || "",
                              quantity: 1,
                              isPreOrder: true,
                            });
                            openCart();
                          }}
                        >
                          Pre Order Now
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
