"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, Shirt, Package, Coffee, CheckCircle2, ArrowLeft } from "lucide-react";
import { getAllCustomProducts } from "@/api/customproductsApi";
import { createCustomOrder } from "@/api/customOrderApi";
import { uploadImage } from "@/api/cdnApi";


export default function CustomOrderPage() {
  const [selectedCategory, setSelectedCategory] = useState("Apparel");
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [selectedBaseItem, setSelectedBaseItem] = useState<any | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [details, setDetails] = useState("");
  const [printOption, setPrintOption] = useState<"dtf" | "a4">("dtf");
  const [designReference, setDesignReference] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      const uploadedUrl = res?.data?.url ?? res?.url;
      if (uploadedUrl) {
        let url = uploadedUrl;
        if (!url.startsWith('http')) {
          url = `https://codegrid-api.vercel.app${url.startsWith('/') ? '' : '/'}${url}`;
        }
        setDesignReference(url);
        alert("Design uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };


  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllCustomProducts();
        if (res && res.data) {
          setProducts(res.data);
        } else if (Array.isArray(res)) {
          setProducts(res);
        }
      } catch (err) {
        console.error("Failed to load custom products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const apparelOptions = products.filter(p => p.category === "Apparel").map(p => ({
    id: p.id,
    name: p.productName,
    price: p.price,
    dtfPrintCost: p.dtfPrintCost ?? 60,
    a4PrintCost: p.a4PrintCost ?? 150,
    image: p.image?.startsWith('http') ? p.image : `https://codegrid-api.vercel.app${p.image?.startsWith('/') ? '' : '/'}${p.image}`
  }));

  const bottleOptions = products.filter(p => p.category === "Bottles").map(p => ({
    id: p.id,
    name: p.productName,
    price: p.price,
    dtfPrintCost: p.dtfPrintCost ?? 60,
    a4PrintCost: p.a4PrintCost ?? 150,
    image: p.image?.startsWith('http') ? p.image : `https://codegrid-api.vercel.app${p.image?.startsWith('/') ? '' : '/'}${p.image}`
  }));

  const corporatePackages = products.filter(p => p.category === "Corporate").map(p => ({
    id: p.id,
    name: p.productName,
    price: p.price,
    description: p.description,
    items: p.packageItems || [],
  }));




  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedPackageId(null);
    setSelectedBaseItem(null);
  };

  const selectedPackage = corporatePackages.find(p => p.id === selectedPackageId);

  let estimatedPrice = 0;
  const qtyNum = Number(quantity) || 0;
  if (selectedPackage) {
    const pStr = String(selectedPackage.price).replace(/[^0-9.]/g, '');
    estimatedPrice = (Number(pStr) || 0) * qtyNum;
  } else if (selectedBaseItem) {
    const pStr = String(selectedBaseItem.price).replace(/[^0-9.]/g, '');
    const baseP = Number(pStr) || 0;
    const printCost = Number(printOption === "a4" ? selectedBaseItem.a4PrintCost : selectedBaseItem.dtfPrintCost) || 0;
    estimatedPrice = (baseP + printCost) * qtyNum;
  }

  useEffect(() => {
    if (selectedPackage) {
      setDetails(`I am interested in ordering the ${selectedPackage.name}.`);
    } else if (selectedBaseItem) {
      setDetails(`I want to customize the ${selectedBaseItem.name} (${selectedBaseItem.price}).`);
    } else {
      setDetails("");
    }
  }, [selectedPackage, selectedBaseItem]);


  const printInvoice = (orderData: any, estPrice: number) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Custom Quote Invoice</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 40px; }
            .header h1 { margin: 0; text-transform: uppercase; letter-spacing: 2px; }
            .details { margin-bottom: 40px; }
            .details p { margin: 5px 0; font-size: 14px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .table th { background: #f9f9f9; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
            .total { text-align: right; font-size: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Custom Quote Request</h1>
          </div>
          <div class="details">
            <p><strong>Name:</strong> ${orderData.customerName}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
            <p><strong>Email:</strong> ${orderData.customerEmail}</p>
            <p><strong>Category:</strong> ${orderData.category}</p>
            <p><strong>Status:</strong> <span style="background: #333; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; text-transform: uppercase;">New Request</span></p>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Details</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${orderData.item}</td>
                <td>${orderData.quantity}</td>
                <td>${orderData.category === 'Corporate' ? 'Package Price' : 'Base Item + Print Cost (' + (printOption === "a4" ? selectedBaseItem?.a4PrintCost : selectedBaseItem?.dtfPrintCost) + ' BDT)'}</td>
                <td>৳ ${estPrice.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Total Estimated: ৳ ${estPrice.toLocaleString()}
          </div>
          <p style="margin-top: 50px; font-size: 12px; color: #777;">Thank you for requesting a quote. Our team will contact you shortly to confirm the details and proceed with the order.</p>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !quantity) {
      alert("Please fill out Name, Phone, and Quantity.");
      return;
    }

    const itemStr = selectedPackage ? selectedPackage.name : selectedBaseItem ? selectedBaseItem.name : "Unspecified";
    const cProductId = selectedPackageId || selectedBaseItem?.id || undefined;

    setIsSubmitting(true);
    try {
      await createCustomOrder({
        customerName,
        customerPhone,
        customerEmail: customerEmail || "Not provided",
        category: selectedCategory,
        item: itemStr,
        quantity: Number(quantity),
        details: details,
        designReference: designReference || undefined,
        customProductId: cProductId ? Number(cProductId) : undefined,
      });
      alert("Custom order requested successfully!");
      printInvoice({
        customerName,
        customerPhone,
        customerEmail: customerEmail || "Not provided",
        category: selectedCategory,
        item: itemStr,
        quantity: Number(quantity)
      }, estimatedPrice);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setQuantity("");
      setDetails("");
      setDesignReference("");
      setSelectedPackageId(null);
      setSelectedBaseItem(null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 uppercase tracking-tighter">
            Custom & Bulk Orders
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Design your own custom t-shirts, bottles, and corporate gifts. Perfect for events, teams, and corporate branding. Upload your own design or choose from our templates.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex justify-center flex-wrap gap-4 mb-16">
          <button
            onClick={() => handleCategoryChange("Apparel")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold uppercase tracking-widest text-sm transition-colors rounded-full ${selectedCategory === "Apparel"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
              }`}
          >
            <Shirt className="w-5 h-5" /> T-Shirts & Apparel
          </button>
          <button
            onClick={() => handleCategoryChange("Bottles")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold uppercase tracking-widest text-sm transition-colors rounded-full ${selectedCategory === "Bottles"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
              }`}
          >
            <Coffee className="w-5 h-5" /> Mugs & Bottles
          </button>
          <button
            onClick={() => handleCategoryChange("Corporate")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold uppercase tracking-widest text-sm transition-colors rounded-full ${selectedCategory === "Corporate"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
              }`}
          >
            <Package className="w-5 h-5" /> Corporate Packages
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side: Product / Package Customization */}
          <div className="flex-1 space-y-12">

            {loadingProducts ? (
              <div className="animate-in fade-in duration-500">
                <h3 className="mb-6 text-xl font-bold uppercase tracking-widest text-black">1. Choose Your Item</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse overflow-hidden border border-gray-200 bg-white">
                      <div className="aspect-square w-full bg-slate-200" />
                      <div className="p-4">
                        <div className="mb-2 h-3 w-2/3 rounded bg-slate-200" />
                        <div className="h-3 w-1/3 rounded bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Conditional Content based on Category */}
                {selectedCategory !== "Corporate" && (
                  <div className="bg-white animate-in fade-in duration-500">
                    <h3 className="text-xl font-bold text-black uppercase tracking-widest mb-6">1. Choose Your Item</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">
                      {(selectedCategory === "Apparel" ? apparelOptions : bottleOptions).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedBaseItem(item)}
                          className={`cursor-pointer transition-all overflow-hidden border-[1px] ${selectedBaseItem?.id === item.id
                            ? "border-black shadow-md ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                        >
                          <div className="aspect-square bg-gray-50 relative overflow-hidden">
                            {item.image && item.image !== 'null' && item.image !== 'undefined' ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">NO IMG</div>
                            )}
                          </div>
                          <div className={`p-4 text-center transition-colors ${selectedBaseItem?.id === item.id ? "bg-black text-white" : "bg-white text-black"}`}>
                            <div className="text-xs font-bold uppercase tracking-widest mb-1">{item.name}</div>
                            <div className={`text-xs font-semibold ${selectedBaseItem?.id === item.id ? "text-gray-300" : "text-gray-500"}`}>{item.price}</div>
                          </div>
                        </div>
                      ))}
                      {(selectedCategory === "Apparel" ? apparelOptions : bottleOptions).length === 0 && (
                        <div className="col-span-full py-10 text-center text-gray-500 font-medium border-[1px] border-dashed border-gray-300 rounded-lg">No items available in this category yet.</div>
                      )}
                    </div>

                  </div>
                )}

                {selectedCategory === "Corporate" && !selectedPackageId && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-2xl font-bold text-black uppercase tracking-tighter">Select a Corporate Package</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {corporatePackages.map((pkg) => (
                        <div key={pkg.id} className="bg-white border-[1px] border-gray-200 flex flex-col hover:shadow-lg hover:border-gray-300 transition-all rounded-lg overflow-hidden">
                          <div className="p-8 flex flex-col flex-1">
                            <h4 className="text-xl font-bold uppercase tracking-tighter mb-4 pb-4 border-b-[1px] border-gray-100 text-black">{pkg.name}</h4>
                            <div className="text-lg font-semibold text-gray-600 mb-8">{pkg.price}</div>
                            <ul className="space-y-4 mb-10 flex-1">
                              {pkg.items.map((item: any, i: number) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-semibold text-gray-600 uppercase tracking-widest">
                                  <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0" /> {item.name || item}
                                </li>
                              ))}
                            </ul>
                            <button
                              onClick={() => setSelectedPackageId(pkg.id)}
                              className="w-full bg-black text-white font-semibold text-xs uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors rounded-md"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                      {corporatePackages.length === 0 && (
                        <div className="col-span-full py-10 text-center text-gray-500 font-medium border-[1px] border-dashed border-gray-300 rounded-lg">No corporate packages available yet.</div>
                      )}
                    </div>
                  </div>
                )}

                {selectedCategory === "Corporate" && selectedPackage && (
                  <div className="bg-white animate-in fade-in slide-in-from-right-8 duration-500">
                    <button
                      onClick={() => setSelectedPackageId(null)}
                      className="group flex items-center w-max text-gray-500 font-semibold uppercase tracking-widest text-xs hover:text-black transition-colors mb-10"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Packages
                    </button>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 border-[1px] border-gray-200 p-6 rounded-lg bg-gray-50">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-black uppercase tracking-tighter">{selectedPackage.name}</h3>
                        <p className="text-gray-600 font-medium mt-2 max-w-lg text-sm">{selectedPackage.description}</p>
                      </div>
                      <div className="text-right sm:text-left shrink-0">
                        <span className="block text-xs font-semibold uppercase tracking-widest mb-1 text-gray-500">Package Price</span>
                        <span className="text-2xl font-bold text-black">{selectedPackage.price}</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-black mb-6 uppercase tracking-widest text-sm">Package Contents</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                      {selectedPackage.items.map((item: any, idx: number) => {
                        let imgUrl = item.imageUrl || null;
                        if (imgUrl && !imgUrl.startsWith('http')) {
                          imgUrl = `https://codegrid-api.vercel.app${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
                        }
                        return (
                          <div key={idx} className="border-[1px] border-gray-200 overflow-hidden bg-white rounded-lg">
                            <div className="aspect-square relative overflow-hidden bg-gray-50">
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={item.name || item}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">NO IMG</div>
                              )}
                            </div>
                            <div className="p-4 text-center border-t-[1px] border-gray-100">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{item.name || item}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="bg-gray-900 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 text-white rounded-lg">
                      <div>
                        <h5 className="font-bold text-xl uppercase tracking-tighter mb-2">Ready to order this package?</h5>
                        <p className="text-sm font-medium text-gray-300">Provide your branding details below and fill out the request form on the right.</p>
                      </div>
                      <div className="w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6" />
                      </div>
                    </div>

                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Side: Order Request Form */}
          <div className="w-full lg:w-1/3">
            {(selectedBaseItem || selectedPackageId) ? (
              <div className="bg-gray-50 p-8 sm:p-10 border-[1px] border-gray-200 rounded-lg sticky top-24 animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-black uppercase tracking-tighter mb-4">Request a Quote</h3>
                <p className="text-sm font-medium text-gray-600 mb-8 border-b-[1px] border-gray-200 pb-6">Fill out the details below and our team will get back to you with pricing.</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Name / Company Name <span className="text-red-500">*</span></label>
                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md" placeholder="Enter your name or company" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Phone <span className="text-red-500">*</span></label>
                      <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md" placeholder="+880..." />
                    </div>
                    <div className="w-full sm:w-1/3">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Qty <span className="text-red-500">*</span></label>
                      <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value) || "")} required className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md" placeholder="Min. 10" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Email (Optional)</label>
                    <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md" placeholder="your@email.com" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Upload Design (Optional)</label>
                    <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-[1px] border-dashed border-gray-300 bg-white px-4 py-4 text-sm font-semibold text-gray-600 transition-colors hover:border-black hover:text-black">
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? "Uploading..." : designReference ? "Change Design Image" : "Choose Design Image"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                        className="sr-only"
                      />
                    </label>
                    {designReference && (
                      <div className="mt-4 overflow-hidden rounded-md border border-gray-200 bg-white">
                        <img src={designReference} alt="Uploaded design preview" className="max-h-48 w-full object-contain" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Additional Details & Request Info</label>
                    <textarea
                      rows={4}
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      className="w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md"
                      placeholder="Tell us about colors, sizes, or special requirements..."
                    ></textarea>
                  </div>

                  {selectedCategory !== 'Corporate' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Print Options</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className={`flex-1 border-[1px] p-4 rounded-md cursor-pointer transition-colors flex items-center gap-3 ${printOption === 'dtf' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                          <input type="radio" name="printOption" value="dtf" checked={printOption === 'dtf'} onChange={() => setPrintOption('dtf')} className="w-4 h-4 text-black focus:ring-black border-gray-300" />
                          <div>
                            <span className="block text-sm font-bold text-black uppercase tracking-tighter">DTF Print</span>
                            <span className="block text-xs font-medium text-gray-500">+৳{selectedBaseItem?.dtfPrintCost ?? 60} per item</span>
                          </div>
                        </label>
                        <label className={`flex-1 border-[1px] p-4 rounded-md cursor-pointer transition-colors flex items-center gap-3 ${printOption === 'a4' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                          <input type="radio" name="printOption" value="a4" checked={printOption === 'a4'} onChange={() => setPrintOption('a4')} className="w-4 h-4 text-black focus:ring-black border-gray-300" />
                          <div>
                            <span className="block text-sm font-bold text-black uppercase tracking-tighter">Custom Design A4 & DTF Print</span>
                            <span className="block text-xs font-medium text-gray-500">+৳{selectedBaseItem?.a4PrintCost ?? 150} per item</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {estimatedPrice > 0 && (
                    <div className="bg-gray-100 p-5 rounded-md flex justify-between items-center border-[1px] border-gray-200">
                      <span className="text-sm font-bold uppercase tracking-widest text-gray-700">Estimated Total:</span>
                      <span className="text-xl font-black text-black">৳ {estimatedPrice.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-4">
                    <button type="submit" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} text-white font-semibold text-sm uppercase tracking-widest py-4 transition-colors rounded-md flex items-center justify-center gap-2`}>
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 sm:p-10 border-[1px] border-dashed border-gray-300 rounded-lg sticky top-24 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-gray-400">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 uppercase tracking-tighter mb-2">Select a Product</h3>
                <p className="text-sm font-medium text-gray-400 max-w-[250px]">Choose an apparel item, bottle, or corporate package from the left to request a custom quote.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
