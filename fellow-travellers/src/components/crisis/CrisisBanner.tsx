"use client";

export default function CrisisBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] flex items-center justify-center gap-2 bg-surface-container-low border-t border-outline-variant/30 px-4 py-2 text-xs text-on-surface-variant">
      <span className="material-symbols-outlined text-[14px] text-primary">emergency</span>
      <span>
        In crisis?{" "}
        <a
          href="tel:113"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          113
        </a>{" "}
        (NL) ·{" "}
        <a
          href="tel:0800321234"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          0800 32 123
        </a>{" "}
        (BE) · Direct gevaar:{" "}
        <a
          href="tel:112"
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          112
        </a>
      </span>
    </div>
  );
}
