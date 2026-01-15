"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace } from "three";
import { useState, useEffect, useMemo, useRef } from "react";
import { vertexShader, fragmentShader } from "./shaders";
import * as THREE from "three";

function BackgroundPlane() {
  const { viewport, size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollRef = useRef(0);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [imageAspect, setImageAspect] = useState(1);

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      "/images/top/fv/fv-bg.png",
      (loadedTexture) => {
        loadedTexture.colorSpace = SRGBColorSpace;
        loadedTexture.wrapS = loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;

        // 画像のアスペクト比を計算
        const aspect = loadedTexture.image.width / loadedTexture.image.height;
        setImageAspect(aspect);
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Texture loading error:', error);
      }
    );
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window !== 'undefined') {
        scrollRef.current = window.scrollY || 0;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uBlurStrength: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(size.width, size.height),
      },
      uImageAspect: { value: imageAspect },
      uPlaneAspect: { value: size.width / size.height },
    }),
    [texture, size.width, size.height, imageAspect]
  );

  useFrame(() => {
    if (!materialRef.current) return;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1;
    const blur = Math.min(scrollRef.current / viewportHeight, 1);
    materialRef.current.uniforms.uBlurStrength.value = blur;
    materialRef.current.uniforms.uPlaneAspect.value = size.width / size.height;
  });

  if (!texture) return null;

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function FixedBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        width: '100vw',
        height: '100vh',
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 5], zoom: 1 }}
        dpr={[1, 1.5]}
        gl={{
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          antialias: false,
        }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (e) => {
            console.log('WebGL context lost', e);
            e.preventDefault();
          });
          canvas.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored');
          });
        }}
      >
        <BackgroundPlane />
      </Canvas>
    </div>
  );
}
