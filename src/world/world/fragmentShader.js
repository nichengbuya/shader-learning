const js = `/*glsl*/


varying vec2 vUv;

void main( void ) {

    vec2 position = 2.0 * vUv -1.0;

    gl_FragColor = vec4( 1.0,0.0,0.0, 1.0 );

}
`
export default js;