    varying vec2 vUv;
    varying vec4 vScreenPos;
    varying float vEyeZ;
    varying vec2 vZW;
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vEyeZ = -mvPosition.z;
      vScreenPos = projectionMatrix * mvPosition;
      gl_Position = vScreenPos;
    }

