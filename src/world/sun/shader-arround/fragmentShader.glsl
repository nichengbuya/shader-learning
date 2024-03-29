uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector;
varying vec3 vNormal;

vec3 brightnessToColor(float b){
    b *= 0.25;
    return (vec3( b , b*b , b* b * b)/ 0.25)*0.8;
}

float Fresnel(vec3 eyeVector, vec3 worldNormal){
    return pow(1.0 + dot(eyeVector , worldNormal) , 3.0);
}

void main() {

    float radial = 1. - vPosition.z;
    // radial *= radial;
    float brightness = 1. +  radial * 0.83;
    gl_FragColor.rgb = brightnessToColor(brightness);
    gl_FragColor.a = radial;



}