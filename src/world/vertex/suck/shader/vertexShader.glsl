varying vec2 vUv; // 用于传递纹理坐标
varying vec3 vWorldPos; // 用于传递世界坐标

uniform float topY;
uniform float bottomY;
uniform float control;

void main() {
    vUv = uv;
    vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

    float range = topY - bottomY;
    float normalizedDist = (range == 0.0) ? 0.0 : clamp(abs(worldPosition.y - topY) / range, 0.0, 1.0);

    float val = max(0.0, control - normalizedDist);
    vec3 modifiedPosition = position + vec3(0.0, 1.0, 0.0) * val; // 在Y方向上应用控制因子

    vWorldPos = (modelMatrix * vec4(modifiedPosition, 1.0)).xyz; // 计算修改后的世界坐标

    gl_Position = projectionMatrix * modelViewMatrix * vec4(modifiedPosition, 1.0);
}
