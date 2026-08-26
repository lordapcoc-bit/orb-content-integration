import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Gate intro: two panels part to reveal the interior, then the overlay
 * releases and the guide is told to emerge. Skippable at any point.
 */
export default function GateIntro({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");
  const fired = useRef(false);

  const finish = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    setPhase("done");
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("opening"), 650);
    const t2 = window.setTimeout(finish, 2600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [finish]);

  // Escape also skips
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  const open = phase !== "closed";

  return (
    <div className="fixed inset-0 z-40" style={{ pointerEvents: phase === "done" ? "none" : "auto" }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: phase === "done" ? 0 : 1, transition: "opacity 700ms ease 400ms" }}
        aria-hidden="true"
      >
        {(["left", "right"] as const).map((side) => (
          <div
            key={side}
            className="absolute top-0 h-full w-1/2"
            style={{
              [side]: 0,
              background:
                "linear-gradient(" +
                (side === "left" ? "100deg" : "260deg") +
                ", #100e0c 0%, #1a1713 55%, #0b0a09 100%)",
              borderInlineEnd: side === "left" ? "1px solid rgba(240,169,58,0.35)" : undefined,
              borderInlineStart: side === "right" ? "1px solid rgba(240,169,58,0.35)" : undefined,
              transform: open
                ? `translateX(${side === "left" ? "-100%" : "100%"})`
                : "translateX(0)",
              transition: "transform 1900ms cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          >
            <div
              className="absolute top-1/2 h-24 w-[2px] -translate-y-1/2"
              style={{
                [side === "left" ? "right" : "left"]: "18px",
                background: "linear-gradient(180deg, transparent, #f0a93a, transparent)",
              }}
            />
          </div>
        ))}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: open ? 0 : 1, transition: "opacity 600ms ease" }}
        >
          <p className="text-[0.7rem] uppercase tracking-[0.45em] text-[#f0a93a]">Office Portal</p>
        </div>
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-8 right-6 inline-flex min-h-11 items-center rounded-full border border-[#f0a93a]/40 px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.35em] text-[#f0a93a] transition-colors hover:bg-[#f0a93a]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0a93a] sm:right-10"
        style={{ opacity: phase === "done" ? 0 : 1, transition: "opacity 400ms ease" }}
      >
        Skip intro
      </button>
    </div>
  );
}
