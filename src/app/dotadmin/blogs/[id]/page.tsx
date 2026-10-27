"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Upload, X } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { getBlogById, updateBlog } from "@/api/blogApi";
import { uploadImage } from "@/api/cdnApi";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Draft");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blogId) {
      getBlogById(blogId)
        .then((res) => {
          if (res.data) {
            setTitle(res.data.title || "");
            setExcerpt(res.data.excerpt || "");
            setContent(res.data.content || "");
            
            if (res.data.date) {
              // Convert ISO date to YYYY-MM-DD for the input type="date"
              const d = new Date(res.data.date);
              const formattedDate = d.toISOString().split('T')[0];
              setDate(formattedDate);
            }
            
            setStatus(res.data.status || "Draft");
            if (res.data.image) {
              setImagePreview(res.data.image);
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [blogId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in all required fields (Title, Content).");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = imagePreview; // keep old by default
      
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        if (uploadRes.data?.url) {
          imageUrl = uploadRes.data.url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // If imagePreview was cleared but no new file, it means they deleted the image
      if (!imagePreview && !imageFile) {
        imageUrl = null;
      }

      const payload = {
        title,
        excerpt: excerpt || null,
        content,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        status,
        image: imageUrl
      };

      await updateBlog(blogId, payload);
      alert("Blog updated successfully!");
      router.push("/dotadmin/blogs");
    } catch (err) {
      console.error(err);
      alert("Failed to update blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-xl font-bold uppercase">Loading blog...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/blogs" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Edit Blog</h1>
      </div>

      <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none max-w-4xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-4 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Blog Content</h3>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-black uppercase text-black">Article Title *</label>
              <input 
                type="text" 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to Style Drop Shoulder Tees for Winter" 
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="excerpt" className="text-sm font-black uppercase text-black">Short Excerpt</label>
              <textarea 
                id="excerpt" 
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary of the article..." 
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase resize-none" 
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="content" className="text-sm font-black uppercase text-black">Full Content *</label>
              <RichTextEditor 
                id="content"
                value={content}
                onChange={(val) => setContent(val)} 
                placeholder="Write your article here..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-sm font-black uppercase text-black">Publish Date</label>
                <input 
                  type="date" 
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="status" className="text-sm font-black uppercase text-black">Status</label>
                <select 
                  id="status" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Cover Image</h3>
            {imagePreview ? (
              <div className="relative border-[3px] border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block group">
                <img src={imagePreview} alt="Preview" className="w-full max-w-lg object-cover border-2 border-black" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-4 right-4 bg-red-500 text-white p-1 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="relative border-[3px] border-dashed border-black rounded-none p-10 flex flex-col items-center justify-center bg-white hover:bg-gray-100 transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 text-black">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="font-medium text-gray-600 dark:text-gray-300 text-sm">Click to upload cover image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="border-2 border-[#0D4B2D] bg-[#106840] px-8 py-3 text-sm font-extrabold uppercase text-white shadow-[4px_4px_0px_0px_#0D4B2D] transition-all hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Blog"}
            </button>
            <button 
              type="button"
              onClick={() => router.push("/dotadmin/blogs")}
              className="border-2 border-[#0D4B2D]/40 bg-[#FDFBF7] px-8 py-3 text-sm font-extrabold uppercase text-[#0D4B2D] shadow-[4px_4px_0px_0px_rgba(13,75,45,0.2)] transition-all hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400 hover:shadow-[5px_5px_0px_0px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
