"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllBlogs } from "@/api/blogApi";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getAllBlogs();
        if (res.data) {
          const published = res.data.filter((b: any) => b.status === "Published" || !b.status);
          published.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBlogs(published);
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-16 text-center">
            <div className="mx-auto mb-4 h-10 w-64 animate-pulse rounded bg-slate-200" />
            <div className="mx-auto h-4 w-80 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-16">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="mb-6 aspect-[4/3] w-full bg-slate-200" />
                <div className="mb-3 h-3 w-24 rounded bg-slate-200" />
                <div className="mb-3 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mb-2 h-4 w-full rounded bg-slate-200" />
                <div className="mb-2 h-4 w-5/6 rounded bg-slate-200" />
                <div className="h-10 w-28 rounded border border-slate-200 bg-slate-200" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-in fade-in duration-500">
          <div className="text-center mb-16 flex flex-col items-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#106840] uppercase tracking-tight mb-4">
              Rooted Relish <span className="text-[#D9941E]">Journal</span>
            </h1>
            <p className="text-gray-600 font-medium text-sm sm:text-base max-w-2xl mx-auto py-2">
              Stories of heritage flavors, authentic culinary traditions, and the passion behind Rooted Relish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/main/blogs/${blog.id}`}
                className="group flex flex-col cursor-pointer bg-transparent transition-transform hover:-translate-y-1"
              >
                <div className="relative w-full aspect-[4/3] bg-gray-100 mb-6 overflow-hidden rounded-xl">
                  <img
                    src={getImgUrl(blog.image)}
                    alt={blog.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-90"
                  />
                  <div className="absolute top-4 left-4 bg-[#106840] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                    LATEST
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-[#106840] uppercase tracking-widest mb-3">
                  <span>{formatDate(blog.date || blog.createdAt)}</span>
                  <span className="w-1 h-1 rounded-full bg-[#D9941E]"></span>
                  <span>Rooted Relish</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-black uppercase tracking-tight mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600 font-medium mb-6 flex-1 text-sm sm:text-base line-clamp-3">
                  {blog.excerpt || (blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : '')}
                </p>

                <div className="mt-auto">
                  <span className="inline-block border-[1px] border-black text-black text-xs font-semibold uppercase tracking-widest px-4 py-2 group-hover:bg-black group-hover:text-white transition-colors">
                    Read Article
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
