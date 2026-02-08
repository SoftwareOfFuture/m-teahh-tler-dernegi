type Props = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 shadow-soft-lg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,21,56,0.15)_0%,_transparent_50%)]" />
      <div className="relative px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Antalya İnşaat Müteahhitleri Derneği</p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{subtitle}</p> : null}
      </div>
    </section>
  );
}
