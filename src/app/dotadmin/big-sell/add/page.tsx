"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, Plus, X } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { createFlashSell } from "../../../../api/flashsaleApi";
import { uploadImage } from "../../../../api/cdnApi";
import { getAllSizes } from "../../../../api/sizeApi";
import { getAllTypes } from "../../../../api/typeApi";
import { getAllCategories } from "../../../../api/categoryApi";
import { getAllSubCategories } from "../../../../api/sub-categoryApi";
import { getAllBrands } from "../../../../api/brandApi";
export default function AddBigSellProductPage() {
  const router = useRouter();
  
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [variantLabel, setVariantLabel] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("Active");
  
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [subCategoryId, setSubCategoryId] = useState<number | "">("");
  const [brandId, setBrandId] = useState<number | "">("");
  const [sizeIds, setSizeIds] = useState<number[]>([]);
  const [typeIds, setTypeIds] = useState<number[]>([]);

  // Fetched data
  const [availableSizes, setAvailableSizes] = useState<any[]>([]);
  const [availableTypes, setAvailableTypes] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [availableSubCategories, setAvailableSubCategories] = useState<any[]>([]);
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      getAllSizes(),
      getAllTypes(),
      getAllCategories(),
      getAllSubCategories(),
      getAllBrands()
    ]).then(([sizesRes, typesRes, categoriesRes, subCategoriesRes, brandsRes]) => {
      setAvailableSizes(sizesRes.data || []);
      setAvailableTypes(typesRes.data || []);
      setAvailableCategories(categoriesRes.data || []);
      setAvailableSubCategories(subCategoriesRes.data || []);
      setAvailableBrands(brandsRes.data || []);
    });
  }, []);

  const filteredSubCategories = useMemo(() => {
    if (!categoryId) return availableSubCategories;
    return availableSubCategories.filter(sub => sub.parentCategory?.id === Number(categoryId));
  }, [availableSubCategories, categoryId]);

  // Reset sub-category if it doesn't belong to the newly selected category
  useEffect(() => {
    if (subCategoryId && categoryId) {
      const isValid = filteredSubCategories.some(sub => sub.id === Number(subCategoryId));
      if (!isValid) {
        setSubCategoryId("");
      }
    }
  }, [categoryId, filteredSubCategories, subCategoryId]);

  const handleUpload = async (file: File, isThumbnail: boolean = false) => {
    try {
      setIsUploading(true);
      const res = await uploadImage(file);
      if (res.data && res.data.url) {
        if (isThumbnail) {
          setThumbnail(res.data.url);
        } else {
          setGalleryImages(prev => [...prev, res.data.url]);
        }
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const newProduct = {
        title,
        variantLabel,
        description,
        features: features.split("\n").filter(f => f.trim() !== ""),
        originalPrice: Number(originalPrice),
        currentPrice: Number(currentPrice),
        sizeIds,
        typeIds,
        categoryId: categoryId ? Number(categoryId) : undefined,
        subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
        brandId: brandId ? Number(brandId) : undefined,
        thumbnail,
        images: galleryImages,
      };

      await createFlashSell(newProduct);
      router.push("/dotadmin/big-sell");
    } catch (error) {
      console.error("Failed to create product", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/big-sell" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Add Flash Sale Product</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Form Area */}
        <div className="flex-1 w-full border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <form id="productForm" onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* General Information */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 text-black">General Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-black uppercase text-black">Product Name (Title)</label>
                  <input 
                    type="text" 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Motorsport Racing T-Shirt: Porsche" 
                    className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="variantLabel" className="text-sm font-black uppercase text-black">Variant Label (Badge)</label>
                  <input 
                    type="text" 
                    id="variantLabel" 
                    value={variantLabel}
                    onChange={(e) => setVariantLabel(e.target.value)}
                    placeholder="e.g. Half/Drop Available" 
                    className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-black uppercase text-black">Full Description</label>
                <RichTextEditor 
                  value={description}
                  onChange={setDescription} 
                  placeholder="Write a detailed product description here..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="features" className="text-sm font-black uppercase text-black">Key Features (One per line)</label>
                <textarea 
                  id="features" 
                  rows={4}
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Premium and Exclusive design & print&#10;Limited edition&#10;Free Physical discount card" 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase resize-none" 
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 text-black">Pricing & Inventory</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="originalPrice" className="text-sm font-black uppercase text-black">Original Price (৳)</label>
                  <input 
                    type="number" 
                    id="originalPrice" 
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="750" 
                    className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="currentPrice" className="text-sm font-black uppercase text-[#3b82f6]">Current Selling Price (৳)</label>
                  <input 
                    type="number" 
                    id="currentPrice" 
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    required
                    placeholder="690" 
                    className="w-full border-[3px] border-[#3b82f6] p-2 text-sm font-black shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] focus:outline-none focus:ring-0 rounded-none bg-blue-50 text-black uppercase" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="stock" className="text-sm font-black uppercase text-black">Stock Quantity</label>
                  <input 
                    type="number" 
                    id="stock" 
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    placeholder="100" 
                    className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 text-black">Available Variants</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-black uppercase text-black">Available Sizes</label>
                  <div className="flex flex-wrap gap-4">
                    {availableSizes.map((size) => (
                      <label key={size.id} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={sizeIds.includes(size.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSizeIds([...sizeIds, size.id]);
                            else setSizeIds(sizeIds.filter(id => id !== size.id));
                          }}
                          className="w-4 h-4 text-black focus:ring-0 border-[3px] border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                        />
                        <span className="text-sm">{size.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-black uppercase text-black">Available Types</label>
                  <div className="flex flex-wrap gap-4">
                    {availableTypes.map((type) => (
                      <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={typeIds.includes(type.id)}
                          onChange={(e) => {
                            if (e.target.checked) setTypeIds([...typeIds, type.id]);
                            else setTypeIds(typeIds.filter(id => id !== type.id));
                          }}
                          className="w-4 h-4 text-black focus:ring-0 border-[3px] border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                        />
                        <span className="text-sm">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="border-2 border-[#0D4B2D] bg-[#106840] px-8 py-3 text-sm font-extrabold uppercase text-white shadow-[4px_4px_0px_0px_#0D4B2D] transition-all hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Product"}
              </button>
              <button 
                type="button"
                onClick={() => router.push("/dotadmin/big-sell")}
                className="border-2 border-[#0D4B2D]/40 bg-[#FDFBF7] px-8 py-3 text-sm font-extrabold uppercase text-[#0D4B2D] shadow-[4px_4px_0px_0px_rgba(13,75,45,0.2)] transition-all hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400 hover:shadow-[5px_5px_0px_0px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Form Area (Images & Categories) */}
        <div className="w-full lg:w-[350px] flex flex-col gap-8">
          <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-4 text-black">Brand</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="brand" className="text-sm font-black uppercase text-black">Select Brand</label>
                <select 
                  id="brand" 
                  value={brandId}
                  onChange={(e) => setBrandId(Number(e.target.value) || "")}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="">Select a brand</option>
                  {availableBrands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-4 text-black">Organization</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="status" className="text-sm font-black uppercase text-black">Status</label>
                <select 
                  id="status" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-sm font-black uppercase text-black">Category</label>
                <select 
                  id="category" 
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value) || "")}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="">Select a category</option>
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="subCategory" className="text-sm font-black uppercase text-black">Sub Category</label>
                <select 
                  id="subCategory" 
                  value={subCategoryId}
                  onChange={(e) => setSubCategoryId(Number(e.target.value) || "")}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="">Select a sub-category</option>
                  {filteredSubCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-4 text-black">Product Images</h3>
            <div className="flex flex-col gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUpload(e.target.files[0], true);
                  }
                }}
              />
              <input 
                type="file" 
                ref={galleryInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUpload(e.target.files[0], false);
                  }
                }}
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative border-[3px] border-dashed border-black p-8 flex flex-col items-center justify-center bg-white hover:bg-gray-100 transition-all cursor-pointer rounded-none text-center min-h-[200px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 text-black"
              >
                {thumbnail ? (
                  <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-contain absolute inset-0 p-2" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="font-medium text-gray-600 dark:text-gray-300 text-sm">
                      {isUploading ? "Uploading..." : "Upload Main Image"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">4:5 ratio recommended</p>
                  </>
                )}
              </div>

              {galleryImages.map((url, index) => (
                <div key={index} className="relative border-[3px] border-black h-[150px] flex flex-col items-center justify-center bg-white transition-all rounded-none text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-contain p-2" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryImages(galleryImages.filter(imgUrl => imgUrl !== url));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              <button 
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 border-[3px] border-[#3b82f6] p-4 bg-white hover:bg-blue-50 text-[#3b82f6] transition-all cursor-pointer rounded-none font-black text-sm disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 hover:-translate-x-1 uppercase"
              >
                <Plus className="w-4 h-4" />
                Add More Image
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
