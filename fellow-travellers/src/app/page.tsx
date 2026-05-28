import Link from "next/link";

const PRIVACY_PILLARS = [
  {
    icon: "terminal",
    title: "Lokaal opgeslagen",
    body: "Al je data wordt direct op je eigen apparaat opgeslagen. Geen centrale servers die gehackt kunnen worden of data die wordt doorverkocht.",
  },
  {
    icon: "lock",
    title: "Eind-tot-eind versleuteld",
    body: "Zodra je data je apparaat verlaat voor een backup, is het versleuteld met een sleutel die alleen jij bezit. Wij zijn de blinde havenmeester.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Haven gaf me de ruimte om mijn gedachten te uiten zonder de angst voor oordeel of surveillance.",
    author: "Anonieme Gebruiker",
  },
  {
    quote: "De focus op anonimiteit is een verademing in een wereld die alles van je wil weten.",
    author: "Mental Health Professional",
  },
  {
    quote: "Eindelijk een app die privacy serieus neemt. De HALT tracker is nu een vast onderdeel van mijn dag.",
    author: "Software Engineer",
  },
];

export default function LandingPage() {
  return (
    <div className="text-on-background bg-background">

      {/* ── TopAppBar ── */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-outline-variant/20">
        <div className="flex justify-between items-center w-full px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[28px]">shield_lock</span>
            <span className="text-headline-md text-primary">Haven</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#" className="text-label-md text-primary font-semibold border-b-2 border-primary pb-0.5">Home</a>
            {["Methode", "Privacy", "Onderzoek"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200"
              >
                {l}
              </a>
            ))}
          </div>
          <Link
            href="/dashboard"
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-label-md hover:opacity-90 active:scale-95 transition-all atmospheric-shadow"
          >
            Start Journey
          </Link>
        </div>
      </nav>

      <main>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Serene natural landscape at dawn"
              className="w-full h-full object-cover opacity-90 scale-[1.04] transition-transform duration-[12s] hover:scale-100"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXNhqiix1bhYzHGPzUnAt2_nOk9mgh2oQWCmUWYXbBw3ATHg2O3vdXQRi-jWqA6f0PEADU1Kj2e2X6bvX9BefvRxpux0iDspEhCQL4Bq5HlT7uwqGK0T_J5Kvy_ZjDwEEIzA0G3ATOnk2z-2Hrpe96OkWij4NDq4mIZgivglm4T_Mg-yiu9FPT2i0k7WFWrAGD0NFtcw5dKXfWbKUYLc1vncqlV8-pCxLgjBRyjUJw9AMuV1W9zPI79GhHeyPEboR2B5XNJ4giidA"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 max-w-7xl mx-auto w-full pt-24 pb-32">
            <div className="max-w-xl space-y-6 animate-fade-up-1">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-primary-fixed/60 backdrop-blur-sm px-4 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-label-sm text-primary uppercase tracking-widest">Digitaal Toevluchtsoord</span>
              </div>

              <h1 className="text-headline-xl md:text-[56px] md:leading-[64px] text-on-background tracking-tight">
                Je geest verdient een{" "}
                <span className="text-primary">veilige haven.</span>
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-md">
                Privé, anoniem en volledig versleuteld. Herstel je balans zonder concessies aan je digitale veiligheid.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-up-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full text-label-md hover:opacity-90 active:scale-95 transition-all atmospheric-shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">spa</span>
                  Begin je reis
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-surface/60 backdrop-blur-sm text-on-surface px-8 py-4 rounded-full text-label-md hover:bg-surface/80 transition-all border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  Bekijk demo
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 pt-2 animate-fade-up-3">
                {[
                  { icon: "lock", label: "End-to-end encrypted" },
                  { icon: "visibility_off", label: "100% anoniem" },
                  { icon: "eu", label: "GDPR compliant" },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface/70 backdrop-blur-sm rounded-full text-label-sm text-on-surface-variant border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-primary text-[14px]">{icon}</span>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 atmospheric-fade" />
        </section>

        {/* ── Privacy Pillars ── */}
        <section className="py-24 bg-background" id="features">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className="text-label-sm text-primary tracking-widest uppercase block">
                Privacy als fundament
              </span>
              <h2 className="text-headline-lg text-on-background">Zero-Knowledge Architectuur</h2>
              <p className="text-body-md text-on-surface-variant">
                Jouw data is van jou alleen. Zelfs wij kunnen je persoonlijke reflecties niet lezen. Nooit.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRIVACY_PILLARS.map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="bg-surface-container-low p-10 rounded-[40px] flex flex-col items-start gap-6 card-hover"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'wght' 200" }}>{icon}</span>
                  </div>
                  <h3 className="text-headline-md text-primary">{title}</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Feature Bento Grid ── */}
        <section className="py-24 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
              <span className="text-label-sm text-primary tracking-widest uppercase block">Wat Haven biedt</span>
              <h2 className="text-headline-lg text-on-background">Gereedschap voor herstel</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

              {/* HALT Tracker */}
              <div className="md:col-span-7 bg-surface-container rounded-[40px] p-10 overflow-hidden relative group card-hover">
                <div className="relative z-10">
                  <span className="text-label-sm text-primary uppercase tracking-widest block mb-4">Check-in</span>
                  <h3 className="text-headline-lg text-on-background mb-4">HALT Tracker</h3>
                  <p className="text-body-md text-on-surface-variant max-w-md mb-8 leading-relaxed">
                    Een snelle dagelijkse check-in: ben je Hungry, Angry, Lonely, of Tired? Ontdek patronen voordat ze overweldigend worden.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["Hungry", "Angry", "Lonely", "Tired"].map((tag, i) => (
                      <span
                        key={tag}
                        className={`px-5 py-2 rounded-full text-label-md transition-colors ${
                          i === 1
                            ? "bg-primary text-on-primary"
                            : "bg-surface border border-outline-variant/30 text-on-surface-variant"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                  <span className="material-symbols-outlined text-[280px] text-primary" style={{ fontVariationSettings: "'wght' 100" }}>analytics</span>
                </div>
              </div>

              {/* Lifestyle photo */}
              <div className="md:col-span-5 rounded-[40px] overflow-hidden min-h-[320px] relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Minimalist lifestyle photography for wellness"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBR7LP3kUYj2mDXmS3FgX7hSmYh9bJZqQ8-u6DEzDdb6S-VimgRx6Xga40ullyXo3Cya-XMt0b_Kpuge-2vVhnc7lHv-wiKUKK33BFCe8_1BERlB07ULQjoumsj1N4IC0EwtrGsf0Wkm1Q7BFmqx3jz1frxfbRReZp4pEtmCKMklba0jfFXcEo5LVVVANzRLkyg9z1bAatTzcQJxorDMcDSuX9bMRBfmglL8RZyEHgfTTOiszZEyaSedINisGGoogJppfybGlK6yo"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    const next = el.nextElementSibling as HTMLElement | null;
                    if (next) next.classList.remove("hidden");
                  }}
                />
                <div className="hidden absolute inset-0 bg-gradient-to-br from-primary-fixed to-secondary-fixed/50" />
                <div className="absolute inset-0 bg-primary/15 mix-blend-multiply" />
              </div>

              {/* Reflection tools — full width */}
              <div className="md:col-span-12 bg-primary rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
                {/* Ambient orb */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                <div className="flex-1 relative z-10">
                  <span className="text-label-sm text-primary-fixed-dim uppercase tracking-widest block mb-4">Cognitieve Herformulering</span>
                  <h3 className="text-headline-lg text-white mb-4">Reflectie Tools</h3>
                  <p className="text-primary-fixed-dim text-body-lg mb-8 leading-relaxed">
                    Onze dual-input tool helpt je negatieve gedachtenpatronen objectief te analyseren en om te buigen naar gezondere perspectieven.
                  </p>
                  <ul className="space-y-3">
                    {["Gestructureerde dagboek-prompts", "Contextuele mood-analyse", "Versleuteld op je apparaat"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-white/90 text-body-md">
                        <span className="material-symbols-outlined text-primary-fixed-dim text-[18px]">check_circle</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full flex justify-center relative z-10">
                  <Link
                    href="/journal/reframe"
                    className="bg-white/10 backdrop-blur-md p-7 rounded-3xl w-full max-w-sm border border-white/20 hover:bg-white/15 transition-colors atmospheric-shadow group"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="h-2 w-2/5 bg-white/25 rounded-full" />
                      <span className="material-symbols-outlined text-white/40 text-[18px] group-hover:text-white/70 transition-colors">open_in_new</span>
                    </div>
                    <div className="space-y-3">
                      {["w-full", "w-full", "w-3/4"].map((w, i) => (
                        <div key={i} className={`h-10 ${w} bg-white/8 rounded-xl border border-white/10`} />
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <div className="h-9 w-28 bg-primary-fixed-dim/30 rounded-full border border-primary-fixed-dim/20" />
                    </div>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Social Proof ── */}
        <section className="py-24 bg-background overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">
            {/* Ambient blurs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary-container/6 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10">
              <div className="text-center mb-16">
                <span className="text-label-sm text-primary tracking-widest uppercase block mb-4">Ervaringen</span>
                <h2 className="text-headline-lg text-on-background">Wat gebruikers zeggen</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {TESTIMONIALS.map(({ quote, author }) => (
                  <div key={author} className="space-y-5 group">
                    <span className="material-symbols-outlined text-primary/20 text-[56px] block transition-colors group-hover:text-primary/40 duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                      format_quote
                    </span>
                    <blockquote className="text-headline-md text-on-background italic leading-relaxed">
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                    <p className="text-label-md text-on-surface-variant">— {author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto bg-surface-container-high rounded-[56px] p-12 md:p-24 text-center relative overflow-hidden">
            {/* Ambient orbs */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-fixed rounded-full mx-auto mb-2">
                <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'wght' 200" }}>spa</span>
              </div>
              <h2 className="text-headline-xl text-on-background">Klaar voor rust?</h2>
              <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
                Begin vandaag nog aan je persoonlijke reis naar balans, in volledige anonimiteit.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-3 bg-on-background text-background px-8 py-4 rounded-full text-label-md hover:scale-105 active:scale-95 transition-transform atmospheric-shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">smartphone</span>
                  Begin gratis
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-3 bg-surface text-on-surface px-8 py-4 rounded-full text-label-md hover:scale-105 active:scale-95 transition-transform border border-outline-variant/40"
                >
                  <span className="material-symbols-outlined text-[18px]">route</span>
                  Bekijk 12 Stappen
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-surface-container-low border-t border-outline-variant/30">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-12 gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">shield_lock</span>
              <span className="text-headline-md text-primary">Haven</span>
            </div>
            <p className="text-label-sm text-on-surface-variant font-normal tracking-normal">
              © 2026 Haven Sanctuary. Privacy is your right.
            </p>
          </div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Research", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-label-sm text-on-surface-variant hover:text-primary transition-colors font-normal tracking-normal"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
