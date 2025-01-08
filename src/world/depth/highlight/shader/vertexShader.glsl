    varying vec2 vUv;
    varying vec4 vScreenPosition;
    varying float vEyeZ;
    
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vEyeZ = -mvPosition.z;
      vScreenPosition = projectionMatrix * mvPosition;
      gl_Position = vScreenPosition;
    }