"use client"
import { Suspense, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useAspect, useTexture } from "@react-three/drei"
import * as THREE from "three"

function Moya() {
  const texture = useTexture("/images/top/texture.png") as THREE.Texture;
  // const texture = useTexture("/images/top/fv/fv-bg.png")

  const { width, height } = texture.image as HTMLImageElement
  const scale = useAspect(width, height, 1)

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(width, height) },
        },
        vertexShader: `
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uTime;
          uniform vec2 uResolution;
          varying vec2 vUv;
          
          // Perlin Noise 3D
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

          float cnoise(vec3 P) {
            vec3 Pi0 = floor(P);
            vec3 Pi1 = Pi0 + vec3(1.0);
            Pi0 = mod289(Pi0);
            Pi1 = mod289(Pi1);
            vec3 Pf0 = fract(P);
            vec3 Pf1 = Pf0 - vec3(1.0);
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;

            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);

            vec4 gx0 = ixy0 * (1.0 / 7.0);
            vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);

            vec4 gx1 = ixy1 * (1.0 / 7.0);
            vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);

            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);

            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
            return 2.2 * n_xyz;
          }
          
          // ブラー関数
          vec4 blur(sampler2D image, vec2 uv, vec2 resolution, float blurSize) {
            vec4 color = vec4(0.0);
            float total = 0.0;
            
            for(float x = -4.0; x <= 4.0; x++) {
              for(float y = -4.0; y <= 4.0; y++) {
                vec2 offset = vec2(x, y) * blurSize / resolution;
                color += texture2D(image, uv + offset);
                total += 1.0;
              }
            }
            
            return color / total;
          }
          
          void main() {
            float noiseSize = 4.0;
            float speed = uTime * 0.3;

            // Perlin noiseでマスクを生成
            vec3 noiseCoord = vec3(vUv * noiseSize, speed);

            float noise = cnoise(noiseCoord);
            // noise += cnoise(noiseCoord * 2.0) * 0.5;
            

            // 画像をブラーにする start ----------
            // ブラーの強度をnoiseで制御
            // float blurAmount = noise * 10.0;
            // vec4 blurredColor = blur(uTexture, vUv, uResolution, blurAmount);
            
            // 元の画像
            // vec4 originalColor = texture2D(uTexture, vUv);
            
            // noiseの値に応じてブラーと元画像をミックス
            // vec4 finalColor = mix(originalColor, blurredColor, noise);
            // 画像をブラーにする end ----------

            vec3 colorBlack = vec3(0.8);
            vec3 colorWhite = vec3(0.95);

            vec3 finalColor = mix(colorBlack, colorWhite, noise);

            vec3 textureColor = texture2D(uTexture, vUv).rgb;
            vec3 diff = abs(finalColor - textureColor);
            diff = clamp(diff, 0.0, 1.0);
            vec3 textured = mix(finalColor, diff, 0.1);
            
            // gl_FragColor = vec4(vec3(noise), 1.0);
            // gl_FragColor = vec4(finalColor, 1.0);
            gl_FragColor = vec4(textured, 1.0);
          }
        `,
      }),
    [texture, width, height]
  )

  useFrame((state) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  )
}

export default function MoyaBG() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1
    }}>
      <Canvas
        className="absolute top-0 left-0"
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            console.log('WebGL context lost')
          })

          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored')
          })
        }}
      >
        <Suspense fallback={null}>
          <Moya />
        </Suspense>
      </Canvas>
    </div>
  )
}
