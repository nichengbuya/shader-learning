uniform sampler2D uTexture;
uniform float topY;
varying vec2 vUv; // 确保vUv在顶点和片段着色器中都能匹配
varying vec3 vWorldPos; // 确保vWorldPos也能匹配

void main() {
    if (topY - vWorldPos.y <= 0.0) {
        discard;
    }
    gl_FragColor = texture2D(uTexture, vUv);
}