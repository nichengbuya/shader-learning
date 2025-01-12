precision highp float;
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat3 normalMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

varying vec2 vUv;
varying float vRim;
varying float vDepth;

void main() {
  vUv = uv;
  vUv.x += time * 0.0001;
  vUv.y += time * 0.0006;

  vec3 n = normalMatrix * normal;
  vec4 viewPosition = modelViewMatrix * vec4( position, 1. );
  vec3 eye = normalize(-viewPosition.xyz);
  vRim = 1.0 - abs(dot(eye,n));
  vRim = pow(vRim, 2.);
  vec3 worldPosition = (modelMatrix * vec4(position, 1.)).xyz;  
  gl_Position = projectionMatrix * viewPosition;
  vDepth = gl_Position.z;
}


