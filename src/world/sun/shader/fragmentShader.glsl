uniform float time;
uniform float radius;
uniform vec3 color;

varying vec2 vUv;

void main() {
    // 计算纹理坐标与中心点的距离
    float distanceToCenter = distance(vUv, vec2(0.5, 0.5));

    // 使用 smoothstep 函数创建一个圆形遮罩
    float mask = smoothstep(radius, radius + 0.01, radius - distanceToCenter);

    // 使用时间来制造动画效果
    float pulse = 0.5 + 0.5 * sin(time * 2.0);

    // 将遮罩应用到颜色
    vec3 shieldColor = mix(vec3(1.0), color, mask * pulse);

    gl_FragColor = vec4(shieldColor, 1.0);
}