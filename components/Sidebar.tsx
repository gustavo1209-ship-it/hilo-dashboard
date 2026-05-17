"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BarChart3, ShoppingBag,
  Lightbulb, TrendingUp, Activity,
} from "lucide-react";

const nav = [
  { href: "/",            label: "Visão Geral",   icon: LayoutDashboard },
  { href: "/concorrentes",label: "Concorrentes",  icon: Users },
  { href: "/precos",      label: "Preços",         icon: BarChart3 },
  { href: "/produtos",    label: "Produtos",       icon: ShoppingBag },
  { href: "/insights",    label: "Insights",       icon: Lightbulb },
  { href: "/tendencias",  label: "Tendências",     icon: TrendingUp },
  { href: "/saude",       label: "Coletas",        icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-[#111111] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/10">
        <div className="font-serif text-2xl tracking-[0.25em] text-white uppercase">
          HILO
        </div>
        <div className="text-[10px] tracking-[0.3em] text-[#C4A46B] uppercase mt-0.5">
          Inteligência de Mercado
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-[#C4A46B] text-[#111111] font-semibold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-white/10">
        <p className="text-[10px] text-white/30 uppercase tracking-widest">
          Hilo Boutique © 2026
        </p>
      </div>
    </aside>
  );
}
