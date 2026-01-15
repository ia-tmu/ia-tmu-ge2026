export const fragmentShader = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uBlurStrength;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  varying vec2 vUv;
  
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)),
            dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  
  float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = step(a.yx, a.xy);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
    vec3 n = h * h * h * h *
            vec3(dot(a, hash(i)),
                  dot(b, hash(i + o)),
                  dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
  }
  
  void main() {
    // アスペクト比補正を適用
    vec2 uv = vUv;
    
    // 画像を画面全体にカバー（background-size: cover と同じ）
    float imageAspect = uImageAspect;
    float planeAspect = uPlaneAspect;
    
    vec2 scale;
    if (planeAspect > imageAspect) {
      // 画面が横長の場合
      scale = vec2(1.0, imageAspect / planeAspect);
    } else {
      // 画面が縦長の場合
      scale = vec2(planeAspect / imageAspect, 1.0);
    }
    
    // UV座標を中央揃えでスケーリング
    uv = (uv - 0.5) / scale + 0.5;
    
    // 既存のノイズブラー処理
    float blur = uBlurStrength * 0.02;
    vec2 n = vec2(
      noise(uv * 5.0),
      noise(uv * 5.0 + 10.0)
    );
    
    vec4 color = vec4(0.0);
    color += texture2D(uTexture, uv + n * blur);
    color += texture2D(uTexture, uv - n * blur);
    color += texture2D(uTexture, uv + n.yx * blur);
    color += texture2D(uTexture, uv - n.yx * blur);
    color *= 0.25;
    
    gl_FragColor = color;
  }
`;

export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
