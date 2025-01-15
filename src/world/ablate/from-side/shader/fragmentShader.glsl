uniform sampler2D uMainTex;
uniform sampler2D uNoiseTex;
uniform sampler2D uRampTex;
uniform float uMaxDistance;
uniform float uDistanceEffect;
uniform float uThreshold;
uniform float uEdgeLength;
float minBorderX = -1.0;
float maxBorderX = 1.0; 
varying vec2 vUv;
varying float vObjPosX;
void main( void ) {
    float range = maxBorderX - minBorderX;
    float border = minBorderX;
    float dist = length(vObjPosX - border);
    float normalizedDist = clamp( dist / uMaxDistance, 0.0, 1.0 );
    float cutout = texture2D(uNoiseTex, vUv).r * ( 1.0 - uDistanceEffect ) + normalizedDist * uDistanceEffect; 
    if(cutout < uThreshold){
        discard;
    }

    float degree = clamp((cutout - uThreshold) / uEdgeLength, 0.0, 1.0);
    vec4 edgeColor = texture2D(uRampTex, vec2(degree, degree));
    vec4 color = texture2D(uMainTex, vUv);
    vec4 finalColor = mix(edgeColor, color, degree);

    gl_FragColor = finalColor;

}