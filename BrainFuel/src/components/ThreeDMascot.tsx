import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene) {
      // Center the model
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      
      // Scale the model to fit nicely
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.5 / maxDim;
      scene.scale.setScalar(scale);
    }
  }, [scene]);

  useFrame((state) => {
    if (modelRef.current) {
      // Gentle rotation animation
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return <primitive ref={modelRef} object={scene} />;
}

interface ThreeDMascotProps {
  onClick?: () => void;
  isOpen?: boolean;
  className?: string;
}

const ThreeDMascot = ({ onClick, isOpen, className = "" }: ThreeDMascotProps) => {
  return (
    <div 
      onClick={onClick}
      className={`w-20 h-20 cursor-pointer transition-all duration-300 hover:scale-110 fixed bottom-4 right-6 z-50 ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} />
        <pointLight position={[-10, -10, -5]} intensity={1.2} />
        <pointLight position={[0, 10, 0]} intensity={0.8} />
        
        <Model url="/base_basic_pbr.glb" />
        
        {/* Disable controls for the small button */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDMascot;
