precision highp float;

#include <packing>

uniform sampler2D depthBuffer;
uniform vec2 resolution;
uniform sampler2D mainTex;
varying vec2 vUv;
varying float vDepth;

void main() {
    // Base color
    vec4 baseColor = texture2D(mainTex , vUv);
    vec4 color = baseColor;

    // Edge highlight
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 packedDepth = texture2D(depthBuffer, uv); // Ensure 2D texture lookup
    float sceneDepth = unpackRGBAToDepth(packedDepth);
    float depth = (vDepth - 0.1) / (10.0 - 0.1);
    // float diff = abs(depth - sceneDepth);
    float intersectionWidth = 0.01;
    vec3 intersectionColor = vec3(1.0, 1.0, 0.0);
    float halfWidth = intersectionWidth / 2.0;
    float diff = clamp(abs(sceneDepth - depth) / halfWidth, 0.0, 1.0);


    vec3 finalColor = mix(intersectionColor, color.rgb, diff);
    gl_FragColor = vec4(finalColor, 1.0);
}