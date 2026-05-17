import { getCollectionHealth } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export const revalidate = 300;

type Health = {
  collector: string; total_runs: number; sucessos: number; erros: number;
  total_criados: number; total_atualizados: number;
  ultima_execucao: string | null; taxa_sucesso_pct: number;
};

const COLLECTOR_LABEL: Record<string, string> = {
  "ecommerce_vtex": "E-commerce VTEX (NV, JJ, CK)",
  "instagram":       "Instagram (Concorrentes)",
  "ecommerce":       "E-commerce (legado)",
  "google_maps":     "Google Maps (Localizações)",
};

export default async function SaudePage() {
  const data = (await getCollectionHealth()) as Health[];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <PageHeader
        title="Saúde das Coletas"
        subtitle="Monitoramento das execuções automáticas dos scripts de inteligência"
      />

      <div className="space-y-4">
        {data.map(h => {
          const ok = h.taxa_sucesso_pct >= 80;
          const warn = h.taxa_sucesso_pct >= 50 && h.taxa_sucesso_pct < 80;
          return (
            <div key={h.collector} className="bg-white border border-[#E5DFD5] rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {ok ? (
                    <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                  ) : warn ? (
                    <Clock size={20} className="text-amber-500 shrink-0" />
                  ) : (
                    <XCircle size={20} className="text-red-500 shrink-0" />
                  )}
                  <div>
                    <div className="font-semibold">{COLLECTOR_LABEL[h.collector] ?? h.collector}</div>
                    {h.ultima_execucao && (
                      <div className="text-xs text-[#9A9289]">
                        Última execução: {new Date(h.ultima_execucao).toLocaleString("pt-BR")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-serif font-semibold ${ok ? "text-green-600" : warn ? "text-amber-600" : "text-red-600"}`}>
                    {h.taxa_sucesso_pct}%
                  </div>
                  <div className="text-xs text-[#9A9289]">taxa de sucesso</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3 text-center text-sm">
                {[
                  { label: "Execuções", value: h.total_runs },
                  { label: "Sucessos", value: h.sucessos ?? 0 },
                  { label: "Erros", value: h.erros ?? 0 },
                  { label: "Registros criados", value: (h.total_criados ?? 0).toLocaleString("pt-BR") },
                ].map(s => (
                  <div key={s.label} className="bg-[#F4F1EC] rounded-lg py-2 px-3">
                    <div className="text-xs text-[#9A9289] mb-0.5">{s.label}</div>
                    <div className="font-semibold">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Barra de sucesso */}
              <div className="mt-4 h-1.5 bg-[#F4F1EC] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${ok ? "bg-green-400" : warn ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${h.taxa_sucesso_pct}%` }}
                />
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="bg-white border border-[#E5DFD5] rounded-xl p-12 text-center text-[#9A9289]">
            <Clock size={40} className="mx-auto mb-3 text-[#E5DFD5]" />
            <p className="font-medium">Nenhuma execução registrada ainda</p>
            <p className="text-sm mt-1">Execute <code className="bg-[#F4F1EC] px-1.5 py-0.5 rounded text-xs">python run.py</code> na pasta hilo-analytics</p>
          </div>
        )}
      </div>

      {/* Instruções */}
      <div className="mt-8 bg-[#111111] text-white rounded-xl p-6">
        <h3 className="font-serif text-lg mb-4 text-[#C4A46B]">Como agendar coletas automáticas</h3>
        <div className="space-y-2 text-sm text-white/70 font-mono">
          <div>cd hilo-analytics</div>
          <div>python run.py instagram    <span className="text-white/30"># snapshot Instagram agora</span></div>
          <div>python run.py ecommerce   <span className="text-white/30"># preços VTEX agora</span></div>
          <div>python run.py schedule    <span className="text-white/30"># daemon — roda diariamente às 08h</span></div>
        </div>
      </div>
    </div>
  );
}
