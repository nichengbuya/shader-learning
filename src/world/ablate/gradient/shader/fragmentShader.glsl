uniform sampler2D uMainTex;
uniform sampler2D uNoise;
uniform sampler2D uGradientTex;
uniform float threshold;
varying vec2 vUv;

float edgeWidth = 0.1;
void main( void ) {
    vec4 color = texture2D(uMainTex, vUv);
    vec4 noiseValue = texture2D(uNoise, vUv);
    float degree = clamp((noiseValue.r - threshold) / edgeWidth, 0.0,1.0);
    vec4 edgeColor = texture2D(uGradientTex, vec2(degree, degree));
    if( noiseValue.r < threshold){
        discard;
    }
    if (noiseValue.r - edgeWidth < threshold){  
        color = mix(edgeColor, color , degree);
    }
    gl_FragColor = color;

}