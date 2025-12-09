import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

function Model({ url }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play the first animation if available
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.keys(actions)[0];
      actions[firstAction].play();
    }
  }, [actions]);

  return (
    <primitive
      object={scene}
      ref={group}
      scale={2}
      position={[0, -2, 0]}
    />
  );
}

const Avatar = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Model url="/readyplayerme.glb" />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Avatar;
