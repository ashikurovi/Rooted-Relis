"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { createBanner } from "@/api/bannerApi";
import { uploadImage } from "@/api/cdnApi";

export default function AddBannerPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tag, setTag] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("Active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle || !link) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        if (uploadRes.data?.url) {
          imageUrl = uploadRes.data.url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      const payload = {
        title,
        subtitle,
        tag: tag || null,
        link,
        status,
        image: imageUrl
      };

      await createBanner(payload);
      alert("Banner created successfully!");
      router.push("/dotadmin/banner");
    } catch (err) {
      console.error(err);
      alert("Failed to create banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/banner" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Add New Banner</h1>
      </div>

      <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none max-w-4xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Banner Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm font-black uppercase text-black">Main Title *</label>
                <input 
                  type="text" 
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Collection" 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                  required
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="subtitle" className="text-sm font-black uppercase text-black">Subtitle *</label>
                <input 
                  type="text" 
                  id="subtitle" 
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. STAY WARM" 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="tag" className="text-sm font-black uppercase text-black">Tag (Optional)</label>
                <input 
                  type="text" 
                  id="tag" 
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. NEW or #DEARAAZ" 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="link" className="text-sm font-black uppercase text-black">Destination Link *</label>
                <input 
                  type="text" 
                  id="link" 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. /shop or https://..." 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                  required
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Banner Image</h3>
            <p className="text-sm text-gray-500 mb-2">Recommended resolution: 1920x1080 (or roughly 16:9 aspect ratio).</p>
            
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
                <p className="font-medium text-gray-600 dark:text-gray-300 text-sm">Click to upload banner image</p>
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
              {isSubmitting ? "Saving..." : "Save Banner"}
            </button>
            <button 
              type="button"
              onClick={() => router.push("/dotadmin/banner")}
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
