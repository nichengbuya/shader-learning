// WaterShader.js
import React, { useRef } from "react";
import * as THREE from "three";

const WaterShader = () => {
  const shaderRef = useRef<any>();

  const fragmentShader = `
    varying vec2 vZW;
    varying vec4 vScreenPos;
    varying vec2 vUv;
    uniform float uFar;
    uniform float uNear;
    uniform sampler2D depthTex;
    
    #include <packing>
    float zNDCToZView(float zNDC) {
      float zView = (2.0 * uFar * uNear) / (zNDC * (uFar - uNear) - (uFar + uNear));
      return -zView;
    }
     
    void main () {
      float z = vZW.x / vZW.y;
      float depth = zNDCToZView(z);
     
      vec3 screenPos = vScreenPos.xyz / vScreenPos.w;
      screenPos = screenPos * 0.5 + 0.5;
         
      float depthSample = unpackRGBAToDepth(texture(depthTex, screenPos.xy));
      float sceneDepth = depthSample * (uFar - uNear) + uNear;
     
      float diff =  sceneDepth - depth;
      float waterDiff01 = clamp(diff / 0.8, 0.0, 1.0);
     
      vec3 depthColor = vec3(0.0, 0.0, 0.5);
      vec3 shallowColor = vec3(0.0, 0.8, 1.0);
         
      vec3 waterColor = mix(shallowColor, depthColor, waterDiff01);
      gl_FragColor = vec4(waterColor, 1.0);
    }
  `;

  const vertexShader = `
    varying vec2 vZW;
    varying vec4 vScreenPos;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vScreenPos = gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vZW = gl_Position.zw;
    }
  `;

  // Create a framebuffer for rendering depth texture
  const depthTexture = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    }
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5, 5, 32, 32]} />
      <shaderMaterial
        ref={shaderRef}
        args={[
          {
            uniforms: {
              uFar: { value: 1000 },
              uNear: { value: 1 },
              depthTex: { value: depthTexture.texture },
            },
            fragmentShader,
            vertexShader,
            transparent: true,
          },
        ]}
      />
    </mesh>
  );
};

export default WaterShader;