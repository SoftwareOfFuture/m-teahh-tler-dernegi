type Props = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: Props) {
  return (
    <section className="relative overflow-hidden border-b-4 border-navy bg-navy">
      <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-transparent to-navy" />
      <div className="relative px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal">Antalya İnşaat Müteahhitleri Derneği</p>
        <h1 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">{subtitle}</p> : null}
      </div>
    </section>
  );
}
