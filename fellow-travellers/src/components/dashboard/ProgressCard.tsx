"use client";

interface ProgressCardProps {
  visitedSteps: number[];
  total?: number;
}

export default function ProgressCard({ visitedSteps, total = 12 }: ProgressCardProps) {
  const count = visitedSteps.length;

  return (
    <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
      <div className="flex justify-between items-baseline">
        <h3 className="text-label-md text-on-surface">Je herstelreis</h3>
        <span className="text-label-sm text-primary font-semibold">
          {count}/{total} stappen
        </span>
      </div>

      {/* Stap-cirkels */}
      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: total }, (_, i) => {
          const stepNum = i + 1;
          const visited = visitedSteps.includes(stepNum);
          return (
            <div
              key={stepNum}
              title={`Stap ${stepNum}`}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all duration-300 ${
                visited
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant border border-outline-variant/30"
              }`}
            >
              {visited ? (
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                  check
                </span>
              ) : (
                stepNum
              )}
            </div>
          );
        })}
      </div>

      {count === 0 && (
        <p className="text-label-sm text-on-surface-variant font-normal">
          Begin je reis bij Stap 1 — of kies de stap die nu bij je past.
        </p>
      )}
      {count > 0 && count < total && (
        <p className="text-label-sm text-on-surface-variant font-normal">
          Goed bezig. Er is geen verkeerde volgorde.
        </p>
      )}
      {count === total && (
        <p className="text-label-sm text-primary font-normal">
          Je hebt alle stappen bezocht. ♡
        </p>
      )}
    </div>
  );
}
