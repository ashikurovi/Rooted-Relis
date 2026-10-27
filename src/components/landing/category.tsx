"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCategories } from "@/api/categoryApi";

export function Category() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        window.dispatchEvent(new CustomEvent("landing-data-ready", { detail: "categories" }));
      }
    };
    fetchCategories();
  }, []);

  const getImgUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `https://codegrid-api.vercel.app${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (categories.length === 0) return null;

  return (
    <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-black tracking-wide uppercase">
          Featured Categories
        </h2>
      </div>

      {/* Scrollable Flex Container */}
      <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/main/shop?category=${category.id}`}
            className="flex-none w-[180px] sm:w-[220px] lg:w-[200px] snap-center group relative aspect-square overflow-hidden rounded-none block bg-transparent transition-transform hover:-translate-y-1"
          >
            {/* Image */}
            <div className="absolute inset-0 bg-gray-100">
              <img
                src={getImgUrl(category.picture) || undefined}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:opacity-90"
              />
            </div>

            {/* Title */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center px-2">
              <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] sm:text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest text-center shadow-sm">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
