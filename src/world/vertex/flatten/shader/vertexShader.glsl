varying vec2 vUv;
uniform float topY;
uniform float bottomY;
uniform float control;

float normalizeY(float worldPosY){
    float range = topY - bottomY;
    float dist = abs(worldPosY - topY);
    return clamp( dist/range, 0.0, 1.0);
}
void main(){
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    float wordPosY = worldPosition.y;
    float normalizePosY = normalizeY(wordPosY);
    float value = max(0.0, control - normalizePosY);
    vec3 newPosition = position + vec3(0, -1 , 0) * value;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
