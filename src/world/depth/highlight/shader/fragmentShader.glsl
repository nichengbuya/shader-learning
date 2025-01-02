#include <packing>
uniform sampler2D tDepth;
uniform vec3 highlightColor;
uniform float cameraNear;
uniform float cameraFar;
uniform float intersectionWidth;

varying vec4 vWorldPosition;

float readDepth(sampler2D depthSampler, vec2 coord) {
    float fragCoordZ = texture2D(depthSampler, coord).x;
    return perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
}

void main() {
    // Calculate the screen space position of the current fragment
    vec3 screenPosition = (gl_FragCoord.xyz / gl_FragCoord.w);

    // Retrieve the depth of the current fragment from depth texture
    float currentFragmentDepth = readDepth(tDepth, gl_FragCoord.xy / vec2(textureSize(tDepth, 0)));

    // Calculate the world space position of the fragment
    float fragmentWorldZ = screenPosition.z * (cameraFar - cameraNear) + cameraNear;

    // Determine if the fragment is at the intersection
    if (abs(fragmentWorldZ - currentFragmentDepth) < intersectionWidth) {
        gl_FragColor = vec4(highlightColor, 1.0); // Highlight intersection
    } else {
        discard; // Discard non-intersecting fragments if you don't want to render them
    }
}