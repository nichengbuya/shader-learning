uniform vec3 uStartPoint;
varying vec2 vUv;
varying float vObjPosX;
void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vObjPosX = position.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
}
