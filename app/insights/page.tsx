import { getPriorityInsights } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";

export const revalidate = 3600;

type Insight = {
  ordem: number; prioridade: string; categoria: string;
  iniciativa: string; acoes_concretas: string | null; fonte: string | null;
};

const PRIORITY_COLORS = {
  ALTA:  { bg: "bg-red-50",    border: "border-red-200",   badge: "badge-alta" },
  MEDIA: { bg: "bg-amber-50",  border: "border-amber-200", badge: "badge-media" },
  BAIXA: { bg: "bg-green-50",  border: "border-green-200", badge: "badge-baixa" },
};

export default async function InsightsPage() {
  const data = (await getPriorityInsights()) as Insight[];

  const byPriority = {
    ALTA:  data.filter(d => d.prioridade === "ALTA"),
    MEDIA: data.filter(d => d.prioridade === "MEDIA"),
    BAIXA: data.filter(d => d.prioridade === "BAIXA"),
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Plano de Ação"
        subtitle={`${data.length} iniciativas priorizadas por impacto no negócio`}
      />

      {(["ALTA", "MEDIA", "BAIXA"] as const).map(pri => {
        const items = byPriority[pri];
        if (!items.length) return null;
        const colors = PRIORITY_COLORS[pri];
        return (
          <div key={pri} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={colors.badge}>{pri}</span>
              <h2 className="font-serif text-xl text-[#111111]">
                Prioridade {pri.charAt(0) + pri.slice(1).toLowerCase()}
              </h2>
              <span className="text-[#9A9289] text-sm">({items.length} iniciativas)</span>
            </div>

            <div className="grid gap-4">
              {items.map(ins => {
                const actions = ins.acoes_concretas
                  ?.split("\n")
                  .filter(a => a.trim().match(/^\d+\./))
                  ?? [];

                return (
                  <div key={ins.iniciativa}
                    className={`rounded-xl p-5 border ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-[#111111]">{ins.iniciativa}</h3>
                          <span className="text-[10px] bg-white/60 text-[#6B6B6B] px-2 py-0.5 rounded-full border border-current/20">
                            {ins.categoria}
                          </span>
                        </div>

                        {actions.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-semibold text-[#6B6B6B] mb-2 uppercase tracking-wider">Ações Concretas</div>
                            <div className="space-y-1.5">
                              {actions.map((action, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-[#111111]">
                                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#111111] text-white text-[10px] flex items-center justify-center font-bold mt-0.5">
                                    {i + 1}
                                  </span>
                                  <span>{action.replace(/^\d+\.\s*/, "")}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {ins.fonte && (
                          <div className="mt-3 text-[10px] text-[#9A9289]">Fonte: {ins.fonte}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
