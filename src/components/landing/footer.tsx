import React from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const shopLinks = [
    { name: "Big Sale", href: "/main/big-sale" },
    { name: "Budget Pick", href: "/main/budget-pick" },
    { name: "New Arrivals", href: "#" },
    { name: "Most Wanted", href: "#" },
    { name: "Collections", href: "/main/shop" }
  ];

  const supportLinks = [
    { name: "Track Order", href: "/main/ordertraking" },

    { name: "Contact Us", href: "#" },
    { name: "Store Locator", href: "#" },
    { name: "Request a Design", href: "#" }
  ];

  const legalLinks = [
    { name: "About Us", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms & Conditions", href: "/main/terms-and-conditions" },
    { name: "Franchise Shop", href: "#" },
    { name: "Refund & Returns", href: "/main/refund-returns" }
  ];

  return (
    <footer className="w-full border-t border-slate-200 bg-[#f7f8fa] pt-20 pb-10 text-black">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 pt-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col">
            <div className="mb-6">
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/logo.png"
                  alt="Rooted Relish Logo"
                  width={68}
                  height={68}
                  className="object-contain w-14 h-14 transition-transform group-hover:scale-105"
                  priority
                />
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-[#106840]">ROOTED RELISH</span>
                  <span className="text-[10px] font-bold tracking-[0.24em] text-[#C58B24] uppercase">EST. 2026</span>
                </div>
              </Link>
            </div>
            <p className="mb-8 max-w-xs text-sm leading-relaxed text-slate-600">
              Rooted Relish brings authentic culinary traditions, handpicked heritage tastes, and wholesome relish — crafted with love and passion since 2026.
            </p>
            <div className="mt-auto flex gap-3">
              <a href="#" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-[#106840] hover:text-[#106840]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-[#106840] hover:text-[#106840]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#106840]">Shop</h4>
            <ul className="space-y-4">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-[#106840]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#106840]">Support</h4>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-[#106840]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#106840]">Legal & About</h4>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-[#106840]">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 lg:flex-row">
          <div className="text-center text-xs font-medium text-slate-500 lg:text-left">
            Copyright © 2026 Rooted Relish | All Rights Reserved
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {['VISA', 'MasterCard', 'Amex', 'bKash', 'Nagad', 'Upay'].map((method) => (
              <div key={method} className="flex h-7 items-center justify-center rounded-md bg-slate-100 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                {method}
              </div>
            ))}
            <div className="flex h-7 items-center justify-center rounded-md bg-black px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              SSLCOMMERZ
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
