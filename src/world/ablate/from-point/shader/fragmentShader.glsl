uniform sampler2D uMainTex;
uniform sampler2D uNoiseTex;
uniform sampler2D uRampTex;
uniform float uMaxDistance;
uniform float uDistanceEffect;
uniform float uThreshold;
uniform float uEdgeLength;
varying vec2 vUv;
varying vec3 vObjPos;
varying vec3 vObjStartPos;
void main( void ) {
    float dist = length(vObjPos - vObjStartPos);
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