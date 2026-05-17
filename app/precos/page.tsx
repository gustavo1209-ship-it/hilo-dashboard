import { getHiloBrandsPricing, getPricingByCategory } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";

export const dynamic = 'force-dynamic';

export default async function PrecosPage() {
  const [hiloData, allData] = await Promise.all([
    getHiloBrandsPricing(),
    getPricingByCategory(),
  ]);

  type PriceRow = {
    marca: string; categoria: string; segmento: string;
    hilo_vende: boolean; preco_min: number; preco_medio: number;
    preco_max: number; margem_pct: number; lucro_bruto_por_peca: number;
  };

  const hiloRows = hiloData as PriceRow[];
  const allRows = allData as PriceRow[];

  const categories = [...new Set(allRows.map(r => r.categoria))].sort();
  const marcas = [...new Set(hiloRows.map(r => r.marca))];

  const maxPrice = Math.max(...allRows.map(r => r.preco_max), 3000);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Radar de Preços"
        subtitle="Faixas de preço por marca e categoria — marcas da Hilo destacadas"
      />

      {/* Cards de margem por marca */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {marcas.map(marca => {
          const rows = hiloRows.filter(r => r.marca === marca);
          const avgMargem = rows.length
            ? Math.round(rows.reduce((s, r) => s + r.margem_pct, 0) / rows.length)
            : 0;
          const avgLucro = rows.length
            ? Math.round(rows.reduce((s, r) => s + r.lucro_bruto_por_peca, 0) / rows.length)
            : 0;
          const avgPreco = rows.length
            ? Math.round(rows.reduce((s, r) => s + r.preco_medio, 0) / rows.length)
            : 0;
          return (
            <div key={marca} className="bg-[#111111] text-white rounded-xl p-5">
              <div className="text-[#C4A46B] text-xs uppercase tracking-widest mb-3">{marca}</div>
              <div className="text-3xl font-serif font-semibold">{avgMargem}%</div>
              <div className="text-white/50 text-xs mt-0.5">margem média estimada</div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-white/40">Ticket médio</div>
                  <div className="font-semibold">R$ {avgPreco.toLocaleString("pt-BR")}</div>
                </div>
                <div>
                  <div className="text-white/40">Lucro por peça</div>
                  <div className="font-semibold text-[#C4A46B]">R$ {avgLucro.toLocaleString("pt-BR")}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabela de preços por categoria */}
      <div className="bg-white border border-[#E5DFD5] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5DFD5]">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-[#9A9289]">
            Preços por Categoria × Marca
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F4F1EC]">
                <th className="text-left px-4 py-3 text-xs text-[#9A9289] font-medium">Categoria</th>
                <th className="text-left px-4 py-3 text-xs text-[#9A9289] font-medium">Marca</th>
                <th className="text-left px-4 py-3 text-xs text-[#9A9289] font-medium">Segmento</th>
                <th className="text-right px-4 py-3 text-xs text-[#9A9289] font-medium">Mín</th>
                <th className="text-center px-4 py-3 text-xs text-[#9A9289] font-medium min-w-32">Faixa</th>
                <th className="text-right px-4 py-3 text-xs text-[#9A9289] font-medium">Máx</th>
                <th className="text-right px-4 py-3 text-xs text-[#9A9289] font-medium">Margem</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => {
                const catRows = allRows.filter(r => r.categoria === cat);
                return catRows.map((row, i) => (
                  <tr key={`${cat}-${row.marca}`}
                    className={`border-b border-[#F4F1EC] ${row.hilo_vende ? "bg-[#FDFBF7]" : ""}`}
                  >
                    {i === 0 && (
                      <td rowSpan={catRows.length} className="px-4 py-3 font-medium border-r border-[#F4F1EC] align-top">
                        {cat}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {row.marca}
                        {row.hilo_vende && (
                          <span className="text-[9px] bg-[#E8D5B0] text-[#8B6B3D] px-1.5 py-0.5 rounded-full font-semibold">HILO</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#9A9289] text-xs">{row.segmento}</td>
                    <td className="px-4 py-3 text-right">R$ {row.preco_min?.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3">
                      <div className="relative h-1.5 bg-[#F4F1EC] rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-[#C4A46B] to-[#8B6B3D] rounded-full"
                          style={{
                            left: `${(row.preco_min / maxPrice) * 100}%`,
                            width: `${((row.preco_max - row.preco_min) / maxPrice) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-center text-[10px] text-[#9A9289] mt-0.5">
                        R$ {row.preco_medio?.toLocaleString("pt-BR")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">R$ {row.preco_max?.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[#C4A46B]">{row.margem_pct}%</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
