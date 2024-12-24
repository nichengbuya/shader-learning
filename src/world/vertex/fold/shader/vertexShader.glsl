uniform float foldPos;
uniform float foldAngle;
uniform bool enableDouble;

varying vec2 vUv;

void main() {
    vUv = uv;

    float angle = foldAngle;
    float r = foldPos - position.x;

    if (enableDouble) {
        if (r <= 0.0) {
            angle = 360.0 - foldAngle;
        }
    } else {
        if (r <= 0.0) {
            angle = 180.0;
        }
    }

    vec3 pos = position;
    pos.x = foldPos + r * cos(radians(angle));
    pos.y = r * sin(radians(angle));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}