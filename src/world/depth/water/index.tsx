// App.tsx or MainComponent.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import WaterShader from "./waterShader";

const Box: React.FC = () => {
  return (
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const Scene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box />
      <WaterShader />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;