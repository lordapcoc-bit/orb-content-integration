import * as THREE from "three";
import { useMemo } from "react";

const WALL = "#1b1a19";
const FLOOR = "#0f0e0d";
const PANEL = "#26241f";
const GLASS = "#3a4a4f";
const AMBER = "#f0a93a";

function Desk({
  position,
  rotation = 0,
  width = 3,
  depth = 1.2,
}: {
  position: [number, number, number];
  rotation?: number;
  width?: number;
  depth?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.08, depth]} />
        <meshStandardMaterial color={PANEL} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[width * 0.9, 0.7, depth * 0.85]} />
        <meshStandardMaterial color="#1a1917" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Monitor({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.05, 0.6, 0.05]} />
        <meshStandardMaterial color="#0b0b0c" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.32, 0.031]}>
        <planeGeometry args={[0.95, 0.5]} />
        <meshStandardMaterial color="#2b3d55" emissive="#3d6ea8" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.28, 0.06, 0.18]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
    </group>
  );
}

function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.55, 0.08, 0.55]} />
        <meshStandardMaterial color="#232120" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.75, -0.24]}>
        <boxGeometry args={[0.55, 0.6, 0.08]} />
        <meshStandardMaterial color="#232120" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 10]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

function CabinPod({ z, side }: { z: number; side: 1 | -1 }) {
  return (
    <group position={[side * 3.6, 0, z]}>
      {/* glass partition */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.08, 2.8, 4.2]} />
        <meshStandardMaterial
          color={GLASS}
          transparent
          opacity={0.22}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, 2.85, 0]}>
        <boxGeometry args={[0.14, 0.1, 4.3]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.25} />
      </mesh>
      <Desk position={[side * 1.4, 0, 0]} rotation={(side * Math.PI) / 2} width={2.4} />
      <Chair position={[side * 0.7, 0, 0]} />
    </group>
  );
}

function StripLight({ z }: { z: number }) {
  return (
    <mesh position={[0, 3.35, z]}>
      <boxGeometry args={[5.5, 0.06, 0.22]} />
      <meshStandardMaterial color="#fff3dd" emissive="#ffe2b0" emissiveIntensity={1.4} />
    </mesh>
  );
}

export default function OfficeInterior() {
  const cabinZ = useMemo(() => [-10, -14.5, -19], []);
  const aisleZ = useMemo(() => [-24, -28, -32, -36], []);

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -34]} receiveShadow>
        <planeGeometry args={[22, 92]} />
        <meshStandardMaterial color={FLOOR} roughness={0.75} metalness={0.1} />
      </mesh>
      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, -34]}>
        <planeGeometry args={[22, 92]} />
        <meshStandardMaterial color="#151413" roughness={1} />
      </mesh>
      {/* side walls */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 6.5, 1.75, -34]} rotation={[0, (-s * Math.PI) / 2, 0]}>
          <planeGeometry args={[92, 3.5]} />
          <meshStandardMaterial color={WALL} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* back wall behind reception */}
      <mesh position={[0, 1.75, 4]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[13, 3.5]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      {/* end wall */}
      <mesh position={[0, 1.75, -76]}>
        <planeGeometry args={[13, 3.5]} />
        <meshStandardMaterial color="#201d19" roughness={0.9} />
      </mesh>

      {/* ---------- reception / lobby ---------- */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.55, 0.2]} castShadow>
          <boxGeometry args={[4.6, 1.1, 1]} />
          <meshStandardMaterial color={PANEL} roughness={0.55} />
        </mesh>
        <mesh position={[0, 1.13, 0.2]}>
          <boxGeometry args={[4.9, 0.08, 1.25]} />
          <meshStandardMaterial color="#3a352c" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.12, 0.2]}>
          <boxGeometry args={[4.7, 0.06, 1.1]} />
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.8} />
        </mesh>
        {/* logo wall lettering bar */}
        <mesh position={[0, 2.2, 3.9]}>
          <boxGeometry args={[3.2, 0.5, 0.06]} />
          <meshStandardMaterial color="#2b2721" emissive={AMBER} emissiveIntensity={0.12} />
        </mesh>
        <Chair position={[0, 0, -1.1]} />
      </group>

      {/* ---------- cabins ---------- */}
      {cabinZ.map((z) => (
        <group key={z}>
          <CabinPod z={z} side={-1} />
          <CabinPod z={z} side={1} />
        </group>
      ))}

      {/* ---------- workstation aisle ---------- */}
      {aisleZ.map((z, i) => (
        <group key={z}>
          <Desk position={[-2.6, 0, z]} width={3.4} />
          <Desk position={[2.6, 0, z]} width={3.4} />
          <Chair position={[-2.6, 0, z + 1.1]} />
          <Chair position={[2.6, 0, z + 1.1]} />
          {i % 2 === 0 && (
            <>
              <Monitor position={[-3.2, 0.76, z]} rotation={0.2} />
              <Monitor position={[-1.9, 0.76, z]} rotation={-0.2} />
            </>
          )}
          {/* the hero workstation with monitors */}
          {z === -36 && (
            <>
              <Monitor position={[3.2, 0.76, z]} rotation={0.25} />
              <Monitor position={[1.95, 0.76, z]} rotation={-0.25} />
              <Monitor position={[2.6, 1.42, z - 0.1]} />
            </>
          )}
        </group>
      ))}

      {/* ---------- meeting room ---------- */}
      <group position={[-2.6, 0, -48]}>
        <mesh position={[2.2, 1.5, 0]}>
          <boxGeometry args={[0.08, 3, 8]} />
          <meshStandardMaterial color={GLASS} transparent opacity={0.18} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.1, 28]} />
          <meshStandardMaterial color="#332e26" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.18, 0.35, 0.72, 16]} />
          <meshStandardMaterial color="#1a1917" />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          return <Chair key={i} position={[Math.cos(a) * 2.1, 0, Math.sin(a) * 2.1]} />;
        })}
        <mesh position={[-1.9, 1.7, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3.4, 1.9]} />
          <meshStandardMaterial color="#14202c" emissive="#2f5f8a" emissiveIntensity={0.45} />
        </mesh>
      </group>

      {/* ---------- breakout wall ---------- */}
      <group position={[0, 0, -59]}>
        <mesh position={[-5.2, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[9, 3.2]} />
          <meshStandardMaterial color="#241f19" roughness={0.9} />
        </mesh>
        {[-2.6, -0.6, 1.4, 3.4].map((z, i) => (
          <mesh key={z} position={[-5.1, i % 2 === 0 ? 2 : 1.35, z]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.4, 0.95]} />
            <meshStandardMaterial
              color="#2f2a22"
              emissive={AMBER}
              emissiveIntensity={i % 2 === 0 ? 0.22 : 0.12}
            />
          </mesh>
        ))}
        <mesh position={[-3.6, 0.45, 0]}>
          <boxGeometry args={[1.6, 0.9, 5]} />
          <meshStandardMaterial color="#2a2521" roughness={0.85} />
        </mesh>
      </group>

      {/* ---------- lounge ---------- */}
      <group position={[1.2, 0, -70]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[4.4, 0.8, 1.7]} />
          <meshStandardMaterial color="#332b23" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.95, -0.75]}>
          <boxGeometry args={[4.4, 0.9, 0.25]} />
          <meshStandardMaterial color="#3a3128" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.36, 2.1]}>
          <cylinderGeometry args={[0.9, 0.9, 0.12, 24]} />
          <meshStandardMaterial color="#2a251f" roughness={0.6} />
        </mesh>
        <mesh position={[0, 2.6, -1.2]}>
          <sphereGeometry args={[0.4, 20, 20]} />
          <meshStandardMaterial color="#fff0d4" emissive="#ffd79a" emissiveIntensity={1.1} />
        </mesh>
      </group>

      {/* ceiling strip lights */}
      {Array.from({ length: 15 }, (_, i) => (
        <StripLight key={i} z={-i * 5} />
      ))}
    </group>
  );
}
