#include <packing>
uniform sampler2D mainTex;
uniform sampler2D tDepth;
uniform vec2 resolution;
uniform float uNear;
uniform float uFar;

varying vec2 vUv;
varying vec4 vScreenPos;

float zNDCToZ01(float zNDC) {
  float zView = (2.0 * uFar * uNear) / (zNDC * (uFar - uNear) - (uFar + uNear));
  float z01 = (zView + uNear) / (uFar - uNear);
  return -z01;
}
void main() {
    vec4 color = texture2D(mainTex, vUv);

    float z = vScreenPos.z / vScreenPos.w;
    float depth = zNDCToZ01(z);

    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 packedDepth = texture2D(tDepth, uv); // Ensure 2D texture lookup
    float sceneDepth = unpackRGBAToDepth(packedDepth);
    // float diff = abs(depth - sceneDepth);
    float intersectionWidth = 0.01;
    vec3 intersectionColor = vec3(1.0, 1.0, 0.0);
    float halfWidth = intersectionWidth / 2.0;
    float diff = clamp(abs(sceneDepth - depth) / halfWidth, 0.0, 1.0);


    vec3 finalColor = mix(intersectionColor, color.rgb, diff);
    gl_FragColor = vec4(finalColor, 1.0);

}