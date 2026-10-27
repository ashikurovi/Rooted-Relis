"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBrandById, updateBrand } from "@/api/brandApi";

export default function BandDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.id as string;

  const [brand, setBrand] = useState<{ name: string, description: string, image: File | null, existingPicture: string }>({
    name: "",
    description: "",
    image: null,
    existingPicture: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBrandDetails();
  }, [brandId]);

  const fetchBrandDetails = async () => {
    try {
      setIsLoading(true);
      const res = await getBrandById(brandId);

      if (res) {
        const brandData = res.data || res;
        setBrand({
          name: brandData.name || "",
          description: brandData.description || "",
          image: null,
          existingPicture: brandData.picture || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch brand details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('name', brand.name);
      formData.append('description', brand.description);
      if (brand.image) {
        formData.append('picture', brand.image);
      }

      await updateBrand(brandId, formData);
      router.push("/dotadmin/bands");
    } catch (error) {
      console.error("Failed to update brand:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading brand details...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/bands" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Brand Details: BRND-{brandId}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <h2 className="text-xl font-semibold mb-6">Edit Brand Information</h2>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-black uppercase text-black">Brand Name</label>
              <input
                type="text"
                id="name"
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-black uppercase text-black">Description</label>
              <textarea
                id="description"
                rows={3}
                value={brand.description}
                onChange={(e) => setBrand({ ...brand, description: e.target.value })}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase resize-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="image" className="text-sm font-black uppercase text-black">Brand Logo / Image</label>
              {brand.existingPicture && !brand.image && (
                <div className="mb-2">
                  <img src={`https://codegrid-api.vercel.app${brand.existingPicture}`} alt="Current brand picture" className="w-20 h-20 object-cover border rounded" />
                </div>
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setBrand({ ...brand, image: file });
                }}
                className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isSaving || !brand.name}
                className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="border bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800 flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Related Products</h2>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">Products API not yet connected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
