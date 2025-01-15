uniform vec3 uStartPoint;
varying vec2 vUv;
varying vec3 vObjPos;
varying vec3 vObjStartPos;
void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vObjPos = worldPosition.xyz;
    vObjStartPos = (modelMatrix * vec4(uStartPoint, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
}
