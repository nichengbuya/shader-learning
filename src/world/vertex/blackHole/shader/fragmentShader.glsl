uniform sampler2D uTexture;
uniform vec3 blackHolePos;

varying vec2 vUv;
varying vec3 vWorldPos;

void main() {
    if (blackHolePos.x < vWorldPos.x) discard;

    vec4 col = texture2D(uTexture, vUv);
    gl_FragColor = col;
}