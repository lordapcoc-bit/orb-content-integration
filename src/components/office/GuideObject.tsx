import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * The guide: a soft glowing amber orb. It does not fade in from nothing —
 * `emergeStart` marks the moment it starts rising from behind the reception
 * desk into the room, and only after that does the scroll rig take over.
 */
export default function GuideObject({
  targetRef,
  emergeStart,
  onEmerged,
}: {
  targetRef: React.MutableRefObject<THREE.Vector3>;
  emergeStart: number | null;
  onEmerged?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const emergedFired = useRef(false);
  const emerge = useRef(0);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // --- emergence: rise out from behind the reception desk ---
    if (emergeStart !== null) {
      const elapsed = (performance.now() - emergeStart) / 1000;
      emerge.current = THREE.MathUtils.clamp(elapsed / 1.6, 0, 1);
      if (!emergedFired.current && emerge.current > 0.35) {
        emergedFired.current = true;
        onEmerged?.();
      }
    }

    const e = emerge.current;
    const eased = 1 - Math.pow(1 - e, 3);

    // path target from the scroll rig, blended with the emergence rise
    const target = targetRef.current;
    const riseY = THREE.MathUtils.lerp(-0.4, target.y, eased);
    const desired = new THREE.Vector3(
      THREE.MathUtils.lerp(0, target.x, eased),
      riseY + Math.sin(t * 1.1) * 0.06 * eased,
      THREE.MathUtils.lerp(1.4, target.z, eased),
    );

    // lerp, never snap
    const k = 1 - Math.exp(-(e < 1 ? 6 : 4.5) * dt);
    g.position.lerp(desired, k);

    const scale = THREE.MathUtils.lerp(0.25, 1, eased) * (1 + Math.sin(t * 2.2) * 0.03);
    g.scale.setScalar(scale);

    if (core.current) {
      const m = core.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, 2.4 + Math.sin(t * 3) * 0.3, 0.1);
    }
    if (halo.current) {
      halo.current.rotation.z = t * 0.35;
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.16 * eased + Math.sin(t * 2) * 0.02;
    }
    if (light.current) {
      light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, 6 * eased, 0.08);
    }
  });

  return (
    <group ref={group} position={[0, -0.4, 1.4]}>
      <mesh ref={core}>
        <sphereGeometry args={[0.17, 32, 32]} />
        <meshStandardMaterial
          color="#ffd894"
          emissive="#f5a623"
          emissiveIntensity={2.4}
          roughness={0.2}
        />
      </mesh>
      <mesh scale={2.6}>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={halo} scale={1}>
        <ringGeometry args={[0.34, 0.44, 48]} />
        <meshBasicMaterial color="#ffc46b" transparent opacity={0.16} depthWrite={false} side={2} />
      </mesh>
      <pointLight ref={light} color="#ffb547" intensity={0} distance={11} decay={2} />
    </group>
  );
}
