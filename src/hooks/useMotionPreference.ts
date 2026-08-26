import { useEffect, useState } from "react";

/**
 * True when the visitor has asked for reduced motion.
 * Starts false on the server / first paint and updates after hydration so it
 * never causes a hydration mismatch.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return reduced;
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/**
 * Conservative low-power heuristic: data saver, low RAM, very few cores,
 * a slow connection or no WebGL support all disqualify the 3D layer.
 */
export function detectLowPower(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as NavigatorWithHints;

  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) return true;
  const et = nav.connection?.effectiveType;
  if (et === "slow-2g" || et === "2g") return true;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!gl) return true;
  } catch {
    return true;
  }

  return false;
}

/** Resolves after hydration; false during SSR so markup stays stable. */
export function useLowPowerDevice(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    setLow(detectLowPower());
  }, []);
  return low;
}
