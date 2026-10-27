import Link from "next/link";

const policies = [
  {
    title: "Eligibility",
    body: "Most unused, unworn, and undamaged items can be requested for exchange or return within 7 days of delivery. Items must include their original packaging and tags.",
  },
  {
    title: "Exchange Requests",
    body: "Contact us with your order number, item details, and a clear reason for the request. Our team will review the request and confirm the available exchange options.",
  },
  {
    title: "Custom and Personalised Orders",
    body: "Custom, printed, personalised, or bulk-made items are not eligible for change-of-mind returns. If an item arrives damaged or differs from the approved order, contact us promptly so we can help.",
  },
  {
    title: "Refunds",
    body: "Approved refunds are processed after the returned item is inspected. The refund method and timing depend on the original payment method and the condition of the item.",
  },
  {
    title: "Delivery Costs",
    body: "Return delivery costs may apply unless the item is damaged, incorrect, or has a verified quality issue. Please wait for our confirmation before sending an item back.",
  },
  {
    title: "Need Help?",
    body: "Email support@rootedrelish.com with your order number and photos when relevant. We will reply promptly with the next steps for your request.",
  },
];

export default function RefundAndReturnsPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-16 text-[#172033] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-[#106840] hover:text-[#0D4B2D]">Back to Rooted Relish</Link>
        <div className="mt-8 border border-emerald-900/10 bg-white p-8 shadow-sm sm:p-12 rounded-xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D9941E]">Rooted Relish Support</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#0D4B2D] sm:text-5xl">Refund &amp; Returns</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">We want your Rooted Relish experience to feel right. Here is how exchanges, returns, and refunds work.</p>
          <div className="mt-10 space-y-8 border-t border-slate-100 pt-8">
            {policies.map((policy) => (
              <section key={policy.title}>
                <h2 className="text-lg font-bold text-slate-800">{policy.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{policy.body}</p>
              </section>
            ))}
          </div>
          <p className="mt-10 border-t border-slate-100 pt-6 text-xs text-slate-400">Last updated: October 2026</p>
        </div>
      </div>
    </main>
  );
}
