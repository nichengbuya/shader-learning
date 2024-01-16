// const js =/*glsl*/ `
varying vec3 vNormal;
uniform vec2 u_resolution;//包含屏幕的宽高值,xy
uniform vec2 u_mouse;//鼠标的坐标值
uniform float u_time;//运行以来的时间值

varying vec3 vColor;

void main( void ) {
    vec3 color = vec3(1.0 , 0.0 , 0.0);
    gl_FragColor= vec4( color, 1.0);

}
// `
// export default js;