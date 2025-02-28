varying vec2 vUv; // 传递 UV 坐标到片段着色器
varying vec3 vLightDir; // 将光照方向传递到片段着色器
varying vec3 vViewPos; // 传递视图位置到片段着色器

// uniform mat3 normalMatrix; // 法线矩阵
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;

// attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;

uniform vec3 lightDirection; // 主光源方向

void main() {
    vUv = uv;

    // 计算法线世界坐标
    vec3 transformedNormal = normalize(normalMatrix * normal);

    // 计算光源在当前点的方向
    vLightDir = normalize(lightDirection);

    // 顶点最终的屏幕空间坐标
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}