import { useEffect, useRef } from "react";
import * as THREE from 'three';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import Stats from "three/examples/jsm/libs/stats.module";
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Base(){
  const divRef = useRef<HTMLDivElement | any>();

  useEffect(() => {
    // init
    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, controls: OrbitControls, stats: Stats;
    let target: THREE.WebGLRenderTarget<THREE.Texture>;
    let postScene: THREE.Scene, postCamera: THREE.OrthographicCamera, postMaterial: THREE.ShaderMaterial | undefined;
    let gui: GUI;
    const divCurrent = divRef.current;
    const params:any = {
      format: THREE.DepthFormat,
      type: THREE.UnsignedShortType,
      samples: 0,
    };

    const formats = { DepthFormat: THREE.DepthFormat, DepthStencilFormat: THREE.DepthStencilFormat };
    const types = { UnsignedShortType: THREE.UnsignedShortType, UnsignedIntType: THREE.UnsignedIntType, FloatType: THREE.FloatType };
    let width = divRef.current.clientWidth;
    let height = divRef.current.clientHeight;
    init();

    function init() {

      renderer = new THREE.WebGLRenderer();

      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize(width, height );
      renderer.setAnimationLoop( animate );
      divCurrent.appendChild(renderer.domElement);

      stats = new Stats();
      stats.dom.style.position = 'absolute';
      stats.dom.style.top = '0'; // 距上边距0
      stats.dom.style.left = '0'; // 距左边距0  
      divCurrent.appendChild( stats.dom );

      camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 50 );
      camera.position.z = 4;

      controls = new OrbitControls( camera, renderer.domElement );
      controls.enableDamping = true;

      // Create a render target with depth texture
      setupRenderTarget();

      // Our scene
      setupScene();

      // Setup post-processing step
      setupPost();

      onWindowResize();
      window.addEventListener( 'resize', onWindowResize );

      //
      gui = new GUI( { width: 300 } );

      gui.add( params, 'format', formats ).onChange( setupRenderTarget );
      gui.add( params, 'type', types ).onChange( setupRenderTarget );
      gui.add( params, 'samples', 0, 16, 1 ).onChange( setupRenderTarget );
      gui.open();

    }

    function setupRenderTarget() {

      if ( target ) target.dispose();

      const {format, type, samples} = params;
      const dpr = renderer.getPixelRatio();
      target = new THREE.WebGLRenderTarget( width * dpr, height * dpr );
      target.texture.minFilter = THREE.NearestFilter;
      target.texture.magFilter = THREE.NearestFilter;
      target.texture.generateMipmaps = false;
      target.stencilBuffer = ( format === THREE.DepthStencilFormat ) ? true : false;
      target.samples = samples;

      target.depthTexture = new THREE.DepthTexture(width , height);
      target.depthTexture.format = format;
      target.depthTexture.type = type;

    }

    function setupPost() {

      // Setup post processing stage
      postCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
      postMaterial = new THREE.ShaderMaterial( {
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          cameraNear: { value: camera.near },
          cameraFar: { value: camera.far },
          tDiffuse: { value: null },
          tDepth: { value: null }
        }
      } );
      const postPlane = new THREE.PlaneGeometry( 2, 2 );
      const postQuad = new THREE.Mesh( postPlane, postMaterial );
      postScene = new THREE.Scene();
      postScene.add( postQuad );

    }

    function setupScene() {

      scene = new THREE.Scene();

      const geometry = new THREE.TorusKnotGeometry( 1, 0.3, 128, 64 );
      const material = new THREE.MeshBasicMaterial( { color: 'blue' } );

      const count = 50;
      const scale = 5;

      for ( let i = 0; i < count; i ++ ) {

        const r = Math.random() * 2.0 * Math.PI;
        const z = ( Math.random() * 2.0 ) - 1.0;
        const zScale = Math.sqrt( 1.0 - z * z ) * scale;

        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(
          Math.cos( r ) * zScale,
          Math.sin( r ) * zScale,
          z * scale
        );
        mesh.rotation.set( Math.random(), Math.random(), Math.random() );
        scene.add( mesh );

      }

    }

    function onWindowResize() {

      const aspect = width / height;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      const dpr = renderer.getPixelRatio();
      target.setSize( width * dpr, height * dpr );
      renderer.setSize( width, height );

    }

    function animate() {

      // render scene into target
      renderer.setRenderTarget( target );
      renderer.render( scene, camera );

      // render post FX
      if(postMaterial){
        postMaterial.uniforms.tDiffuse.value = target.texture;
        postMaterial.uniforms.tDepth.value = target.depthTexture;
      }

      renderer.setRenderTarget( null );
      renderer.render( postScene, postCamera );

      controls.update(); // required because damping is enabled

      stats.update();

    }


    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', onWindowResize);
      
      divCurrent.removeChild(renderer.domElement);
      gui.destroy();
      scene.traverse((child)=>{
        if(child instanceof THREE.Mesh){
          child.geometry.dispose();
          child.material.dispose();
        }
      })
    };
  }, []);

  return <div ref={divRef} style={{ height: '100%', position:'relative' }} />;
  
}