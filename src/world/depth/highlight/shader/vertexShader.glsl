    // varying vec2 vUv;
    // varying vec4 vScreenPosition;
    // varying float vEyeZ;
    // varying vec2 vZW;
    // void main() {
    //   vUv = uv;
    //   vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    //   vEyeZ = -mvPosition.z;
    //   vScreenPosition = projectionMatrix * mvPosition;
    //   gl_Position = vScreenPosition;
    // }


varying vec2 vZW;
varying vec2 vUv;
varying vec4 vScreenPos;
varying float vEyeZ;
void main () {
    vec4 mvPosition = vec4(position, 1.0);
    mvPosition = modelViewMatrix * mvPosition;
    vScreenPos = projectionMatrix * mvPosition;
    gl_Position = vScreenPos;
    vEyeZ = -mvPosition.z;
    vZW = vScreenPos.zw;
    vUv = uv;
}