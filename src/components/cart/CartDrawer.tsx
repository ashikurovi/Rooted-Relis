"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[90] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l-[1px] border-gray-200 z-[100] transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b-[1px] border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3 text-black">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
            <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-tight">Your Cart</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 text-gray-500">
              <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 opacity-20" strokeWidth={1.5} />
              <p className="text-base sm:text-lg font-semibold uppercase tracking-widest text-gray-400">Cart is empty</p>
              <button onClick={closeCart} className="mt-2 sm:mt-4 px-6 py-3 bg-[#106840] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#0D4B2D] rounded-lg transition-colors shadow-sm">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size || "default"}`}
                  className="flex gap-4 border-b-[1px] border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-semibold text-sm uppercase leading-snug text-black">
                        {item.title}
                      </h3>
                      {item.size && (
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500 mt-1 uppercase">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="font-semibold text-sm sm:text-base mt-2 text-black">৳{item.price}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border-[1px] border-gray-300 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                          className="px-2 py-1 text-gray-600 hover:text-black transition-colors"
                        >
                          <Minus className="w-3 h-3" strokeWidth={2} />
                        </button>
                        <span className="font-semibold text-xs sm:text-sm px-2 py-1 min-w-[32px] text-center text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                          className="px-2 py-1 text-gray-600 hover:text-black transition-colors"
                        >
                          <Plus className="w-3 h-3" strokeWidth={2} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-gray-400 hover:text-red-500 font-semibold text-[10px] sm:text-xs uppercase underline transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-6 border-t-[1px] border-gray-200 bg-white">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">Total</span>
              <span className="text-xl sm:text-2xl font-bold text-[#106840]">৳{totalAmount}</span>
            </div>

            <Link
              href="/main/checkout"
              onClick={closeCart}
              className="w-full block text-center bg-[#106840] text-white font-bold text-sm py-4 rounded-xl uppercase tracking-widest hover:bg-[#0D4B2D] shadow-md shadow-[#106840]/20 transition-all hover:scale-[1.02]"
            >
              Checkout Now
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
