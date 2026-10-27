"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Upload, X } from "lucide-react";
import { getCampaignNoticeById, updateCampaignNotice } from "@/api/campaignApi";
import { uploadImage } from "@/api/cdnApi";

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [campaignName, setCampaignName] = useState("");
  const [offerText, setOfferText] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (campaignId) {
      getCampaignNoticeById(campaignId)
        .then((res) => {
          if (res.data) {
            setCampaignName(res.data.campaignName || "");
            setOfferText(res.data.offerText || "");
            setDate(res.data.date || "");
            setLink(res.data.link || "");
            setIsActive(res.data.isActive ?? true);
            if (res.data.image) {
              setImagePreview(res.data.image);
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [campaignId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      let imageUrl = imagePreview; // Keep old image by default
      
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        if (uploadRes.data?.url) {
          imageUrl = uploadRes.data.url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      if (!imagePreview && !imageFile) {
        imageUrl = null;
      }

      const payload = {
        campaignName,
        offerText,
        date: date || null,
        link: link || null,
        isActive,
        image: imageUrl
      };

      await updateCampaignNotice(campaignId, payload);
      alert("Campaign updated successfully!");
      router.push("/dotadmin/campaign");
    } catch (err) {
      console.error(err);
      alert("Failed to update campaign.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-xl font-bold uppercase">Loading campaign...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/campaign" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Edit Campaign Notice</h1>
      </div>

      <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none max-w-4xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-4 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Campaign Info</h3>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-black uppercase text-black">Campaign Name</label>
              <input 
                type="text" 
                id="name" 
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Flash Sale" 
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="offerText" className="text-sm font-black uppercase text-black">Offer Text</label>
              <textarea 
                id="offerText" 
                rows={2}
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                placeholder="Grab your favorite apparel before they're gone!" 
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase resize-none" 
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="link" className="text-sm font-black uppercase text-black">Target Link</label>
              <input 
                type="text" 
                id="link" 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. /main/big-sale" 
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-sm font-black uppercase text-black">End Date Text</label>
                <input 
                  type="text" 
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Limited Time Offer" 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="status" className="text-sm font-black uppercase text-black">Status</label>
                <select 
                  id="status" 
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
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
              {isSubmitting ? "Updating..." : "Update Campaign"}
            </button>
            <button 
              type="button"
              onClick={() => router.push("/dotadmin/campaign")}
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
