varying vec2 vUv;
varying vec3 vWorldPos;

uniform float rightX;
uniform float leftX;
uniform float control;
uniform vec3 blackHolePos;
// 归一化距离，基于对象的世界位置 x 轴
float getNormalizedDist(float worldPosX) {
    float range = rightX - leftX;
    float border = rightX;
    // 计算对象当前位置与右边界的距离，并且归一化
    float dist = abs(worldPosX - border);
    float normalizedDist = clamp(dist / range, 0.0, 1.0);
    return normalizedDist;
}

void main() {
    vUv = uv;
    
    vec4 worldVertexPosition = modelMatrix * vec4(position, 1.0);
    vec3 worldPos = worldVertexPosition.xyz;
    // 对象到黑洞的向量
    vec3 toBlackHole = blackHolePos - worldPos;
    // 结合控制参数计算作用量
    float normalizedDist = getNormalizedDist(worldPos.x);
    float val = max(0.0, control - normalizedDist);
    // 更新对象位置，施加黑洞效果
    worldVertexPosition.xyz += toBlackHole * val;
    vWorldPos = worldVertexPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldVertexPosition;
}