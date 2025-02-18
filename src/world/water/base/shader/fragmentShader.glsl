uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

const vec2 viewPos = vec2(-3.0, 7.0);
const vec2 lightDir = normalize(vec2(0.25, 1.0));
const float shininess = 128.0;

const float PI = 6.28;
const float frequency = 10.0;
const float amplitude = 0.25;

float getX(vec2 pos, vec2 origin) {
  float distanceToCenter = distance(pos, origin);
  float x = distanceToCenter * PI * frequency - iTime * 3.0;
  return x;
}

float getAmplitude(vec2 pos, vec2 origin) {
  float distanceToOrigin = distance(pos, origin);
  return mix(amplitude, 0.0, clamp(distanceToOrigin * 2.0, 0.0, 1.0));
}

vec2 getDistortion(vec2 pos, vec2 origin) {
  float distortion = sin(getX(pos, origin)) * getAmplitude(pos, origin);
  return vec2(distortion);
}

vec2 getNormal(vec2 pos, vec2 origin) {
  float x = getX(pos, origin);
  float A = getAmplitude(pos, origin);
  vec2 normal = normalize(vec2(-1.0 * A * cos(x), 1.0));
  return normal;
}

float getLight(vec2 normal, vec2 viewDir) {
  vec2 reflectDir = reflect(-lightDir, normal);  
  float specular = (max(dot(viewDir, reflectDir), 0.0));
  specular = pow(specular, shininess);

  return 1.0 + specular;
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  
  vec2 w1 = vec2(0.3);
  vec2 w2 = vec2(0.7);

  vec2 distortion = getDistortion(uv, w1) + getDistortion(uv, w2);

  vec2 reflectCoord = uv + distortion;
  vec2 refractCoord = uv + distortion * 0.2;

  vec2 viewDir = normalize(viewPos - reflectCoord);

  vec2 normal = normalize(getNormal(uv, w1) + getNormal(uv, w2));
  float reflectance = pow(dot(viewDir, normal), 5.0);

  vec3 reflection = texture2D(iChannel0, reflectCoord).rgb;
  vec3 refraction = texture2D(iChannel1, refractCoord).rgb;

  vec3 color = mix(refraction, reflection, reflectance);
  color *= getLight(normal, viewDir);

  gl_FragColor = vec4(color, 1.0);
}