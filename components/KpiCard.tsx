import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  accent?: boolean;
}

export default function KpiCard({ title, value, subtitle, icon: Icon, accent }: Props) {
  return (
    <div className={`rounded-xl p-5 flex flex-col gap-3 ${accent ? "bg-[#111111] text-white" : "bg-white border border-[#E5DFD5]"}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs uppercase tracking-widest font-medium ${accent ? "text-[#C4A46B]" : "text-[#9A9289]"}`}>
          {title}
        </span>
        <div className={`p-2 rounded-lg ${accent ? "bg-white/10" : "bg-[#F4F1EC]"}`}>
          <Icon size={15} className={accent ? "text-[#C4A46B]" : "text-[#6B6B6B]"} />
        </div>
      </div>
      <div>
        <div className={`text-3xl font-serif font-semibold ${accent ? "text-white" : "text-[#111111]"}`}>
          {value}
        </div>
        {subtitle && (
          <div className={`text-xs mt-1 ${accent ? "text-white/50" : "text-[#9A9289]"}`}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
