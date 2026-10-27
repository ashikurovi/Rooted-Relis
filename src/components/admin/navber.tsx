import Link from "next/link";
import Image from "next/image";

export default function Navber() {
  return (
    <header className="flex h-[72px] items-center gap-4 border-b border-slate-200 bg-white px-6 md:px-8">
      <Link href="/dotadmin" className="lg:hidden flex items-center gap-2">
        <Image src="/logo.png" alt="Rooted Relish" width={34} height={34} className="object-contain" />
        <span className="text-base font-black uppercase tracking-tight text-[#106840]">Rooted Relish</span>
      </Link>
      <div className="w-full flex-1">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <input
              type="search"
              placeholder="SEARCH ADMIN..."
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#106840]/20 focus:border-[#106840] md:w-2/3 lg:w-1/3 transition-all font-medium"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" target="_blank" className="text-xs font-bold uppercase tracking-wider text-[#106840] hover:text-[#0D4B2D] px-3 py-1.5 rounded-lg border border-[#106840]/30 hover:bg-emerald-50 transition-colors hidden sm:block">
          View Store
        </Link>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#106840] to-[#D9941E] text-sm font-black text-white shadow-sm ring-2 ring-[#D9941E]/30">
          R
        </button>
      </div>
    </header>
  );
}
