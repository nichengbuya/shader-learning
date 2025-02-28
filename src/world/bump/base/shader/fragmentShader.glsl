precision highp float;

varying vec2 vUv;
varying vec3 vLightDir;

uniform sampler2D mainTex; // 主纹理
uniform sampler2D depthMap; // 深度贴图（高度图）
uniform float threshold; // 缩放因子，用来调整法线的强度
uniform vec3 ambientLight; // 环境光颜色
uniform vec3 lightColor;   // 主光源的颜色

// 在深度贴图中计算法线方向
vec3 calculateNormal(vec2 uv) {
    vec2 du = vec2(0.01, 0.0); // 沿 u 方向偏移量
    vec2 dv = vec2(0.0, 0.01); // 沿 v 方向偏移量

    // 采样邻近的高度
    float u1 = texture2D(depthMap, uv - du).r;
    float u2 = texture2D(depthMap, uv + du).r;

    float v1 = texture2D(depthMap, uv - dv).r;
    float v2 = texture2D(depthMap, uv + dv).r;

    // 计算偏导数并生成法线
    vec3 tangentU = vec3(1.0, 0.0, (u2 - u1) * threshold);
    vec3 tangentV = vec3(0.0, 1.0, (v2 - v1) * threshold);

    return normalize(cross(tangentU, tangentV)); // TBN 空间的法线
}

void main() {
    // 采样法线 & 光照计算
    vec3 normalTS = calculateNormal(vUv);
    vec3 lightDir = normalize(vLightDir);

    // 漫反射分量
    vec4 albedo = texture2D(mainTex, vUv); // 主纹理采样
    vec3 diffuse = max(dot(normalTS, lightDir), 0.0) * albedo.rgb * lightColor;

    // 环境光分量
    vec3 ambient = ambientLight * albedo.rgb;

    // 最终值
    vec3 finalColor = diffuse + ambient;
    gl_FragColor = vec4(finalColor, 1.0);
}