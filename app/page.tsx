import { getOverviewKpis, getCompetitors, getPriorityInsights, getHiloBrandsPricing } from "@/lib/queries";
import KpiCard from "@/components/KpiCard";
import PageHeader from "@/components/PageHeader";
import { Package, Users, Tag, TrendingUp, Store, BarChart2, Lightbulb } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [kpis, competitors, insights, brandPricing] = await Promise.all([
    getOverviewKpis(),
    getCompetitors(),
    getPriorityInsights(),
    getHiloBrandsPricing(),
  ]);

  const mercado = kpis.marketKpis;
  const faturamento = mercado.find(k => k.metric.includes("Faturamento total"))?.value;
  const crescimento = mercado.find(k => k.metric.includes("Crescimento e-commerce"))?.value;
  const omnichannel = mercado.find(k => k.metric.includes("omnichannel"))?.value;

  const topCompetitors = competitors.slice(0, 5);
  const highInsights = insights.filter((i: { prioridade: string }) => i.prioridade === "ALTA").slice(0, 4);

  // Preços por marca (só marcas da Hilo)
  const hiloMarks = ["NV", "John John", "Calvin Klein"];
  const pricingSummary: Record<string, { min: number; max: number; avg: number }> = {};
  for (const row of brandPricing as Array<{ marca: string; preco_min: number; preco_medio: number; preco_max: number }>) {
    if (!hiloMarks.includes(row.marca)) continue;
    if (!pricingSummary[row.marca]) pricingSummary[row.marca] = { min: Infinity, max: 0, avg: 0 };
    pricingSummary[row.marca].min = Math.min(pricingSummary[row.marca].min, row.preco_min);
    pricingSummary[row.marca].max = Math.max(pricingSummary[row.marca].max, row.preco_max);
    pricingSummary[row.marca].avg = Math.round((pricingSummary[row.marca].avg + row.preco_medio) / 2);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Visão Geral"
        subtitle={`Inteligência competitiva atualizada — ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Produtos Coletados" value={kpis.totalProducts.toLocaleString("pt-BR")} subtitle="NV + John John + CK" icon={Package} accent />
        <KpiCard title="Concorrentes" value={String(kpis.totalCompetitors)} subtitle="Online e físicos" icon={Users} />
        <KpiCard title="Marcas Mapeadas" value={String(kpis.totalBrands)} subtitle="Com precificação" icon={Tag} />
        <KpiCard title="Crescimento Moda Digital" value={`+${crescimento ?? 35}%`} subtitle="YoY 2025 — e-commerce BR" icon={TrendingUp} />
      </div>

      {/* Mercado + Preços da Hilo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Mercado */}
        <div className="bg-white border border-[#E5DFD5] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={16} className="text-[#C4A46B]" />
            <h2 className="font-semibold text-sm uppercase tracking-widest text-[#9A9289]">Mercado BR</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-[#9A9289] mb-1">Varejo moda (2023)</div>
              <div className="text-2xl font-serif font-semibold">R$ {faturamento ?? "265,8"}B</div>
            </div>
            <div className="h-px bg-[#E5DFD5]" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-[#9A9289] text-xs">E-comm moda</div>
                <div className="font-semibold">R$ 7,1B</div>
                <div className="text-[10px] text-green-600">+35% YoY</div>
              </div>
              <div>
                <div className="text-[#9A9289] text-xs">Multimarcas</div>
                <div className="font-semibold">36%</div>
                <div className="text-[10px] text-[#9A9289]">do físico</div>
              </div>
              <div>
                <div className="text-[#9A9289] text-xs">Omnichannel</div>
                <div className="font-semibold">{omnichannel ?? 89}%</div>
                <div className="text-[10px] text-[#9A9289]">retenção</div>
              </div>
              <div>
                <div className="text-[#9A9289] text-xs">Instagram uso</div>
                <div className="font-semibold">97%</div>
                <div className="text-[10px] text-[#9A9289]">das lojas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preços das marcas Hilo */}
        <div className="lg:col-span-2 bg-white border border-[#E5DFD5] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-[#C4A46B]" />
              <h2 className="font-semibold text-sm uppercase tracking-widest text-[#9A9289]">Marcas da Hilo — Faixa de Preço</h2>
            </div>
            <Link href="/precos" className="text-xs text-[#C4A46B] hover:underline">Ver tudo →</Link>
          </div>
          <div className="space-y-3">
            {Object.entries(pricingSummary).map(([marca, p]) => (
              <div key={marca}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{marca}</span>
                  <span className="text-[#9A9289]">Média R$ {p.avg.toLocaleString("pt-BR")}</span>
                </div>
                <div className="relative h-2 bg-[#F4F1EC] rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-[#C4A46B] to-[#8B6B3D] rounded-full"
                    style={{ left: `${(p.min / 3000) * 100}%`, width: `${((p.max - p.min) / 3000) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#9A9289] mt-0.5">
                  <span>R$ {p.min.toLocaleString("pt-BR")}</span>
                  <span>R$ {p.max.toLocaleString("pt-BR")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Concorrentes Top + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Concorrentes */}
        <div className="bg-white border border-[#E5DFD5] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Store size={16} className="text-[#C4A46B]" />
              <h2 className="font-semibold text-sm uppercase tracking-widest text-[#9A9289]">Principais Concorrentes</h2>
            </div>
            <Link href="/concorrentes" className="text-xs text-[#C4A46B] hover:underline">Ver todos →</Link>
          </div>
          <div className="space-y-3">
            {topCompetitors.map((c: { concorrente: string; tipo: string; instagram_handle: string; seguidores_atual: number | null; engajamento_pct: number | null; ticket_medio: number | null }) => (
              <div key={c.concorrente} className="flex items-center gap-3 py-2 border-b border-[#F4F1EC] last:border-0">
                <div className="w-8 h-8 rounded-full bg-[#F4F1EC] flex items-center justify-center text-xs font-bold text-[#6B6B6B] shrink-0">
                  {c.concorrente.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{c.concorrente}</div>
                  <div className="text-[10px] text-[#9A9289]">@{c.instagram_handle}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold">
                    {c.seguidores_atual ? `${(c.seguidores_atual / 1000).toFixed(0)}K` : "—"}
                  </div>
                  <div className="text-[10px] text-[#9A9289]">
                    {c.engajamento_pct ? `${c.engajamento_pct}% eng` : c.tipo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights prioritários */}
        <div className="bg-white border border-[#E5DFD5] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Lightbulb size={16} className="text-[#C4A46B]" />
              <h2 className="font-semibold text-sm uppercase tracking-widest text-[#9A9289]">Insights de Alta Prioridade</h2>
            </div>
            <Link href="/insights" className="text-xs text-[#C4A46B] hover:underline">Ver todos →</Link>
          </div>
          <div className="space-y-3">
            {highInsights.map((ins: { iniciativa: string; categoria: string; acoes_concretas: string }) => (
              <div key={ins.iniciativa} className="p-3 bg-[#F4F1EC] rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="badge-alta mt-0.5 shrink-0">ALTA</span>
                  <div>
                    <div className="text-sm font-medium leading-snug">{ins.iniciativa}</div>
                    <div className="text-[11px] text-[#9A9289] mt-1">{ins.categoria}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
