// Vertex Shader
varying vec2 vUv;
varying vec3 vLightDirTS;

uniform sampler2D uNormalMap;

void main() {
    vUv = uv;

    // Transform Tangent Space Normals
    vec3 tangent = normalize(vec3(modelMatrix * vec4(1.0, 0.0, 0.0, 0.0)));
    vec3 bitangent = normalize(vec3(modelMatrix * vec4(0.0, 1.0, 0.0, 0.0)));
    vec3 normal = normalize(vec3(modelMatrix * vec4(0.0, 0.0, 1.0, 0.0)));

    mat3 tbn = mat3(tangent, bitangent, normal);

    // Assume directional light is coming from [1, 1, 1] (example value)
    vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
    vLightDirTS = tbn * lightDirection;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}