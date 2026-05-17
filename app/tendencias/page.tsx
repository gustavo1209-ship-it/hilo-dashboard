import { getProductTrends } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const dynamic = 'force-dynamic';

type Trend = {
  categoria: string; tendencia: string; temporada: string;
  demanda: string; premium: boolean; description: string; source: string | null;
};

const DEMAND_CONFIG = {
  alto:  { label: "Alta Demanda",  icon: TrendingUp,   color: "text-green-600", bg: "bg-green-50"  },
  medio: { label: "Média Demanda", icon: Minus,        color: "text-amber-600", bg: "bg-amber-50"  },
  baixo: { label: "Baixa Demanda", icon: TrendingDown, color: "text-red-500",   bg: "bg-red-50"    },
};

export default async function TendenciasPage() {
  const data = (await getProductTrends()) as Trend[];

  const byDemand = {
    alto:  data.filter(d => d.demanda === "alto"),
    medio: data.filter(d => d.demanda === "medio"),
    baixo: data.filter(d => d.demanda === "baixo"),
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Tendências de Produto"
        subtitle="Mapeamento de tendências por categoria para Outono/Inverno 2025 — Primavera/Verão 2026"
      />

      {(["alto", "medio", "baixo"] as const).map(demand => {
        const items = byDemand[demand];
        if (!items.length) return null;
        const conf = DEMAND_CONFIG[demand];
        const Icon = conf.icon;
        return (
          <div key={demand} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Icon size={18} className={conf.color} />
              <h2 className="font-serif text-xl">{conf.label}</h2>
              <span className="text-[#9A9289] text-sm">({items.length})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(trend => (
                <div key={trend.tendencia} className="bg-white border border-[#E5DFD5] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-[#111111]">{trend.tendencia}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] text-[#9A9289] bg-[#F4F1EC] px-2 py-0.5 rounded-full">
                          {trend.categoria}
                        </span>
                        <span className="text-[10px] text-[#9A9289] bg-[#F4F1EC] px-2 py-0.5 rounded-full">
                          {trend.temporada}
                        </span>
                        {trend.premium && (
                          <span className="text-[10px] text-[#8B6B3D] bg-[#E8D5B0] px-2 py-0.5 rounded-full font-semibold">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${conf.bg} ${conf.color}`}>
                      {conf.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">{trend.description}</p>
                  {trend.source && (
                    <div className="mt-3 text-[10px] text-[#9A9289]">Fonte: {trend.source}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
