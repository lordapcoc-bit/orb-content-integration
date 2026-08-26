import * as THREE from "three";

export type OfficeSection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  /** position along the curve (0 -> 1) where the guide pauses */
  u: number;
};

/**
 * Section order maps 1:1 to the interior journey:
 * Lobby -> cabins -> workstation aisle -> workstation w/ monitors ->
 * meeting room -> breakout wall -> lounge.
 */
export const SECTIONS: OfficeSection[] = [
  {
    id: "hero",
    eyebrow: "Reception",
    title: "Welcome to the Office Portal",
    body: "Step past the gate and let the guide light show you around the studio, one room at a time.",
    u: 0.0,
  },
  {
    id: "who-we-are",
    eyebrow: "The cabins",
    title: "Who we are",
    body: "A compact team of strategists, designers and engineers sharing the same corridor and the same standards.",
    u: 1 / 6,
  },
  {
    id: "what-we-do",
    eyebrow: "Workstation aisle",
    title: "What we do",
    body: "Product design, front-of-house web experiences and the quiet systems work that keeps them fast.",
    u: 2 / 6,
  },
  {
    id: "products",
    eyebrow: "Desk 04",
    title: "Products",
    body: "Portals, dashboards and internal tools — shipped as living software, not slide decks.",
    u: 3 / 6,
  },
  {
    id: "process",
    eyebrow: "Meeting room",
    title: "How we work",
    body: "Discover, shape, build, refine. Short loops, visible progress, no black boxes.",
    u: 4 / 6,
  },
  {
    id: "stories",
    eyebrow: "Breakout wall",
    title: "Client stories",
    body: "\u201cThey walked us through their thinking the same way they walk you through this office.\u201d",
    u: 5 / 6,
  },
  {
    id: "cta",
    eyebrow: "Lounge",
    title: "Let's talk",
    body: "Pull up a chair. Tell us what you are building and we will tell you how we would start.",
    u: 1.0,
  },
];

/** Guide path threaded through the interior. */
export const GUIDE_CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 1.5, 1.5), // reception desk (emergence point)
    new THREE.Vector3(-1.4, 1.7, -6),
    new THREE.Vector3(-2.2, 1.6, -13), // cabins
    new THREE.Vector3(0, 1.8, -20),
    new THREE.Vector3(1.6, 1.6, -26), // workstation aisle
    new THREE.Vector3(2.2, 1.4, -33),
    new THREE.Vector3(2.4, 1.3, -37), // workstation with monitors
    new THREE.Vector3(0.6, 1.7, -43),
    new THREE.Vector3(-2.0, 1.7, -48), // meeting room
    new THREE.Vector3(-2.4, 1.6, -55),
    new THREE.Vector3(-1.2, 1.6, -59), // breakout wall
    new THREE.Vector3(0.8, 1.5, -65),
    new THREE.Vector3(1.2, 1.4, -70), // lounge
  ],
  false,
  "catmullrom",
  0.4,
);

export const EMERGENCE_POINT = new THREE.Vector3(0, -0.4, 1.4);

/** Shared scroll state written by ScrollTrigger, read inside useFrame. */
export const scrollState = { progress: 0 };

const HOLD = 0.42; // portion of each section's scroll spent paused

/**
 * Maps raw page scroll progress to a curve position that pauses at each
 * section anchor instead of gliding straight through.
 */
export function progressToU(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 1);
  const steps = SECTIONS.length - 1;
  const seg = Math.min(Math.floor(p * steps), steps - 1);
  const local = p * steps - seg;
  const from = SECTIONS[seg].u;
  const to = SECTIONS[seg + 1].u;
  const travel = Math.min(local / (1 - HOLD), 1);
  const eased = travel * travel * (3 - 2 * travel);
  return from + (to - from) * eased;
}

export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
