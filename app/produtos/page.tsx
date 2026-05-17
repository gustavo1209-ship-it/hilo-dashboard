import { getScrapedProductsSummary } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import { Tag } from "lucide-react";

export const dynamic = 'force-dynamic';

type Product = {
  name: string;
  price_brl: number | null;
  price_sale_brl: number | null;
  category_slug: string | null;
  last_seen_at: string | null;
  hb_competitors: { name: string };
};

const CAT_LABEL: Record<string, string> = {
  "calca-jeans": "Calça Jeans",
  "calca-alfaiataria": "Calça Alfaiataria",
  "vestido": "Vestido",
  "blusa-top": "Blusa / Top",
  "camisa": "Camisa",
  "shorts-bermuda": "Shorts / Bermuda",
  "saia": "Saia",
  "blazer": "Blazer",
  "casaco": "Casaco",
  "macacao": "Macacão",
  "underwear": "Underwear",
  "bolsa": "Bolsa",
};

export default async function ProdutosPage() {
  const raw = await getScrapedProductsSummary();
  const products = raw as unknown as Product[];

  const stats = {
    total: products.length,
    withSale: products.filter(p => p.price_sale_brl).length,
    avgPrice: products.length
      ? Math.round(products.reduce((s, p) => s + (p.price_brl ?? 0), 0) / products.length)
      : 0,
    maxPrice: Math.max(...products.map(p => p.price_brl ?? 0)),
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Produtos Coletados"
        subtitle={`${stats.total} produtos dos sites oficiais das marcas — dados em tempo real`}
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total.toLocaleString("pt-BR") },
          { label: "Em promoção", value: `${stats.withSale} (${Math.round(stats.withSale / stats.total * 100)}%)` },
          { label: "Preço médio", value: `R$ ${stats.avgPrice.toLocaleString("pt-BR")}` },
          { label: "Mais caro", value: `R$ ${stats.maxPrice.toLocaleString("pt-BR")}` },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E5DFD5] rounded-xl p-4 text-center">
            <div className="text-xs text-[#9A9289] uppercase tracking-widest mb-1">{s.label}</div>
            <div className="font-serif text-xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-white border border-[#E5DFD5] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F4F1EC] border-b border-[#E5DFD5]">
                <th className="text-left px-4 py-3 text-xs text-[#9A9289] font-medium">Produto</th>
                <th className="text-left px-4 py-3 text-xs text-[#9A9289] font-medium">Loja</th>
                <th className="text-left px-4 py-3 text-xs text-[#9A9289] font-medium">Categoria</th>
                <th className="text-right px-4 py-3 text-xs text-[#9A9289] font-medium">Preço</th>
                <th className="text-right px-4 py-3 text-xs text-[#9A9289] font-medium">Promoção</th>
                <th className="text-right px-4 py-3 text-xs text-[#9A9289] font-medium">Desconto</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const desconto = p.price_brl && p.price_sale_brl
                  ? Math.round((1 - p.price_sale_brl / p.price_brl) * 100)
                  : null;
                return (
                  <tr key={i} className="border-b border-[#F4F1EC] hover:bg-[#FDFBF7] transition-colors">
                    <td className="px-4 py-3 font-medium max-w-xs">
                      <div className="truncate">{p.name}</div>
                    </td>
                    <td className="px-4 py-3 text-[#9A9289] text-xs">
                      {p.hb_competitors?.name?.replace(" (Site Oficial)", "")}
                    </td>
                    <td className="px-4 py-3">
                      {p.category_slug ? (
                        <span className="flex items-center gap-1 text-xs">
                          <Tag size={10} className="text-[#C4A46B]" />
                          {CAT_LABEL[p.category_slug] ?? p.category_slug}
                        </span>
                      ) : (
                        <span className="text-[#9A9289] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {p.price_brl ? `R$ ${p.price_brl.toLocaleString("pt-BR")}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-green-700">
                      {p.price_sale_brl ? `R$ ${p.price_sale_brl.toLocaleString("pt-BR")}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {desconto ? (
                        <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          -{desconto}%
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
