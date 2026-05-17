interface Props {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: Props) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-serif text-3xl text-[#111111] font-semibold">{title}</h1>
        {subtitle && <p className="text-[#9A9289] text-sm mt-1">{subtitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
