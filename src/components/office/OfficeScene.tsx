import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import OfficeInterior from "./OfficeInterior";
import GuideObject from "./GuideObject";
import ScrollRig from "./ScrollRig";

export default function OfficeScene({
  emergeStart,
  onGuideEmerged,
  scrollActive,
}: {
  emergeStart: number | null;
  onGuideEmerged: () => void;
  scrollActive: boolean;
}) {
  const guideTarget = useRef(new THREE.Vector3(0, 1.5, 1.5));

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.85, 6], fov: 55, near: 0.1, far: 160 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#0b0a09");
        scene.fog = new THREE.Fog("#0b0a09", 12, 46);
      }}
    >
      <ambientLight intensity={0.35} color="#cbb79a" />
      <hemisphereLight args={["#f3e0c0", "#12100e", 0.35]} />
      <directionalLight position={[3, 6, 4]} intensity={0.45} color="#ffe8c4" />
      <Suspense fallback={null}>
        <OfficeInterior />
      </Suspense>
      <GuideObject targetRef={guideTarget} emergeStart={emergeStart} onEmerged={onGuideEmerged} />
      <ScrollRig guideTarget={guideTarget} active={scrollActive} />
    </Canvas>
  );
}
