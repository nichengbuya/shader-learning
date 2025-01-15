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
// Fragment Shader (GLSL)
float getNormalizedDist(float worldPosY) {
    float range = uMaxBorderY - uMinBorderY;
    float border = uMaxBorderY;
    float dist = abs(worldPosY - border);
    return clamp(dist / range, 0.0, 1.0);
}

void main() {
    vec4 albedo = texture2D(uMainTex, vUv);
    float commonNoise = texture2D(uNoiseTex, vUv).r;
    float whiteNoise = texture2D(uWhiteNoiseTex, vUv).r;

    float normalizedDist = getNormalizedDist(vWorldPos.y);
    float cutout = commonNoise * (1.0 - uDistanceEffect) + normalizedDist * uDistanceEffect;

    float edgeCutout = cutout - uThreshold;
    if (edgeCutout + uAshWidth < 0.0) discard;

    float degree = clamp(edgeCutout / uEdgeWidth, 0.0, 1.0);
    vec4 edgeColor = texture2D(uRampTex, vec2(degree, degree));
    vec4 finalColor = mix(edgeColor, albedo, degree);
    if (degree < 0.001) {
        if (whiteNoise * uAshDensity + normalizedDist * uDistanceEffect - uThreshold < 0.0) discard;
        finalColor = uAshColor;
    }
    
    gl_FragColor = finalColor;
}