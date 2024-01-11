const js =/*glsl*/ `
varying vec2 vUv;
uniform float uTime;
void main( void ) {

    //彩色棋盘
    // vec3 color1 = vec3(1.0 , 1.0 , 0.0);
    // vec3 color2 = vec3(1.0, 0.0, 1.0);
    // float x = step(0.5, fract(vUv.x * 3.0));
    // vec3 mask = vec3( x);

    // float y = step(0.5, fract(vUv.y * 3.0));
    // vec3 mask1 = vec3( y);
    // vec3 mixer = abs( mask - mask1 );
    // vec3 color = mix( color1 , color2 , mixer);
    // gl_FragColor = vec4(color , 1.0);

    //圆
    // float strength =  step(0.01,  abs(distance(vUv , vec2( 0.5)) -0.3 ));
    // vec3 color = vec3(strength);
    // gl_FragColor = vec4(color , 1.0);

    float mixer = 1.0- abs(( vUv.x + vUv.y - 1.0));
    vec3 color = vec3( mixer);
    gl_FragColor= vec4(color, 1.0);

}
`
export default js;