uniform sampler2D uFrontTex;
uniform sampler2D uBackTex;
varying vec2 vUv; // 确保vUv在顶点和片段着色器中都能匹配

void main() {
    vec4 color;

    if (gl_FrontFacing) {
        // 如果是正面，则使用 frontTex 纹理
        color = texture2D(uFrontTex, vUv);
    } else {
        // 如果是反面，则使用 backTex 纹理
        color = texture2D(uBackTex, vUv);
    }

    gl_FragColor = color;
}