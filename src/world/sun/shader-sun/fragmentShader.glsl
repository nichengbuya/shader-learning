uniform float time;
uniform samplerCube uPerlin;
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

float supersun(){
    float sum = 0.;
    sum += textureCube(uPerlin , vLayer0).r;
    sum += textureCube(uPerlin , vLayer1).r;
    sum += textureCube(uPerlin , vLayer2).r;
    sum *= 0.33;
    return sum;
}
void main() {
    float brigthness = supersun();
    brigthness = brigthness * 4.0 + 1.;
    float fres = Fresnel(eyeVector , vNormal);
    brigthness += pow(fres , 0.4);
    vec3 col = brightnessToColor(brigthness);
    gl_FragColor = vec4(col , 1.);
    // gl_FragColor = vec4(vec3(fres) , 1.);
    // gl_FragColor = vec4( vLayer1 , 1.);
}