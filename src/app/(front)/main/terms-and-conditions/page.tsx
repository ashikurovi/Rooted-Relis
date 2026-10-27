import Link from "next/link";

const sections = [
  {
    title: "Using Our Website",
    body: "By using Rooted Relish, you agree to provide accurate information and use the website only for lawful purchases and communication. We may update these terms when our services change.",
  },
  {
    title: "Products and Orders",
    body: "Product images, colors, measurements, and availability may vary slightly. An order is confirmed after our team reviews the order details. We may contact you to verify delivery information before dispatch.",
  },
  {
    title: "Pricing and Payment",
    body: "Prices are shown in Bangladeshi Taka and may change without prior notice. Delivery charges, payment method availability, and promotional pricing are shown during checkout.",
  },
  {
    title: "Account Responsibility",
    body: "Keep your account information and password secure. You are responsible for activity completed through your account and for notifying us if you believe your account has been used without permission.",
  },
  {
    title: "Contact",
    body: "For questions about these terms or an order, contact Rooted Relish through the details listed on our website or email support@rootedrelish.com.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-16 text-[#172033] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-[#106840] hover:text-[#0D4B2D]">Back to Rooted Relish</Link>
        <div className="mt-8 border border-emerald-900/10 bg-white p-8 shadow-sm sm:p-12 rounded-xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#106840]">Rooted Relish Legal</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#0D4B2D] sm:text-5xl">Terms &amp; Conditions</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">These terms explain the basic rules for using Rooted Relish and placing an order with us.</p>
          <div className="mt-10 space-y-8 border-t border-slate-100 pt-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-bold text-slate-800">{section.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
              </section>
            ))}
          </div>
          <p className="mt-10 border-t border-slate-100 pt-6 text-xs text-slate-400">Last updated: October 2026</p>
        </div>
      </div>
    </main>
  );
}
