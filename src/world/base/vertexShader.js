const js = /*glsl*/`
varying vec2 vUv;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vColor;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
}
`
export default js;