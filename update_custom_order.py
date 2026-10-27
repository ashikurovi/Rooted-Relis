import os

content = """\"use client\";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, Shirt, Package, Coffee, CheckCircle2, ArrowLeft } from "lucide-react";
import { getAllCustomProducts } from "@/api/customproductsApi";
import { createCustomOrder } from "@/api/customOrderApi";

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
    image: p.image?.startsWith('http') ? p.image : `https://codegrid-api.vercel.app${p.image?.startsWith('/') ? '' : '/'}${p.image}`
  }));

  const bottleOptions = products.filter(p => p.category === "Bottles").map(p => ({
    id: p.id,
    name: p.productName,
    price: p.price,
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

  useEffect(() => {
    if (selectedPackage) {
      setDetails(`I am interested in ordering the ${selectedPackage.name}.`);
    } else if (selectedBaseItem) {
      setDetails(`I want to customize the ${selectedBaseItem.name} (${selectedBaseItem.price}).`);
    } else {
      setDetails("");
    }
  }, [selectedPackage, selectedBaseItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !quantity) {
      alert("Please fill out Name, Phone, and Quantity.");
      return;
    }

    const itemStr = selectedPackage ? selectedPackage.name : selectedBaseItem ? selectedBaseItem.name : "Unspecified";

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
      });
      alert("Custom order requested successfully!");
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setQuantity("");
      setDetails("");
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
    <div className=\"min-h-screen flex flex-col font-sans bg-white\">
      <main className=\"flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12\">
        {/* Header */}
        <div className=\"text-center mb-16 flex flex-col items-center\">
          <h1 className=\"text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 uppercase tracking-tighter\">
            Custom & Bulk Orders
          </h1>
          <p className=\"text-gray-600 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed\">
            Design your own custom t-shirts, bottles, and corporate gifts. Perfect for events, teams, and corporate branding. Upload your own design or choose from our templates.
          </p>
        </div>

        {/* Category Selector */}
        <div className=\"flex justify-center flex-wrap gap-4 mb-16\">
          <button
            onClick={() => handleCategoryChange(\"Apparel\")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold uppercase tracking-widest text-sm transition-colors rounded-full ${selectedCategory === \"Apparel\"
              ? \"bg-black text-white\"
              : \"bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black\"
              }`}
          >
            <Shirt className=\"w-5 h-5\" /> T-Shirts & Apparel
          </button>
          <button
            onClick={() => handleCategoryChange(\"Bottles\")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold uppercase tracking-widest text-sm transition-colors rounded-full ${selectedCategory === \"Bottles\"
              ? \"bg-black text-white\"
              : \"bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black\"
              }`}
          >
            <Coffee className=\"w-5 h-5\" /> Mugs & Bottles
          </button>
          <button
            onClick={() => handleCategoryChange(\"Corporate\")}
            className={`flex items-center gap-2 px-6 py-3 font-semibold uppercase tracking-widest text-sm transition-colors rounded-full ${selectedCategory === \"Corporate\"
              ? \"bg-black text-white\"
              : \"bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black\"
              }`}
          >
            <Package className=\"w-5 h-5\" /> Corporate Packages
          </button>
        </div>

        <div className=\"flex flex-col lg:flex-row gap-12\">
          {/* Left Side: Product / Package Customization */}
          <div className=\"flex-1 space-y-12\">
            
            {loadingProducts ? (
              <div className=\"flex justify-center py-20 text-gray-500 font-medium\">Loading custom options...</div>
            ) : (
              <>
                {/* Conditional Content based on Category */}
                {selectedCategory !== \"Corporate\" && (
                  <div className=\"bg-white animate-in fade-in duration-500\">
                    <h3 className=\"text-xl font-bold text-black uppercase tracking-widest mb-6\">1. Choose Your Item</h3>
                    <div className=\"grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12\">
                      {(selectedCategory === \"Apparel\" ? apparelOptions : bottleOptions).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedBaseItem(item)}
                          className={`cursor-pointer transition-all overflow-hidden border-[1px] ${selectedBaseItem?.id === item.id
                            ? \"border-black shadow-md ring-1 ring-black\"
                            : \"border-gray-200 hover:border-gray-300 hover:shadow-sm\"
                            }`}
                        >
                          <div className=\"aspect-square bg-gray-50 relative overflow-hidden\">
                            {item.image && item.image !== 'null' && item.image !== 'undefined' ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className=\"w-full h-full object-cover\"
                                />
                            ) : (
                                <div className=\"w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium\">NO IMG</div>
                            )}
                          </div>
                          <div className={`p-4 text-center transition-colors ${selectedBaseItem?.id === item.id ? \"bg-black text-white\" : \"bg-white text-black\"}`}>
                            <div className=\"text-xs font-bold uppercase tracking-widest mb-1\">{item.name}</div>
                            <div className={`text-xs font-semibold ${selectedBaseItem?.id === item.id ? \"text-gray-300\" : \"text-gray-500\"}`}>{item.price}</div>
                          </div>
                        </div>
                      ))}
                      {(selectedCategory === \"Apparel\" ? apparelOptions : bottleOptions).length === 0 && (
                          <div className=\"col-span-full py-10 text-center text-gray-500 font-medium border-[1px] border-dashed border-gray-300 rounded-lg\">No items available in this category yet.</div>
                      )}
                    </div>

                    <h3 className=\"text-xl font-bold text-black uppercase tracking-widest mb-6\">2. Upload Your Design</h3>
                    <div className=\"border-[1px] border-dashed border-gray-300 p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer rounded-lg text-center\">
                      <div className=\"w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-gray-500\">
                        <Upload className=\"w-6 h-6\" />
                      </div>
                      <p className=\"font-semibold uppercase tracking-widest text-sm mb-2 text-black\">Click to upload your logo</p>
                      <p className=\"text-xs font-medium text-gray-500\">Supports PNG, SVG, JPG (Max 5MB)</p>
                    </div>
                  </div>
                )}

                {selectedCategory === \"Corporate\" && !selectedPackageId && (
                  <div className=\"space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500\">
                    <h3 className=\"text-2xl font-bold text-black uppercase tracking-tighter\">Select a Corporate Package</h3>
                    <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
                      {corporatePackages.map((pkg) => (
                        <div key={pkg.id} className=\"bg-white border-[1px] border-gray-200 flex flex-col hover:shadow-lg hover:border-gray-300 transition-all rounded-lg overflow-hidden\">
                          <div className=\"p-8 flex flex-col flex-1\">
                            <h4 className=\"text-xl font-bold uppercase tracking-tighter mb-4 pb-4 border-b-[1px] border-gray-100 text-black\">{pkg.name}</h4>
                            <div className=\"text-lg font-semibold text-gray-600 mb-8\">{pkg.price}</div>
                            <ul className=\"space-y-4 mb-10 flex-1\">
                              {pkg.items.map((item: any, i: number) => (
                                <li key={i} className=\"flex items-center gap-3 text-xs font-semibold text-gray-600 uppercase tracking-widest\">
                                  <CheckCircle2 className=\"w-4 h-4 text-gray-400 shrink-0\" /> {item.name || item}
                                </li>
                              ))}
                            </ul>
                            <button
                              onClick={() => setSelectedPackageId(pkg.id)}
                              className=\"w-full bg-black text-white font-semibold text-xs uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors rounded-md\"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                      {corporatePackages.length === 0 && (
                          <div className=\"col-span-full py-10 text-center text-gray-500 font-medium border-[1px] border-dashed border-gray-300 rounded-lg\">No corporate packages available yet.</div>
                      )}
                    </div>
                  </div>
                )}

                {selectedCategory === \"Corporate\" && selectedPackage && (
                  <div className=\"bg-white animate-in fade-in slide-in-from-right-8 duration-500\">
                    <button
                      onClick={() => setSelectedPackageId(null)}
                      className=\"group flex items-center w-max text-gray-500 font-semibold uppercase tracking-widest text-xs hover:text-black transition-colors mb-10\"
                    >
                      <ArrowLeft className=\"w-4 h-4 mr-2\" />
                      Back to Packages
                    </button>

                    <div className=\"flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 border-[1px] border-gray-200 p-6 rounded-lg bg-gray-50\">
                      <div>
                        <h3 className=\"text-2xl md:text-3xl font-bold text-black uppercase tracking-tighter\">{selectedPackage.name}</h3>
                        <p className=\"text-gray-600 font-medium mt-2 max-w-lg text-sm\">{selectedPackage.description}</p>
                      </div>
                      <div className=\"text-right sm:text-left shrink-0\">
                        <span className=\"block text-xs font-semibold uppercase tracking-widest mb-1 text-gray-500\">Package Price</span>
                        <span className=\"text-2xl font-bold text-black\">{selectedPackage.price}</span>
                      </div>
                    </div>

                    <h4 className=\"font-bold text-black mb-6 uppercase tracking-widest text-sm\">Package Contents</h4>
                    <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 mb-12\">
                      {selectedPackage.items.map((item: any, idx: number) => {
                          let imgUrl = item.imageUrl || null;
                          if (imgUrl && !imgUrl.startsWith('http')) {
                            imgUrl = `https://codegrid-api.vercel.app${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
                          }
                          return (
                            <div key={idx} className=\"border-[1px] border-gray-200 overflow-hidden bg-white rounded-lg\">
                              <div className=\"aspect-square relative overflow-hidden bg-gray-50\">
                                {imgUrl ? (
                                    <img
                                      src={imgUrl}
                                      alt={item.name || item}
                                      className=\"w-full h-full object-cover\"
                                    />
                                ) : (
                                    <div className=\"w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium\">NO IMG</div>
                                )}
                              </div>
                              <div className=\"p-4 text-center border-t-[1px] border-gray-100\">
                                <p className=\"text-[10px] font-bold uppercase tracking-widest text-gray-600\">{item.name || item}</p>
                              </div>
                            </div>
                          )
                      })}
                    </div>

                    <div className=\"bg-gray-900 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 text-white rounded-lg\">
                      <div>
                        <h5 className=\"font-bold text-xl uppercase tracking-tighter mb-2\">Ready to order this package?</h5>
                        <p className=\"text-sm font-medium text-gray-300\">Provide your branding details below and fill out the request form on the right.</p>
                      </div>
                      <div className=\"w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center shrink-0\">
                        <Package className=\"w-6 h-6\" />
                      </div>
                    </div>

                    <h4 className=\"font-bold text-black mb-6 uppercase tracking-widest text-sm\">Design & Branding Details</h4>
                    <div className=\"space-y-8\">
                      <div>
                        <label className=\"block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3\">Upload Brand Logo or Assets</label>
                        <div className=\"border-[1px] border-dashed border-gray-300 p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer rounded-lg text-center\">
                          <div className=\"w-12 h-12 bg-white rounded-full text-gray-500 flex items-center justify-center mb-4 shadow-sm\">
                            <Upload className=\"w-5 h-5\" />
                          </div>
                          <p className=\"font-semibold uppercase tracking-widest text-sm mb-2 text-black\">Click to upload files</p>
                          <p className=\"text-xs font-medium text-gray-500\">Supports PNG, SVG, AI (Max 10MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Side: Order Request Form */}
          <div className=\"w-full lg:w-1/3\">
            <div className=\"bg-gray-50 p-8 sm:p-10 border-[1px] border-gray-200 rounded-lg sticky top-24\">
              <h3 className=\"text-2xl font-bold text-black uppercase tracking-tighter mb-4\">Request a Quote</h3>
              <p className=\"text-sm font-medium text-gray-600 mb-8 border-b-[1px] border-gray-200 pb-6\">Fill out the details below and our team will get back to you with pricing.</p>

              <form className=\"space-y-6\" onSubmit={handleSubmit}>
                <div>
                  <label className=\"block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3\">Name / Company Name <span className=\"text-red-500\">*</span></label>
                  <input type=\"text\" value={customerName} onChange={e => setCustomerName(e.target.value)} required className=\"w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md\" placeholder=\"Enter your name or company\" />
                </div>

                <div className=\"flex flex-col sm:flex-row gap-4\">
                  <div className=\"flex-1\">
                    <label className=\"block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3\">Phone <span className=\"text-red-500\">*</span></label>
                    <input type=\"text\" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required className=\"w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md\" placeholder=\"+880...\" />
                  </div>
                  <div className=\"w-full sm:w-1/3\">
                    <label className=\"block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3\">Qty <span className=\"text-red-500\">*</span></label>
                    <input type=\"number\" min=\"1\" value={quantity} onChange={e => setQuantity(Number(e.target.value) || \"\")} required className=\"w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md\" placeholder=\"Min. 10\" />
                  </div>
                </div>
                
                <div>
                  <label className=\"block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3\">Email (Optional)</label>
                  <input type=\"email\" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className=\"w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md\" placeholder=\"your@email.com\" />
                </div>

                <div>
                  <label className=\"block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3\">Additional Details & Request Info</label>
                  <textarea
                    rows={4}
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    className=\"w-full bg-white border-[1px] border-gray-300 py-3 px-4 text-sm font-medium text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 rounded-md\"
                    placeholder=\"Tell us about colors, sizes, or special requirements...\"
                  ></textarea>
                </div>

                <div className=\"pt-4\">
                  <button type=\"submit\" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} text-white font-semibold text-sm uppercase tracking-widest py-4 transition-colors rounded-md flex items-center justify-center gap-2`}>
                    {isSubmitting ? (
                        <>
                            <svg className=\"animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\">
                              <circle className=\"opacity-25\" cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" strokeWidth=\"4\"></circle>
                              <path className=\"opacity-75\" fill=\"currentColor\" d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\"></path>
                            </svg>
                            Submitting...
                        </>
                    ) : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
"""

with open('src/app/(front)/main/custom-order/page.tsx', 'w') as f:
    f.write(content)
