precision highp float;

varying vec2 vUv;
varying vec4 vScreenPos;
void main() {
  vUv = uv;
  vec4 viewPosition = modelViewMatrix * vec4( position, 1. );
  vec3 worldPosition = (modelMatrix * vec4(position, 1.)).xyz;  
  gl_Position = projectionMatrix * viewPosition;
}


