import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import GateIntro from "@/components/office/GateIntro";
import SectionOverlay from "@/components/office/SectionOverlay";
import ScenePoster from "@/components/office/ScenePoster";
import { usePrefersReducedMotion, useLowPowerDevice } from "@/hooks/useMotionPreference";
import { SECTIONS, scrollState } from "@/lib/officePath";

const OfficeScene = lazy(() => import("@/components/office/OfficeScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Office Portal — A Guided Walk Through Our Studio" },
      {
        name: "description",
        content:
          "Scroll through a 3D studio interior led by a glowing guide light: who we are, what we do, our products, process, client stories and how to reach us.",
      },
      { property: "og:title", content: "Office Portal — A Guided Walk Through Our Studio" },
      {
        property: "og:description",
        content:
          "A guide light walks you through the studio — reception, cabins, workstations, meeting room, breakout wall and lounge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const reducedMotion = usePrefersReducedMotion();
  const lowPower = useLowPowerDevice();
  const staticMode = reducedMotion || lowPower;

  const [gateDone, setGateDone] = useState(false);
  const [emergeStart, setEmergeStart] = useState<number | null>(null);
  const [scrollUnlocked, setScrollUnlocked] = useState(false);
  const [showCue, setShowCue] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const unlockedRef = useRef(false);

  const handleGateFinish = useCallback(() => {
    setGateDone(true);
    setEmergeStart(performance.now());
  }, []);

  // the moment the orb emerges: unlock scroll + show the cue
  const handleEmerged = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    setScrollUnlocked(true);
    setShowCue(true);
  }, []);

  // static mode: no gate, no scroll lock, no scrub — plain page scroll
  useEffect(() => {
    if (!staticMode) return;
    unlockedRef.current = true;
    setGateDone(true);
    setScrollUnlocked(false);
    setShowCue(false);
    document.body.style.overflow = "";
  }, [staticMode]);

  // lock the page until the guide emerges
  useEffect(() => {
    if (staticMode) return;
    document.body.style.overflow = scrollUnlocked ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [scrollUnlocked, staticMode]);

  // hide the cue once the visitor actually scrolls
  useEffect(() => {
    if (!showCue) return;
    const onScroll = () => {
      if (window.scrollY > 60) setShowCue(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showCue]);

  // one page-spanning ScrollTrigger, scrub: 1
  useEffect(() => {
    if (staticMode || !scrollUnlocked) return;
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: scrollerRef.current ?? document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          scrollState.progress = self.progress;
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      const onLoad = () => refresh();
      if (document.readyState === "complete") refresh();
      else window.addEventListener("load", onLoad);
      window.addEventListener("resize", refresh);
      const t = window.setTimeout(refresh, 400);

      cleanup = () => {
        window.clearTimeout(t);
        window.removeEventListener("load", onLoad);
        window.removeEventListener("resize", refresh);
        st.kill();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [scrollUnlocked]);

  return (
    <main className="relative bg-[#0b0a09] text-[#f6efe3]">
      {/* 3D interior, fixed behind the content */}
      <div className="fixed inset-0 z-0">
        <ClientOnly fallback={null}>
          <Suspense fallback={null}>
            <OfficeScene
              emergeStart={emergeStart}
              onGuideEmerged={handleEmerged}
              scrollActive={scrollUnlocked}
            />
          </Suspense>
        </ClientOnly>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 55%, transparent 30%, rgba(11,10,9,0.75) 100%)",
          }}
        />
      </div>

      {!gateDone && <GateIntro onFinish={handleGateFinish} />}

      {/* scroll cue */}
      <div
        className="pointer-events-none fixed bottom-8 left-1/2 z-30 -translate-x-1/2 text-center"
        style={{
          opacity: showCue ? 1 : 0,
          transition: "opacity 800ms ease",
        }}
      >
        <span className="text-[0.6rem] uppercase tracking-[0.45em] text-[#f0a93a]">
          Scroll to explore
        </span>
        <div className="mx-auto mt-3 h-10 w-[1px] overflow-hidden bg-[#f0a93a]/25">
          <div className="h-4 w-full animate-[cue_1.8s_ease-in-out_infinite] bg-[#f0a93a]" />
        </div>
      </div>

      {/* existing section content, as an overlay on top of the scene */}
      <div ref={scrollerRef} className="relative z-10">
        {SECTIONS.map((section, i) => (
          <SectionOverlay
            key={section.id}
            section={section}
            index={i}
            total={SECTIONS.length}
          />
        ))}
      </div>
    </main>
  );
}
