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
    float edgeWidth = 0.01;
    vec2 uv = gl_FragCoord.xy / resolution;
    
    // Fetch depth from the depthBuffer
    vec4 packedDepth = texture2D(depthBuffer, uv);
    float sceneDepth = unpackRGBAToDepth(packedDepth);
    
    // Compute depth difference
    float depth = (vDepth - 0.1) / (10.0 - 0.1);
    float diff = abs(depth - sceneDepth);
    
    // Compute color change based on edge width
    float change = clamp(diff / edgeWidth, 0.0, 1.0);
    
    // Base color determined by depth
    vec4 base_color = mix(vec4(0.0, 0.9, 0.0, 1.0), vec4(0.0, 0.0, 0.0, 0.0), change);

    // Edge color determined by rim effect
    vec4 edge_color = mix(vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.9, 0.0, 1.0), vRim);

    // Combine base color and edge color
    vec4 d_color = base_color + edge_color;

    // Output the final color
    gl_FragColor = vec4(d_color.rgb, max(base_color.a, edge_color.a));
}