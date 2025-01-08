#include <packing>
uniform sampler2D _MainTex;
uniform sampler2D _CameraDepthTexture;
uniform vec3 _IntersectionColor;
uniform float _IntersectionWidth;
uniform float uNear;
uniform float uFar;
varying vec2 vUv;
varying vec4 vScreenPosition;
varying float vEyeZ;

float linearizeDepth(float depth, float zNear, float zFar) {
    return (2.0 * zNear) / (zFar + zNear - depth * (zFar - zNear));
}

void main() {
    vec4 col = texture2D(_MainTex, vUv);

    float zBufferValue = texture2DProj(_CameraDepthTexture, vScreenPosition).r;
    float screenZ = linearizeDepth(zBufferValue, uNear, uFar); // Adjust zNear and zFar to your camera's setup

    float halfWidth = _IntersectionWidth / 2.0;
    float diff = clamp(abs(vEyeZ - screenZ) / halfWidth, 0.0, 1.0);

    vec3 finalColor = mix(_IntersectionColor, col.rgb, diff);
    gl_FragColor = vec4(finalColor, 1.0);
}