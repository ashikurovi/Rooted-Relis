"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllBlogs } from "@/api/blogApi";

export function RecentBlog() {
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getAllBlogs();
        if (res.data) {
          const published = res.data.filter((b: any) => b.status === "Published" || !b.status);
          published.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setRecentBlogs(published.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        window.dispatchEvent(new CustomEvent("landing-data-ready", { detail: "blogs" }));
      }
    };
    fetchBlogs();
  }, []);

  const getImgUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `https://rooted-relis-f4g9.vercel.app${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  if (recentBlogs.length === 0) return null;

  return (
    <section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#106840] tracking-wide uppercase">
          LATEST STORIES & RECIPES
        </h2>
        <Link
          href="/main/blogs"
          className="text-sm font-bold uppercase tracking-widest text-[#106840] border border-[#106840] bg-white hover:bg-[#106840] hover:text-white transition-colors px-6 py-3 hidden sm:flex items-center gap-2 rounded-xl shadow-sm"
        >
          VIEW ALL <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
        {recentBlogs.map((blog, index) => {
          let colSpanClasses = "md:col-span-1 lg:col-span-2";
          if (index === 0) colSpanClasses = "md:col-span-2 lg:col-span-4";

          return (
            <Link
              key={blog.id}
              href={`/main/blogs/${blog.id}`}
              className={`group flex flex-col block bg-transparent transition-transform hover:-translate-y-1 ${colSpanClasses}`}
            >
              {/* Image Container */}
              <div
                className={`relative bg-gray-100 overflow-hidden rounded-xl ${index === 0 ? "aspect-video md:aspect-[2/1] lg:aspect-[16/9]" : "aspect-video lg:aspect-[4/3]"}`}
              >
              <img
                src={getImgUrl(blog.image)}
                alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-90"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 pt-6 pb-2">
              <span className="inline-block bg-[#106840] text-white px-3 py-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase w-max mb-4 rounded">
                {formatDate(blog.date || blog.createdAt)}
              </span>
              <h3
                className={`font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#106840] transition-colors ${index === 0 ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl line-clamp-2"}`}
              >
                {blog.title}
              </h3>
              <p
                className={`text-gray-500 flex-1 mb-6 font-medium ${index === 0 ? "text-base sm:text-lg line-clamp-3" : "text-sm line-clamp-2"}`}
              >
                {blog.excerpt || (blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : '')}
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-2 text-[#106840] text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-transform group-hover:translate-x-1">
                  READ STORY <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
          );
        })}
      </div>

      {/* Mobile View All Button */}
      <div className="mt-8 flex sm:hidden w-full">
        <Link
          href="/main/blogs"
          className="text-sm w-full justify-center font-bold uppercase tracking-widest text-[#106840] border border-[#106840] bg-white hover:bg-[#106840] hover:text-white transition-colors px-6 py-4 flex items-center gap-2 rounded-xl shadow-sm"
        >
          VIEW ALL <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
