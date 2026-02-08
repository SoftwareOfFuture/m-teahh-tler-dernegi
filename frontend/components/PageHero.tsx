type Props = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: Props) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-burgundy via-burgundy-dark to-burgundy shadow-soft-lg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_50%)]" />
      <div className="relative min-w-0 px-4 py-10 sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-14 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Antalya İnşaat Müteahhitleri Derneği</p>
        <h1 className="mt-3 break-words text-2xl font-bold text-white sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-4 max-w-2xl break-words text-sm leading-relaxed text-white/80 sm:mt-5 sm:text-base">{subtitle}</p> : null}
      </div>
    </section>
  );
}
