#include <packing>
varying vec4 vScreenPos;
uniform float uNear;
uniform float uFar;
float zNDCToZ01(float zNDC) {
  float zView = (2.0 * uFar * uNear) / (zNDC * (uFar - uNear) - (uFar + uNear));
  float z01 = (zView + uNear) / (uFar - uNear);
  return -z01;
}

void main () {
  float z = vScreenPos.z / vScreenPos.w;
  float z01 = zNDCToZ01(z);
  gl_FragColor = vec4(vec3(z01), 1.0);
}
