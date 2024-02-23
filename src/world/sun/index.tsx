import { useEffect, useRef } from "react";
import * as THREE from 'three';
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";
import vertexShaderSun from "./shader-sun/vertexShader.glsl";
import fragmentShaderSun from "./shader-sun/fragmentShader.glsl";
import vertexShaderArround from "./shader-arround/vertexShader.glsl";
import fragmentShaderArround from "./shader-arround/fragmentShader.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";

const params = {
  threshold: 0,
  strength: 0.2,
  radius: 0,
  exposure: 1
};
export default function Sun() {
  const divRef = useRef<HTMLDivElement | any>(null);
  useEffect(() => {
    // init
    let width = divRef.current.clientWidth;
    let height = divRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 3;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animation);

    const divCurrent = divRef.current;
    divCurrent.appendChild(renderer.domElement);
    const control = new OrbitControls(camera, renderer.domElement);
    const gui = addSettings();
    const obj = addObject();
    // addArround();


    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.5,
      0.3,
      0.75
    );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    const outputPass = new OutputPass();

    const composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    composer.addPass( outputPass );


    const { cubeRenderTarget1, cubeCamera1, materailPerlin, scene1 } = addTexture();
    window.addEventListener('resize', handleResize);

    // handle window resize
    function handleResize() {
      width = divRef.current.clientWidth;
      height = divRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }
    function addSettings(){
      const gui = new GUI();
				const bloomFolder = gui.addFolder( 'bloom' );

				bloomFolder.add( params, 'threshold', 0.0, 1.0 ).onChange( function ( value ) {

					bloomPass.threshold = Number( value );

				} );

				bloomFolder.add( params, 'strength', 0.0, 3.0 ).onChange( function ( value ) {

					bloomPass.strength = Number( value );

				} );

				gui.add( params, 'radius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

					bloomPass.radius = Number( value );

				} );

				const toneMappingFolder = gui.addFolder( 'tone mapping' );

				toneMappingFolder.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

					renderer.toneMappingExposure = Math.pow( value, 4.0 );

				} );

      return gui;
    }
    function addTexture() {
      const scene1 = new THREE.Scene();
      const cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipMapLinearFilter,
        encoding: THREE.sRGBEncoding
      });
      const cubeCamera1 = new THREE.CubeCamera(0.1, 10, cubeRenderTarget1);

      const materailPerlin = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // wireframe:true,
        uniforms: {
          time: {
            value: 0
          },

        },
        extensions: { derivatives: true }
      })

      const geometry = new THREE.SphereGeometry(1, 30, 30);
      const mesh = new THREE.Mesh(geometry, materailPerlin);
      scene1.add(mesh);
      return { cubeRenderTarget1, cubeCamera1, materailPerlin, scene1 };
    }
    function addObject() {
      const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: vertexShaderSun,
        fragmentShader: fragmentShaderSun,
        // wireframe:true,
        uniforms: {
          time: {
            value: 0
          },
          uPerlin: {
            value: null
          }
        },
        extensions: { derivatives: true }
      })

      // 创建球体
      const geometry = new THREE.SphereGeometry(1, 30, 30);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return mesh;
    }

    function addArround() {
      const material = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader: vertexShaderArround,
        fragmentShader: fragmentShaderArround,
        // wireframe:true,
        uniforms: {
          time: {
            value: 0
          }
        },
        extensions: { derivatives: true }
      })

      // 创建球体
      const geometry = new THREE.SphereGeometry(1.2, 30, 30);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return mesh;
    }

    let time = 0;
    // animation
    function animation() {
      time += 0.05;
      cubeCamera1.update(renderer, scene1);
      obj.material.uniforms.uPerlin.value = cubeRenderTarget1.texture;
      obj.material.uniforms.time.value = time;
      materailPerlin.uniforms.time.value = time;
      control.update();
  
      // renderer.render(scene, camera);
      composer.render();
    }

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', handleResize);
      divCurrent.removeChild(renderer.domElement);
      gui.destroy();
      scene.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      })
    };
  }, []);

  return <div ref={divRef} style={{ height: '100%' }} />;

}