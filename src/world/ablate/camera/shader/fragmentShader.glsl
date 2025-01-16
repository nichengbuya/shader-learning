uniform sampler2D uMainTex;
uniform sampler2D uNoiseTex;
uniform sampler2D uScreenSpaceMask;
uniform float uWorkDistance;
uniform vec3 uPlayerPos;
uniform vec3 uCameraPosition;
uniform vec2 uResolution;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec4 vScreenPosition;
float uDistanceEffect = 0.6;
void main() {
    float toCamera = distance(vWorldPosition, uCameraPosition);
    float playerToCamera = distance(uPlayerPos, uCameraPosition);
    
    vec2 wcoord = vScreenPosition.xy / vScreenPosition.w;
    wcoord = wcoord * 0.5 + 0.5; // 转换到 [0, 1]

    float mask = texture2D(uScreenSpaceMask, wcoord).r;
    vec4 col = texture2D(uMainTex, vUv);
    float gradient = texture2D(uNoiseTex, vUv).r * ( 1.0 - uDistanceEffect ) + (1. - mask) * uDistanceEffect; 
    // float gradient = texture2D(uNoiseTex, vUv).r;

    if (toCamera < playerToCamera) {
        if (gradient - mask + (toCamera - uWorkDistance) / uWorkDistance < 0.0) {
            discard; // Equivalent to clip() in Unity
        }
    }

    gl_FragColor = col;
}


