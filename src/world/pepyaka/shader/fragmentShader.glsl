varying vec3 vNormal;
uniform vec2 u_resolution;//包含屏幕的宽高值,xy
uniform vec2 u_mouse;//鼠标的坐标值
uniform float u_time;//运行以来的时间值

varying vec3 vColor;

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

    // float mixer = 1.0- abs(( vUv.x + vUv.y - 1.0));
    // vec3 color = vec3( mixer);

    vec3 light = vec3(0.);
    vec3 lightDirection = normalize(vec3(0. , -1.  , -1.));
    light += dot(lightDirection  , vNormal);

    vec3 skyColor = vec3(1.00 , 1.00 , 0.547);
    vec3 groundColor = vec3( 0.562 , 0.275 , 0.111);

    light = mix(skyColor , groundColor , light );
    // gl_FragColor= vec4(vColor, 1.0);
    gl_FragColor= vec4( light * vColor , 1.0);

}
