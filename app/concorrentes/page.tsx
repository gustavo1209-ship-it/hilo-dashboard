import { getCompetitors } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import { ExternalLink } from "lucide-react";

export const revalidate = 3600;

const TYPE_LABEL: Record<string, string> = {
  online: "Online", physical: "Físico", hybrid: "Híbrido",
};
const SCOPE_LABEL: Record<string, string> = {
  local: "Local", regional: "Regional", national: "Nacional",
};

export default async function ConcorrentesPage() {
  const data = await getCompetitors();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Concorrentes"
        subtitle={`${data.length} boutiques mapeadas — físicas, online e híbridas`}
      />

      <div className="grid gap-4">
        {data.map((c: {
          concorrente: string; tipo: string; alcance: string; instagram_handle: string;
          seguidores_atual: number | null; engajamento_pct: number | null;
          ticket_medio: number | null; receita_milhoes_brl: number | null;
          marcas_mapeadas: number; publico_alvo: string | null;
          diferenciais: string | null; ultima_coleta: string | null;
        }) => (
          <div key={c.concorrente} className="bg-white border border-[#E5DFD5] rounded-xl p-5">
            <div className="flex flex-wrap gap-4 items-start justify-between">
              {/* Info principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif text-lg font-semibold">{c.concorrente}</h2>
                  <span className="text-[10px] bg-[#F4F1EC] text-[#6B6B6B] px-2 py-0.5 rounded-full">
                    {TYPE_LABEL[c.tipo] ?? c.tipo}
                  </span>
                  <span className="text-[10px] bg-[#F4F1EC] text-[#6B6B6B] px-2 py-0.5 rounded-full">
                    {SCOPE_LABEL[c.alcance] ?? c.alcance}
                  </span>
                  {c.marcas_mapeadas > 0 && (
                    <span className="text-[10px] bg-[#E8D5B0] text-[#8B6B3D] px-2 py-0.5 rounded-full">
                      {c.marcas_mapeadas} marcas
                    </span>
                  )}
                </div>
                {c.publico_alvo && (
                  <p className="text-xs text-[#9A9289] mt-1">{c.publico_alvo}</p>
                )}
                {c.diferenciais && (
                  <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">{c.diferenciais}</p>
                )}
              </div>

              {/* Métricas */}
              <div className="flex gap-6 flex-wrap shrink-0">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-[#9A9289] text-[10px] mb-1 justify-center">
                    Instagram
                  </div>
                  <div className="font-serif text-xl font-semibold">
                    {c.seguidores_atual ? `${(c.seguidores_atual / 1000).toFixed(0)}K` : "—"}
                  </div>
                  {c.engajamento_pct && (
                    <div className="text-[10px] text-green-600">{c.engajamento_pct}% eng</div>
                  )}
                </div>

                {c.ticket_medio && (
                  <div className="text-center">
                    <div className="text-[#9A9289] text-[10px] mb-1">Ticket Médio</div>
                    <div className="font-serif text-xl font-semibold">
                      R$ {c.ticket_medio.toLocaleString("pt-BR")}
                    </div>
                  </div>
                )}

                {c.receita_milhoes_brl && (
                  <div className="text-center">
                    <div className="text-[#9A9289] text-[10px] mb-1">Receita</div>
                    <div className="font-serif text-xl font-semibold">
                      R$ {c.receita_milhoes_brl}M
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="mt-3 flex gap-4 text-xs">
              {c.instagram_handle && (
                <a
                  href={`https://instagram.com/${c.instagram_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#C4A46B] hover:underline"
                >
                  @{c.instagram_handle}
                  <ExternalLink size={10} />
                </a>
              )}
              {c.ultima_coleta && (
                <span className="text-[#9A9289]">
                  Atualizado: {new Date(c.ultima_coleta).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
