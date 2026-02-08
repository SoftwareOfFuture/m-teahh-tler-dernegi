type Props = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-premium shadow-premium-lg sm:rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-burgundy/30 via-slate-premium to-slate-premium-light" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      <div className="relative px-6 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <p className="animate-fade-in text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Antalya İnşaat Müteahhitleri Derneği</p>
        <h1 className="mt-4 animate-fade-in-up text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl xl:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-5 max-w-2xl animate-fade-in-up text-sm leading-relaxed text-white/90 sm:text-base [animation-delay:0.1s]">{subtitle}</p> : null}
      </div>
    </section>
  );
}

