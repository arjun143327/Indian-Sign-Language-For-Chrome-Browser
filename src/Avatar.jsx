import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

function Model({ url }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  // Static avatar - no animations
  // useEffect(() => {
  //   if (actions && Object.keys(actions).length > 0) {
  //     const firstAction = Object.keys(actions)[0];
  //     actions[firstAction].play();
  //   }
  // }, [actions]);

  return (
    <primitive
      object={scene}
      ref={group}
      scale={2.2}
      position={[0, -1.5, 0]}
    />
  );
}

const Avatar = () => {
  return (
    <div style={{ width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0.5, 3], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Model url="/readyplayerme.glb" />
      </Canvas>
    </div>
  );
};

export default Avatar;
