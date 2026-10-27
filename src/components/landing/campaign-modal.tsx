"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { getAllCampaignNotices } from '@/api/campaignApi';

export function CampaignModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);

  const getImgUrl = (url: string) => {
    if (!url) return "";
    return url;
  };

  useEffect(() => {
    // Only fetch if we haven't shown it yet this session
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('hasShownCampaignModal')) {
        window.dispatchEvent(new CustomEvent("landing-data-ready", { detail: "campaign" }));
        return;
      }
    }

    getAllCampaignNotices()
      .then(res => {
        if (res.data && res.data.length > 0) {
          // Find the first active campaign
          const activeCampaign = res.data.find((c: any) => c.isActive);
          if (activeCampaign) {
            setCampaign(activeCampaign);

            // Mark as shown for the session
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('hasShownCampaignModal', 'true');
            }

            // Show the modal 1.5 seconds after landing
            const timer = setTimeout(() => {
              setIsRendered(true);
              setTimeout(() => setIsVisible(true), 50); // slight delay for CSS transition
            }, 1500);
            return () => clearTimeout(timer);
          }
        }
      })
      .catch(console.error)
      .finally(() => window.dispatchEvent(new CustomEvent("landing-data-ready", { detail: "campaign" })));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsRendered(false), 300); // Wait for transition to finish
  };

  if (!isRendered || !campaign) return null;

  const content = (
    <div className="relative w-full overflow-hidden rounded-none border-4 border-transparent group-hover:border-[#106840] transition-all duration-300">
      {campaign.image ? (
        <img
          src={getImgUrl(campaign.image)}
          alt={campaign.campaignName || "Campaign"}
          className="w-full h-auto max-h-[80vh] object-contain block"
        />
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-gray-200">
          <span className="font-black text-gray-400 text-xl uppercase">No Image</span>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`relative bg-white w-full max-w-lg shadow-2xl rounded-none transition-all duration-500 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-30 bg-white/90 hover:bg-white text-gray-900 hover:text-red-500 transition-colors p-2 shadow-md rounded-full border border-gray-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {campaign.link ? (
          <Link href={campaign.link} onClick={handleClose} className="block group cursor-pointer">
            {content}
          </Link>
        ) : (
          <div className="block group">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}
