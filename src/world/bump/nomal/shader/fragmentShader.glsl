// Fragment Shader
varying vec2 vUv;
varying vec3 vLightDirTS;

uniform sampler2D uMainTex; // Albedo texture
uniform sampler2D uNormalMap; // Normal map

void main() {
    // Sample albedo (main texture)
    vec4 albedo = texture2D(uMainTex, vUv);

    // Sample normal map
    vec3 packedNormal = texture2D(uNormalMap, vUv).rgb;

    // Unpack normal from [0, 1] range to [-1, 1] range
    vec3 normalTS = normalize(packedNormal * 2.0 - 1.0);

    // Normalize light direction in tangent space
    vec3 lightDirTS = normalize(vLightDirTS);

    // Simple Lambertian diffuse model
    float diffuse = max(dot(normalTS, lightDirTS), 0.0);

    // Apply ambient lighting (just using an approximation for ambient)
    vec3 ambient = vec3(0.1) * albedo.rgb;

    // Combine lighting
    vec3 finalColor = ambient + diffuse * albedo.rgb;

    gl_FragColor = vec4(finalColor, 1.0);
}