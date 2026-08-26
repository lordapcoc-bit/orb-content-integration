import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { GUIDE_CURVE, progressToU, scrollState } from "@/lib/officePath";

const tmp = new THREE.Vector3();
const camTmp = new THREE.Vector3();
const lookTmp = new THREE.Vector3();

/**
 * Reads the shared scroll progress (written by a single page-spanning
 * ScrollTrigger with scrub) and drives both the guide target and the camera.
 * The camera trails the guide along the same curve. Everything is damped in
 * useFrame so nothing snaps, at any scroll speed.
 */
export default function ScrollRig({
  guideTarget,
  active,
}: {
  guideTarget: React.MutableRefObject<THREE.Vector3>;
  active: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const smoothU = useRef(0);
  const look = useRef(new THREE.Vector3(0, 1.5, -4));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const targetU = active ? progressToU(scrollState.progress) : 0;

    // damped progress along the curve -> smooth at any scroll speed
    smoothU.current += (targetU - smoothU.current) * (1 - Math.exp(-5 * dt));
    const u = THREE.MathUtils.clamp(smoothU.current, 0, 1);

    // guide position on the curve
    GUIDE_CURVE.getPointAt(u, tmp);
    guideTarget.current.copy(tmp);

    // camera trails behind the guide on the same curve
    const camU = THREE.MathUtils.clamp(u - 0.045, 0, 1);
    GUIDE_CURVE.getPointAt(camU, camTmp);
    camTmp.y += 0.35;
    camTmp.x *= 0.55;
    camTmp.z += 3.6;

    camera.position.lerp(camTmp, 1 - Math.exp(-3.5 * dt));

    // look slightly ahead of the guide
    GUIDE_CURVE.getPointAt(THREE.MathUtils.clamp(u + 0.02, 0, 1), lookTmp);
    look.current.lerp(lookTmp, 1 - Math.exp(-3 * dt));
    camera.lookAt(look.current);
  });

  return null;
}
