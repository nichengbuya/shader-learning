precision highp float;

#include <packing>

varying vec2 vUv;
varying float vDepth;

// out vec4 color;

void main() {
  float depth = (vDepth - .1) / ( 10.0 -.1);
  gl_FragColor = packDepthToRGBA(depth);
}

