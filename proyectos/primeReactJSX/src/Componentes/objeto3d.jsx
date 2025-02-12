import React from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

// Componente para cargar el modelo GLB
const Model = () => {
  // Cargar el modelo .glb desde la carpeta public/
  const { scene } = useGLTF("/cubo2.glb"); 

  return (
    <primitive object={scene} scale={1} position={[0, 0, 0]} />
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <Model /> {/* Aquí renderizamos el modelo */}
      <OrbitControls /> {/* Permite mover la cámara con el mouse */}
    </Canvas>
  );
};

export default Scene;
