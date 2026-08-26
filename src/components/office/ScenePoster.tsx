import posterSrc from "@/assets/office-poster.jpg";

/**
 * Static fallback for the 3D layer: shown when the visitor prefers reduced
 * motion or the device can't comfortably run WebGL.
 */
export default function ScenePoster({ reason }: { reason: "reduced-motion" | "low-power" }) {
  return (
    <img
      src={posterSrc}
      width={1920}
      height={1088}
      alt="The studio interior at night: a glowing amber guide light floating in the corridor between glass cabins, workstations and the lounge."
      className="h-full w-full object-cover"
      data-fallback-reason={reason}
      decoding="async"
    />
  );
}
