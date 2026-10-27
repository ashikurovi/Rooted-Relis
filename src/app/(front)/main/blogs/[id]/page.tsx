"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBlogById } from "@/api/blogApi";

export default function BlogDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        if (res.data) {
          setBlog(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <main className="mx-auto flex w-full max-w-screen-xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl animate-pulse">
            <div className="mb-8 h-4 w-28 rounded bg-slate-200" />
            <div className="mb-8 h-12 w-3/4 rounded bg-slate-200 sm:h-16" />
            <div className="mb-10 h-4 w-56 rounded bg-slate-200" />
            <div className="mb-12 aspect-video w-full rounded-none bg-slate-200" />
            <div className="space-y-4">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-5/6 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-4/5 rounded bg-slate-200" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!blog) return <div className="min-h-screen flex items-center justify-center font-medium">Blog not found</div>;

  const getImgUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `https://codegrid-api.vercel.app${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Link
            href="/main/blogs"
            className="group flex items-center w-max text-black font-semibold uppercase tracking-widest hover:text-gray-500 transition-colors mb-10 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight uppercase tracking-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-widest mb-10">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {formatDate(blog.date || blog.createdAt)}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" /> CodeGrid
              </span>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto aspect-video bg-gray-100 mb-12 overflow-hidden">
            <img
              src={getImgUrl(blog.image)}
              alt={blog.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg max-w-none text-gray-700 font-medium space-y-6 text-base sm:text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
