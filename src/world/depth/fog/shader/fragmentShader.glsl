#include <packing>

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;
uniform float tFogDensity;


float readDepth( sampler2D depthSampler, vec2 coord ) {
	float fragCoordZ = texture2D( depthSampler, coord ).x;
	float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
	return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
	vec3 color = texture2D( tDiffuse, vUv ).rgb;
	float depth = readDepth( tDepth, vUv );
	float fogFactor = clamp(depth * tFogDensity, 0.0,1.0 );
	vec3 fogColor = vec3( 0.5, 0.5, 0.5 );
	vec3 finalColor = mix( color, fogColor, fogFactor );

	gl_FragColor = vec4( finalColor, 1.0 );

}