uniform vec3 uStartPoint;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
}
