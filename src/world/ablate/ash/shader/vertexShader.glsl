uniform sampler2D uMainTex;
uniform sampler2D uNoiseTex;
uniform sampler2D uWhiteNoiseTex;
uniform sampler2D uRampTex;
uniform vec4 uAshColor;
uniform vec4 uFlyDirection;
uniform float uThreshold;
uniform float uEdgeWidth;
uniform float uFlyIntensity;
uniform float uMinBorderY;
uniform float uMaxBorderY;
uniform float uDistanceEffect;
uniform float uAshWidth;
uniform float uAshDensity;

// Vertex Shader (GLSL)
varying vec2 vUv;
varying vec3 vWorldPos;
varying float vCutout;

float getNormalizedDist(float worldPosY) {
    float range = uMaxBorderY - uMinBorderY;
    float border = uMaxBorderY;
    float dist = abs(worldPosY - border);
    return clamp(dist / range, 0.0, 1.0);
}
void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;

    float cutout = getNormalizedDist(worldPosition.y);
    vec3 localFlyDirection = normalize((modelMatrix * vec4(uFlyDirection.xyz, 0.0)).xyz);
    float flyDegree = (uThreshold - cutout) / uEdgeWidth;
    float val = max(0.0, flyDegree * uFlyIntensity);
    vec3 pos = position + localFlyDirection * val;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}