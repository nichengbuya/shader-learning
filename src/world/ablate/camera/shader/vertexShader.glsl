varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec4 vScreenPosition;

void main() {
    // Pass through texture coordinates
    vUv = uv;

    // Calculate world position
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    // Calculate screen position for screen space effects
    vScreenPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // Calculate final vertex position on the screen
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}