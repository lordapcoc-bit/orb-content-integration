import { useEffect, useRef, useState } from "react";
import type { OfficeSection } from "@/lib/officePath";

/**
 * Existing section content, revealed as an HTML overlay on top of the 3D scene
 * while the guide pauses at the matching part of the interior.
 */
export default function SectionOverlay({
  section,
  index,
  total,
  reducedMotion = false,
}: {
  section: OfficeSection;
  index: number;
  total: number;
  reducedMotion?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(index === 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setVisible(e.isIntersecting)),
      { threshold: 0.35, rootMargin: "-10% 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const alignLeft = index % 2 === 0;

  return (
    <section
      id={section.id}
      ref={ref}
      aria-labelledby={`${section.id}-title`}
      className="flex min-h-dvh w-full items-center px-6 py-20 sm:px-12 lg:px-20"
      style={{ justifyContent: alignLeft ? "flex-start" : "flex-end" }}
    >
      <div
        className="max-w-md rounded-2xl border border-[#f0a93a]/20 bg-[#0b0a09]/70 p-7 backdrop-blur-md sm:p-9"
        style={{
          opacity: visible ? 1 : 0,
          transform: reducedMotion
            ? undefined
            : `translate3d(0, ${visible ? "0px" : "34px"}, 0)`,
          transition: reducedMotion
            ? "opacity 300ms ease"
            : "opacity 700ms ease, transform 900ms cubic-bezier(0.22,1,0.36,1)",
          boxShadow: "0 30px 80px -40px rgba(240,169,58,0.45)",
        }}
      >
        <p className="mb-3 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.4em] text-[#f0a93a]">
          <span className="h-[1px] w-6 bg-[#f0a93a]/70" />
          {section.eyebrow}
        </p>
        {index === 0 ? (
          <h1 className="text-3xl font-semibold leading-tight text-[#f6efe3] sm:text-4xl">
            {section.title}
          </h1>
        ) : (
          <h2 className="text-2xl font-semibold leading-tight text-[#f6efe3] sm:text-3xl">
            {section.title}
          </h2>
        )}
        <p className="mt-4 text-sm leading-relaxed text-[#c9bfae]">{section.body}</p>
        {section.id === "cta" && (
          <a
            href="mailto:hello@officeportal.studio"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f0a93a] px-5 py-2.5 text-sm font-medium text-[#17130c] transition-transform hover:scale-[1.03]"
          >
            Start a conversation
          </a>
        )}
        <p className="mt-6 text-[0.6rem] uppercase tracking-[0.35em] text-[#6f6656]">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
