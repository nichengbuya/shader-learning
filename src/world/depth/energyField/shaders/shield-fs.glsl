precision highp float;

#include <packing>

uniform sampler2D depthBuffer;
uniform vec2 resolution;
uniform float time;
uniform sampler2D u_tex;

varying float vRim;
varying vec2 vUv;
varying float vDepth;

void main() {
    // Base color
    vec4 baseColor = vec4(0.0, 0.9, 0.0, 0.1);
    vec4 color = baseColor;

    // Dynamic texture
    vec4 maskA = texture2D(u_tex, vUv); // Ensure correct function
    maskA.a = maskA.r;
    color += maskA;

    // Edge highlight
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 packedDepth = texture2D(depthBuffer, uv); // Ensure 2D texture lookup
    float sceneDepth = unpackRGBAToDepth(packedDepth);
    float depth = (vDepth - 0.1) / (10.0 - 0.1);
    float diff = abs(depth - sceneDepth);
    float contact = diff * 20.0;
    contact = 1.0 - contact;
    contact = max(contact, 0.0);
    contact = pow(contact, 20.0);
    contact *= diff * 1000.0;
    float a = max(contact, vRim);
    float fade = 1.0 - pow(vRim, 10.0);

    // Add edge effect to the final color
    color.a += a * fade;

    // Final output color
    gl_FragColor = color;
}