uniform sampler2D uMainTex;
uniform sampler2D uNoise;
uniform float threshold;
varying vec2 vUv;
vec3 edgeColor = vec3(1.0,1.0,0.0);
float edgeWidth = 0.1;
void main( void ) {
    vec4 color = texture2D(uMainTex, vUv);
    vec4 noiseValue = texture2D(uNoise, vUv);
    if( noiseValue.r < threshold){
        discard;
    }
    if (noiseValue.r - edgeWidth < threshold){
        color = vec4(edgeColor , 1.0);
    }
    gl_FragColor = color;

}