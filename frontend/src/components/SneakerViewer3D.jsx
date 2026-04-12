import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { Suspense } from 'react';

function SneakerModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
      <group>
        {/* Sole */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[2.4, 0.3, 1.0]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
        </mesh>
        {/* Midsole */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[2.3, 0.2, 0.95]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.3} />
        </mesh>
        {/* Upper body */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[2.2, 0.5, 0.9]} />
          <meshStandardMaterial color="#e94560" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* Toe cap */}
        <mesh position={[1.0, 0.1, 0]}>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color="#e94560" roughness={0.5} />
        </mesh>
        {/* Ankle collar */}
        <mesh position={[-0.7, 0.55, 0]}>
          <boxGeometry args={[0.8, 0.3, 0.85]} />
          <meshStandardMaterial color="#16213e" roughness={0.6} />
        </mesh>
        {/* Tongue */}
        <mesh position={[0.1, 0.6, 0]}>
          <boxGeometry args={[0.8, 0.35, 0.5]} />
          <meshStandardMaterial color="#0f3460" roughness={0.4} />
        </mesh>
        {/* Swoosh / logo stripe */}
        <mesh position={[0, 0.2, 0.46]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[1.8, 0.08, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.2, -0.46]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[1.8, 0.08, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* Lace holders */}
        {[-0.2, 0.1, 0.4].map((x, i) => (
          <mesh key={i} position={[x, 0.48, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export default function SneakerViewer3D() {
  return (
    <div className="sneaker-3d-viewer">
      <Canvas camera={{ position: [3, 2, 3], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <SneakerModel />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={2}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={2}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
      <div className="viewer-controls-hint">
        <span>🖱️ Drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
}
