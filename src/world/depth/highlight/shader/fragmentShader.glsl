#include <packing>
uniform sampler2D _MainTex;
uniform sampler2D tDepth;
uniform vec3 _IntersectionColor;
uniform float _IntersectionWidth;
uniform float uNear;
uniform float uFar;
varying vec2 vUv;
// varying vec4 vScreenPosition;
varying vec4 vScreenPos;
varying float vEyeZ;
varying vec2 vZW;
float linearizeDepth(float depth, float zNear, float zFar) {
    return (2.0 * zNear) / (zFar + zNear - depth * (zFar - zNear));
}

// void main() {
//     vec4 col = texture2D(_MainTex, vUv);

//     float zBufferValue = texture2DProj(_CameraDepthTexture, vScreenPosition).r;
//     float screenZ = linearizeDepth(zBufferValue, uNear, uFar); // Adjust zNear and zFar to your camera's setup

//     float halfWidth = _IntersectionWidth / 2.0;
//     float diff = clamp(abs(vEyeZ - screenZ) / halfWidth, 0.0, 1.0);

//     vec3 finalColor = mix(_IntersectionColor, col.rgb, diff);
//     gl_FragColor = vec4(finalColor, 1.0);

// }
// varying vec4 vScreenPos;
// float zNDCToZ01(float zNDC) {
//   float zView = (2.0 * uFar * uNear) / (zNDC * (uFar - uNear) - (uFar + uNear));
//   float z01 = (zView + uNear) / (uFar - uNear);
//   return -z01;
// }
float zNDCToZView(float zNDC) {
  float zView = (2.0 * uFar * uNear) / (zNDC * (uFar - uNear) - (uFar + uNear));
  return -zView;
}

float readDepth( sampler2D depthSampler, vec2 coord ) {
	float fragCoordZ = texture2D( depthSampler, coord ).x;
	float viewZ = perspectiveDepthToViewZ( fragCoordZ, uNear, uFar );
	return viewZToOrthographicDepth( viewZ, uNear, uFar );
}
void main() {
    vec4 col = texture2D(_MainTex, vUv);

  // 转换到相机空间中 near ~ far
    float sceneDepth = readDepth( tDepth, vUv );

    // 调整相交宽度
    float halfWidth = _IntersectionWidth / 2.0;
    float diff = clamp(abs(vEyeZ - sceneDepth) / halfWidth, 0.0, 1.0);


    vec3 finalColor = mix(_IntersectionColor, col.rgb, diff);
    gl_FragColor = vec4(vec3(sceneDepth), 1.0);
}