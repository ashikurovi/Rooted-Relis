"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { createCustomProduct } from "../../../../api/customproductsApi";
import { uploadImage } from "../../../../api/cdnApi";

export default function AddCustomProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingPackageItemIndex, setUploadingPackageItemIndex] = useState<number | null>(null);
  
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Apparel");
  const [price, setPrice] = useState("");
  const [dtfPrintCost, setDtfPrintCost] = useState("60");
  const [a4PrintCost, setA4PrintCost] = useState("150");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [packageItems, setPackageItems] = useState([{ name: "", imageUrl: "" }]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setIsUploading(true);
        const file = e.target.files[0];
        const result = await uploadImage(file);
        if (result && result.data && result.data.url) {
          setImage(result.data.url);
        } else {
          alert("Failed to upload image: Invalid response");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("An error occurred during upload");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handlePackageItemImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploadingPackageItemIndex(index);
        const file = e.target.files[0];
        const result = await uploadImage(file);
        if (result && result.data && result.data.url) {
          handlePackageItemChange(index, "imageUrl", result.data.url);
        } else {
          alert("Failed to upload image: Invalid response");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("An error occurred during upload");
      } finally {
        setUploadingPackageItemIndex(null);
      }
    }
  };

  const handlePackageItemChange = (index: number, field: "name" | "imageUrl", value: string) => {
    const newItems = [...packageItems];
    newItems[index][field] = value;
    setPackageItems(newItems);
  };

  const handleAddPackageItem = () => {
    setPackageItems([...packageItems, { name: "", imageUrl: "" }]);
  };

  const handleRemovePackageItem = (index: number) => {
    const newItems = packageItems.filter((_, i) => i !== index);
    setPackageItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !category || !price || !status) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload: any = {
        productName,
        category,
        price,
        dtfPrintCost: Number(dtfPrintCost) || 0,
        a4PrintCost: Number(a4PrintCost) || 0,
        status,
        description,
        image
      };

      if (category === "Corporate") {
        payload.packageItems = packageItems.filter(item => item.name.trim() !== "");
      }

      await createCustomProduct(payload);
      
      alert("Custom product added successfully!");
      router.push("/dotadmin/custom-products");
    } catch (error) {
      console.error("Failed to add custom product:", error);
      alert("Failed to add custom product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/dotadmin/custom-products" className="text-black hover:text-[#3b82f6] flex items-center justify-center p-2 border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-black">Add Custom Product</h1>
      </div>

      <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none max-w-4xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="productName" className="text-sm font-black uppercase text-black">Product Name *</label>
                <input 
                  type="text" 
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Classic T-Shirt" 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                  required
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-sm font-black uppercase text-black">Category *</label>
                <select 
                  id="category" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase"
                >
                  <option value="Apparel">Apparel</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Corporate">Corporate Packages</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="price" className="text-sm font-black uppercase text-black">Base Price & Unit *</label>
                <input 
                  type="text" 
                  id="price" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. ৳ 350 / pc" 
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black uppercase" 
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="status" className="text-sm font-black uppercase text-black">Status *</label>
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

              <div className="flex flex-col gap-2">
                <label htmlFor="dtfPrintCost" className="text-sm font-black uppercase text-black">DTF Print Cost (৳) *</label>
                <input
                  type="number"
                  min="0"
                  id="dtfPrintCost"
                  value={dtfPrintCost}
                  onChange={(e) => setDtfPrintCost(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="a4PrintCost" className="text-sm font-black uppercase text-black">A4 + DTF Print Cost (৳) *</label>
                <input
                  type="number"
                  min="0"
                  id="a4PrintCost"
                  value={a4PrintCost}
                  onChange={(e) => setA4PrintCost(e.target.value)}
                  className="w-full border-[3px] border-black p-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-0 rounded-none bg-white text-black"
                  required
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="description" className="text-sm font-black uppercase text-black">Description</label>
              <RichTextEditor
                id="description"
                value={description}
                onChange={(value) => setDescription(value)}
                placeholder="Write product description or package details..."
                minHeight="220px"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
            <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Product Image</h3>
            
            {image ? (
              <div className="relative w-48 h-48 border rounded-md overflow-hidden bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white text-gray-700 shadow-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 rounded-md p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                )}
                <p className="font-medium text-gray-600 dark:text-gray-300 text-sm">
                  {isUploading ? "Uploading..." : "Click to upload image"}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 2MB</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {category === "Corporate" && (
            <div className="flex flex-col gap-2 border-b pb-6 dark:border-gray-800">
              <h3 className="text-xl font-black uppercase mb-2 text-black border-b-4 border-black w-max pb-1">Package Items</h3>
              <p className="text-sm text-gray-500 mb-2">List the items included in this corporate package.</p>
              
              <div className="flex flex-col gap-3">
                {packageItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => handlePackageItemChange(index, "name", e.target.value)}
                      placeholder="Item Name (e.g. Premium Polo)" 
                      className="flex-1 border border-gray-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 dark:bg-gray-900 dark:border-gray-700" 
                    />
                    <div className="flex-1 flex items-center border border-gray-300 p-1 min-h-[42px] dark:bg-gray-900 dark:border-gray-700">
                      {item.imageUrl ? (
                        <div className="flex items-center gap-2 w-full px-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.imageUrl} alt="Item" className="w-8 h-8 object-cover rounded" />
                          <span className="text-xs text-gray-500 truncate flex-1">Image Uploaded</span>
                          <button 
                            type="button" 
                            onClick={() => handlePackageItemChange(index, "imageUrl", "")}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center gap-2 cursor-pointer w-full h-full justify-center text-sm text-gray-500 hover:text-gray-700">
                          {uploadingPackageItemIndex === index ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          <span>{uploadingPackageItemIndex === index ? "Uploading..." : "Upload Image"}</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={(e) => handlePackageItemImageUpload(index, e)}
                          />
                        </label>
                      )}
                    </div>
                    {packageItems.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemovePackageItem(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={handleAddPackageItem}
                  className="text-sm font-medium text-blue-600 self-start mt-2 hover:underline"
                >
                  + Add another item
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-4">
            <button 
              type="submit"
              disabled={isSubmitting || isUploading}
              className="border-2 border-[#0D4B2D] bg-[#106840] px-8 py-3 text-sm font-extrabold uppercase text-white shadow-[4px_4px_0px_0px_#0D4B2D] transition-all hover:bg-[#0D4B2D] hover:shadow-[5px_5px_0px_0px_#D9941E] hover:-translate-y-0.5 hover:-translate-x-0.5 rounded-md disabled:opacity-50"
            >
              {isUploading ? "Uploading Image..." : isSubmitting ? "Saving..." : "Save Product"}
            </button>
            <button 
              type="button"
              onClick={() => router.push("/dotadmin/custom-products")}
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
