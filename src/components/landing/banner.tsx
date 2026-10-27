"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllBanners } from "@/api/bannerApi";

export function Banner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [banners, setBanners] = useState<any[]>([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await getAllBanners();
                if (res.data) {
                    const activeBanners = res.data.filter((b: any) => b.status === "Active" || !b.status);
                    activeBanners.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
                    setBanners(activeBanners);
                }
            } catch (e) {
                console.error("Failed to fetch banners", e);
            } finally {
                window.dispatchEvent(new CustomEvent("landing-data-ready", { detail: "banners" }));
            }
        };
        fetchBanners();
    }, []);

    const bannersRef = React.useRef<any[]>([]);
    bannersRef.current = banners;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => {
            const len = bannersRef.current.length;
            if (len === 0) return 0;
            return prevIndex >= len - 1 ? 0 : prevIndex + 1;
        });
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => {
            const len = bannersRef.current.length;
            if (len === 0) return 0;
            return prevIndex === 0 ? len - 1 : prevIndex - 1;
        });
    };

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 4500);
        return () => clearInterval(interval);
    }, [banners.length, nextSlide]);

    const getImgUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        return `https://codegrid-api.vercel.app${url.startsWith('/') ? '' : '/'}${url}`;
    };

    if (banners.length === 0) {
        return null;
    }

    return (
        <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Full-Width Banner Slider */}
            <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh]">
                {/* Banner Slides — crossfade */}
                {banners.map((banner, idx) => (
                    <div
                        key={banner.id}
                        className="absolute inset-0 transition-all duration-700 ease-in-out"
                        style={{
                            opacity: currentIndex === idx ? 1 : 0,
                            zIndex: currentIndex === idx ? 10 : 1,
                            pointerEvents: currentIndex === idx ? "auto" : "none",
                        }}
                    >
                        {/* Banner Image */}
                        <img
                            src={getImgUrl(banner.image)}
                            alt={banner.title || "Banner"}
                            className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out"
                            style={{
                                transform: currentIndex === idx ? "scale(1.06)" : "scale(1)",
                            }}
                        />

                        {/* Cinematic Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0D4B2D]/40 via-transparent to-transparent" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-20 lg:pb-28 px-6 text-center z-20">
                            {/* Banner Title */}
                            {/* {banner.title && (
                                <h2
                                    className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-5 tracking-tight drop-shadow-2xl transition-all duration-700"
                                    style={{
                                        opacity: currentIndex === idx ? 1 : 0,
                                        transform: currentIndex === idx ? "translateY(0)" : "translateY(30px)",
                                        transitionDelay: currentIndex === idx ? "300ms" : "0ms",
                                    }}
                                >
                                    {banner.title}
                                </h2>
                            )} */}

                            {/* CTA Button */}
                            {banner.subtitle && banner.link && (
                                <Link
                                    href={banner.link}
                                    className="inline-flex items-center justify-center px-10 py-4 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-500 bg-[#D9941E] hover:bg-[#c7850f] text-white rounded-full shadow-[0_8px_32px_rgba(217,148,30,0.35)] hover:shadow-[0_12px_40px_rgba(217,148,30,0.5)] hover:scale-105"
                                    style={{
                                        opacity: currentIndex === idx ? 1 : 0,
                                        transform: currentIndex === idx ? "translateY(0)" : "translateY(20px)",
                                        transitionDelay: currentIndex === idx ? "500ms" : "0ms",
                                    }}
                                >
                                    {banner.subtitle}
                                </Link>
                            )}
                        </div>
                    </div>
                ))}

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white hover:bg-[#106840] hover:border-[#106840] transition-all duration-300 z-30 opacity-0 group-hover:opacity-100 sm:opacity-70 hover:opacity-100 shadow-lg"
                    aria-label="Previous banner"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white hover:bg-[#106840] hover:border-[#106840] transition-all duration-300 z-30 opacity-0 group-hover:opacity-100 sm:opacity-70 hover:opacity-100 shadow-lg"
                    aria-label="Next banner"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Progress Bar + Dots */}
            <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                        style={{ width: currentIndex === idx ? "2.5rem" : "0.625rem" }}
                        aria-label={`Go to slide ${idx + 1}`}
                    >
                        <span className="absolute inset-0 bg-white/40 rounded-full" />
                        {currentIndex === idx && (
                            <span
                                className="absolute inset-0 bg-[#D9941E] rounded-full origin-left"
                                style={{
                                    animation: "bannerProgress 4.5s linear forwards",
                                }}
                            />
                        )}
                        {currentIndex !== idx && (
                            <span className="absolute inset-0 bg-white/40 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Progress bar animation keyframe */}
            <style jsx>{`
                @keyframes bannerProgress {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
            `}</style>
        </div>
    );
}

