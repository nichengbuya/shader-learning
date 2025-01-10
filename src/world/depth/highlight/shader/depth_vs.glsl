    varying vec2 vUv;
    varying vec4 vScreenPos;
    varying float vDepth;
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vScreenPos = projectionMatrix * mvPosition;
      vDepth = vScreenPos.z;
      gl_Position = vScreenPos;
    }
