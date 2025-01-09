#include <packing>
uniform sampler2D mainTex;
uniform sampler2D tDepth;
uniform vec3 intersectionColor;
uniform float intersectionWidth;
uniform float uNear;
uniform float uFar;
varying vec2 vUv;
varying float vEyeZ;

float readDepth( sampler2D depthSampler, vec2 coord ) {
	float fragCoordZ = texture2D( depthSampler, coord ).x;
	float viewZ = perspectiveDepthToViewZ( fragCoordZ, uNear, uFar );
	return viewZToOrthographicDepth( viewZ, uNear, uFar );
}
void main() {
    vec4 col = texture2D(mainTex, vUv);

  // 转换到相机空间中 near ~ far
    float sceneDepth = readDepth( tDepth, vUv );

    // 调整相交宽度
    float halfWidth = intersectionWidth / 2.0;
    float diff = clamp(abs(vEyeZ - sceneDepth) / halfWidth, 0.0, 1.0);


    vec3 finalColor = mix(intersectionColor, col.rgb, diff);
    gl_FragColor = vec4(vec3(sceneDepth), 1.0);
}