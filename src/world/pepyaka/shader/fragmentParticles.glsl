varying vec3 vNormal;
uniform vec2 u_resolution;//包含屏幕的宽高值,xy
uniform vec2 u_mouse;//鼠标的坐标值
uniform float u_time;//运行以来的时间值
uniform sampler2D texture1;
varying vec3 vColor;

void main( void ) {
    gl_FragColor= vec4( 0.826 , 0.999 , 0.999, 0.5);

}
