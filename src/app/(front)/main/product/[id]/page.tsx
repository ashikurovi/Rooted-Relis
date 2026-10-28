"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronRight, ShieldCheck, RefreshCw, Lock, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { getProductById, getAllProducts } from "@/api/productApi";
import { getAllBudgetPicks } from "@/api/buget-pickApi";

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [activeTab, setActiveTab] = useState("DESCRIPTION");
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [budgetPicks, setBudgetPicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { items, addToCart, updateQuantity, removeFromCart, openCart } = useCartStore();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        if (res.data) {
          setProduct(res.data);
          if (res.data.sizes && res.data.sizes.length > 0) {
            setSelectedSize(res.data.sizes[0].name);
          }
          if (res.data.types && res.data.types.length > 0) {
            setSelectedType(res.data.types[0].name);
          }

          // Fetch related products from the same category
          if (res.data.category?.id) {
            const allRes = await getAllProducts();
            if (allRes.data) {
              const filtered = allRes.data.filter(
                (p: any) => p.category?.id === res.data.category.id && String(p.id) !== String(res.data.id)
              ).slice(0, 4);
              setRelatedProducts(filtered);
            }
          }

          // Fetch budget picks
          try {
            const budgetRes = await getAllBudgetPicks();
            if (budgetRes.data) {
              setBudgetPicks(budgetRes.data);
            }
          } catch (e) {
            console.error("Failed to fetch budget picks:", e);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:gap-3 sm:overflow-visible">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-20 w-20 flex-shrink-0 animate-pulse rounded-sm bg-slate-200 sm:h-20 sm:w-full" />
                ))}
              </div>
              <div className="order-1 h-80 w-full animate-pulse rounded-md bg-slate-200 sm:h-[520px] sm:flex-1" />
            </div>
          </div>

          <div className="space-y-5 pt-1 sm:space-y-6 sm:pt-2">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200 sm:w-28" />
            <div className="h-9 w-3/4 animate-pulse rounded bg-slate-200 sm:h-12" />
            <div className="h-7 w-28 animate-pulse rounded bg-slate-200 sm:h-8 sm:w-32" />
            <div className="space-y-3">
              <div className="h-3 w-full animate-pulse rounded bg-slate-200 sm:h-4" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200 sm:h-4" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200 sm:h-4" />
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2 sm:gap-3 sm:pt-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-10 animate-pulse rounded border border-slate-200 bg-slate-100 sm:h-12" />
              ))}
            </div>
            <div className="space-y-3 pt-3 sm:pt-4">
              <div className="h-3 w-20 animate-pulse rounded bg-slate-200 sm:h-4 sm:w-24" />
              <div className="h-11 w-full animate-pulse rounded bg-slate-200 sm:h-12" />
              <div className="h-11 w-full animate-pulse rounded bg-slate-200 sm:h-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 font-black uppercase text-xl text-red-500">Product not found!</div>;
  }

  // Parse images if needed
  let images = [];
  if (product.images) {
    if (Array.isArray(product.images)) {
      images = product.images;
    } else if (typeof product.images === 'string') {
      try {
        images = JSON.parse(product.images);
      } catch (e) {
        // fallback
      }
    }
  }

  if (images.length === 0 && product.thumbnail) {
    images = [product.thumbnail];
  }

  // Helper for image URLs
  const getImgUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `https://rooted-relis-f4g9.vercel.app${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const productImages = images.map(getImgUrl);
  const mainImage = productImages.length > 0 ? productImages[activeImage] || productImages[0] : "";
  const features = product.features || [];
  const sizes = product.sizes || [];
  const types = product.types || [];

  const isPreOrderProduct = product.category?.name?.toLowerCase().includes('pre order') || product.category?.name?.toLowerCase().includes('pre-order');

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-black">
      {/* Product JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.title,
            image: productImages,
            description: product.description ? product.description.replace(/<[^>]*>?/gm, "") : product.title,
            sku: `CG-${product.id}`,
            brand: {
              "@type": "Brand",
              name: "Rooted Relish",
            },
            offers: {
              "@type": "Offer",
              url: typeof window !== "undefined" ? window.location.href : `https://rootedrelish.com/main/product/${product.id}`,
              priceCurrency: "BDT",
              price: product.currentPrice || product.originalPrice || 0,
              availability: (product.stock > 0 || isPreOrderProduct) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: {
                "@type": "Organization",
                name: "Rooted Relish",
              },
            },
          }),
        }}
      />
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left Column: Images & Tabs */}
        <div className="w-full lg:w-1/2 flex flex-col gap-10">
          {/* Image Gallery */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-visible">
              {productImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 border-[1px] transition-colors bg-gray-100 ${activeImage === idx ? "border-black" : "border-transparent hover:border-gray-300"
                    }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="relative w-full aspect-[4/5] bg-gray-100 order-1 sm:order-2">
              {mainImage ? (
                <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-medium text-gray-400">No Image</div>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-4">
            <div className="flex gap-6 border-b-[1px] border-gray-200 pb-3">
              {["DESCRIPTION", "ADDITIONAL INFORMATION", "REVIEWS"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs sm:text-sm font-semibold tracking-wide uppercase transition-colors relative ${activeTab === tab ? "text-black" : "text-gray-400 hover:text-black"
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute -bottom-[13px] left-0 w-full h-[1px] bg-black"></span>
                  )}
                </button>
              ))}
            </div>
            <div className="py-6 text-sm text-gray-700 font-medium leading-relaxed space-y-4">
              {activeTab === "DESCRIPTION" && (
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description || "No description available." }} />
              )}
              {activeTab === "ADDITIONAL INFORMATION" && (
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.additionalInfo || "No additional info available." }} />
              )}
              {activeTab === "REVIEWS" && (
                <p className="italic text-gray-400">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-widest mb-6 space-x-2">
            <Link href="/" className="hover:text-black transition-colors">HOME</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/main/shop" className="hover:text-black transition-colors">SHOP</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black truncate max-w-[150px] sm:max-w-none">{product.category?.name || "Product"}</span>
          </nav>

          {/* Variant Label */}
          {product.variantLabel && (
            <div className="mb-4">
              <span className="bg-gray-100 text-black text-[10px] sm:text-xs font-semibold px-3 py-1 uppercase tracking-widest">
                {product.variantLabel}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 leading-tight uppercase tracking-tight text-black">{product.title}</h1>

          {/* SKU Display */}
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">
            SKU: <span className="text-black">{product.sku || `CG-${product.id}`}</span>
          </div>

          {/* Price */}
          <div className="flex items-end space-x-4 mb-8">
            <span className="text-black font-semibold text-3xl">৳{product.currentPrice || product.originalPrice}</span>
            {Number(product.originalPrice) > Number(product.currentPrice) && (
              <span className="text-gray-400 line-through text-lg font-medium mb-1">৳{product.originalPrice}</span>
            )}
          </div>

          {/* Short Description Features */}
          {features.length > 0 && (
            <ul className="list-disc pl-5 text-sm font-medium text-gray-700 mb-6 space-y-2">
              {features.map((feat: string, i: number) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          )}

          <button className="text-gray-500 hover:text-black underline text-xs font-semibold uppercase mb-8 self-start transition-colors">
            Size Chart
          </button>

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <span className="block text-sm font-semibold text-black mb-3 uppercase tracking-widest">Size</span>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size: any) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.name)}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-semibold border-[1px] transition-colors uppercase ${selectedSize === size.name
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-black border-gray-300 hover:border-black"
                      }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type Selector */}
          {types.length > 0 && (
            <div className="mb-10">
              <span className="block text-sm font-semibold text-black mb-3 uppercase tracking-widest">Type</span>
              <div className="flex flex-wrap gap-3">
                {types.map((type: any) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.name)}
                    className={`px-6 py-3 text-sm font-semibold uppercase border-[1px] transition-colors ${selectedType === type.name
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-black border-gray-300 hover:border-black"
                      }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-10">
            {(() => {
              const cartItem = items.find((i) => i.id === product.id);
              if (cartItem) {
                return (
                  <div className="flex items-center justify-between border-[1px] border-black bg-transparent w-full">
                    <button
                      className="px-6 py-4 font-medium text-xl hover:bg-gray-100 border-r-[1px] border-black transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        if (cartItem.quantity === 1) {
                          removeFromCart(cartItem.id);
                        } else {
                          updateQuantity(cartItem.id, cartItem.quantity - 1);
                        }
                      }}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-lg px-4">
                      {cartItem.quantity}
                    </span>
                    <button
                      className="px-6 py-4 font-medium text-xl hover:bg-gray-100 border-l-[1px] border-black transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        updateQuantity(cartItem.id, cartItem.quantity + 1);
                      }}
                      disabled={!isPreOrderProduct && cartItem.quantity >= product.stock}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                );
              }

              return (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (product.stock <= 0) return;
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.currentPrice || product.originalPrice,
                      image: mainImage,
                      quantity: 1,
                      isPreOrder: isPreOrderProduct,
                    });
                    openCart();
                  }}
                  disabled={!isPreOrderProduct && product.stock <= 0}
                  className="w-full bg-white text-[#106840] font-bold uppercase tracking-widest py-4 border-2 border-[#106840] hover:bg-emerald-50/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl shadow-sm"
                >
                  {(product.stock > 0 || isPreOrderProduct) ? (isPreOrderProduct ? "Pre Order Now" : "Add to Cart") : "Out of Stock"}
                </button>
              );
            })()}
            <button
              onClick={() => {
                if (!isPreOrderProduct && product.stock <= 0) return;
                const cartItem = items.find((i) => i.id === product.id);
                if (!cartItem) {
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.currentPrice || product.originalPrice,
                    image: mainImage,
                    quantity: 1,
                    isPreOrder: isPreOrderProduct,
                  });
                }
                router.push("/main/checkout");
              }}
              disabled={!isPreOrderProduct && product.stock <= 0}
              className="w-full bg-[#106840] text-white font-bold uppercase tracking-widest py-4 hover:bg-[#0D4B2D] disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl shadow-md shadow-[#106840]/20 hover:scale-[1.01]"
            >
              Buy Now
            </button>
            <button
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold uppercase tracking-widest py-4 hover:bg-[#1ebd5a] transition-all rounded-xl shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                const productUrl = window.location.href;
                const message = encodeURIComponent(`Hi, I'm interested in: ${product.title}\nPrice: ৳${product.currentPrice || product.originalPrice || 0}\nProduct ID: ${product.id}\nLink: ${productUrl}`);
                window.open(`https://wa.me/8801942142346?text=${message}`, '_blank');
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Order via WhatsApp
            </button>
          </div>

          {/* Shipping & Trust Info */}
          <div className="space-y-3 text-sm text-gray-700 mb-8 font-medium bg-gray-50 p-5 rounded-sm">
            <p className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Nationwide Delivery via Pathao Courier
            </p>
            <p className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Fast and Reliable Delivery
            </p>
            <p className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Trusted by 100,000+ Customers
            </p>
          </div>

          {/* Value Props Box */}
          <div className="grid grid-cols-3 divide-x-[1px] divide-gray-200 mb-12 border-y-[1px] border-gray-200 py-4">
            <div className="flex flex-col items-center justify-center p-2 text-center gap-2 text-black">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              <div className="text-[10px] font-semibold uppercase">AAZ Guarantee<br /><span className="text-gray-500 font-medium">Quality Trust</span></div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center gap-2 text-black">
              <RefreshCw className="w-5 h-5 text-gray-400" />
              <div className="text-[10px] font-semibold uppercase">Easy Exchange<br /><span className="text-gray-500 font-medium">Free Returns</span></div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center gap-2 text-black">
              <Lock className="w-5 h-5 text-gray-400" />
              <div className="text-[10px] font-semibold uppercase">Secure Pay<br /><span className="text-gray-500 font-medium">Trusted E-Com</span></div>
            </div>
          </div>

          {/* Most Wanted Section */}
          {relatedProducts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-6 border-b-[1px] border-gray-200 pb-3 text-black">
                Most Wanted in this category
              </h3>
              <div className="flex flex-col gap-4">
                {relatedProducts.map((rp) => {
                  let rpImgUrl = rp.thumbnail;
                  if (!rpImgUrl && rp.images) {
                    if (Array.isArray(rp.images) && rp.images.length > 0) {
                      rpImgUrl = rp.images[0];
                    } else if (typeof rp.images === 'string') {
                      try {
                        const parsed = JSON.parse(rp.images);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          rpImgUrl = parsed[0];
                        }
                      } catch (e) { }
                    }
                  }
                  rpImgUrl = getImgUrl(rpImgUrl);

                  return (
                    <div key={rp.id} className="group flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-[1px] border-transparent hover:border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-14 overflow-hidden bg-gray-100">
                          {rpImgUrl ? (
                            <img src={rpImgUrl} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] font-medium text-gray-400">NO IMG</div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-semibold text-black uppercase truncate max-w-[140px] sm:max-w-[200px] group-hover:text-gray-600 transition-colors">
                            {rp.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-gray-600">৳{rp.currentPrice || rp.originalPrice}</span>
                            {rp.originalPrice && rp.currentPrice && rp.originalPrice > rp.currentPrice && (
                              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 uppercase rounded-none">
                                -{Math.round(((rp.originalPrice - rp.currentPrice) / rp.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link href={`/main/product/${rp.id}`} className="text-xs font-semibold text-black uppercase tracking-widest hover:text-gray-500 transition-colors">
                        View
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Offers & More */}
          {budgetPicks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-6 border-b-[1px] border-gray-200 pb-3 flex items-center gap-2 text-black">
                Offers & More
              </h3>
              <div className="space-y-3">
                {budgetPicks.map((bp) => (
                  <div key={bp.id} className="flex items-center justify-between text-xs sm:text-sm border-[1px] border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors">
                    <span className="font-medium text-black uppercase">{bp.title}</span>
                    <span className="bg-gray-100 text-black px-3 py-1 font-semibold text-[10px] tracking-widest uppercase">
                      ৳{bp.packagePrice}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-medium text-gray-400 mt-4 text-center uppercase tracking-wide">
                (Items added to cart must exactly equal the conditions of offer / target tk.)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
