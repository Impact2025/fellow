import Link from "next/link";
import { ACA_PROMISES } from "@/lib/aca/promises";

export default function PromisesPage() {
  return (
    <main className="pb-28 max-w-screen-md mx-auto min-h-screen">

      {/* ── TopAppBar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-outline-variant/20">
        <div className="flex items-center px-4 h-16 max-w-screen-md mx-auto gap-3">
          <Link
            href="/steps"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/30 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-headline-md text-primary tracking-tight leading-none">De 12 Beloften</h1>
            <p className="text-label-sm text-outline font-normal tracking-normal mt-0.5">Wat herstel je brengt</p>
          </div>
        </div>
      </header>

      <div className="pt-20 px-6 space-y-6">

        {/* ── Hero ── */}
        <section className="animate-fade-up-1">
          <div className="bg-secondary-fixed/40 rounded-3xl p-7 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: "160px", fontVariationSettings: "'wght' 100" }}>
                stars
              </span>
            </div>
            <div className="relative z-10 space-y-2">
              <span className="text-label-sm text-on-secondary-fixed-variant uppercase tracking-widest block">
                ACA · Proefvertaling
              </span>
              <h2 className="text-headline-md text-on-secondary-fixed leading-snug">
                Dit wacht op je<br />in herstel.
              </h2>
              <p className="text-body-md text-on-secondary-fixed-variant leading-relaxed" style={{ maxWidth: "300px" }}>
                Geen beloning voor prestaties. Vrucht van het werk dat je doet.
              </p>
            </div>
          </div>
        </section>

        {/* ── Beloften lijst ── */}
        <section className="space-y-3 animate-fade-up-2">
          {ACA_PROMISES.map((promise) => (
            <div
              key={promise.number}
              className="flex gap-4 p-5 bg-surface-container-low rounded-2xl"
            >
              <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-label-sm text-secondary font-bold">{promise.number}</span>
              </div>
              <div className="space-y-1">
                <p className="text-label-md text-on-surface font-medium">{promise.shortTitle}</p>
                <p className="text-body-md text-on-surface-variant leading-relaxed">{promise.body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Footer ── */}
        <div className="text-center pb-4 animate-fade-up-3">
          <p className="text-label-sm text-outline font-normal tracking-normal leading-relaxed max-w-xs mx-auto">
            © Adult Children of Alcoholics / Dysfunctional Families (ACA)<br />
            Proefvertalingen versie 5,99 van IG#598
          </p>
        </div>

      </div>
    </main>
  );
}
