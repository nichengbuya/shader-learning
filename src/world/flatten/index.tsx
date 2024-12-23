import { useEffect, useRef } from "react";
import * as THREE from 'three';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default function Base(){
  const divRef = useRef<HTMLDivElement | any>();

  useEffect(() => {
    // init
    const settings = {
      progress: 0 
    }
    let width = divRef.current.clientWidth;
    let height = divRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.z = 3;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animation);
    THREE.ColorManagement.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const divCurrent = divRef.current;
    divCurrent.appendChild(renderer.domElement);
    const control = new OrbitControls(camera , renderer.domElement);
    const gui = addSettings();
    const obj = addObject();
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

    let time = 0 ;
    // animation
    function animation() {
      time += 0.05;
      if(obj){
        obj.material.uniforms.uTime.value = time;
      }
     
      control.update();
      renderer.render(scene, camera);
    }

    function addSettings(){

      const gui = new GUI();
      gui.add(settings , 'progress' , 0.0, 1.0 ).step(0.01).onChange((v)=>{});
      // gui.add(params, "threshold", 0.0, 1.0).step(0.01);
      return gui;
    }

    function addObject(){
      const textureLoader = new THREE.TextureLoader();
      const material = new THREE.ShaderMaterial( {
        vertexShader:vertexShader,
        fragmentShader:fragmentShader,
        uniforms:{
          uTopY:{
            value: settings.progress,
          },
          uTime:{
            value:0
          },
          uTexture:{
            value: textureLoader.load('/logo512.png')
          }
        }
      })
      const geometry = new THREE.SphereGeometry(0.5,32, 32 );
      const mesh = new THREE.Mesh(geometry , material);
      scene.add(mesh);
      return mesh;
    }

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', handleResize);
      divCurrent.removeChild(renderer.domElement);
      gui.destroy();
      scene.traverse(child=>{
        if(child instanceof THREE.Mesh){
          child.geometry.dispose();
          child.material.dispose();
        }
      })
    };
  }, []);

  return <div ref={divRef} style={{ height: '100%' }} />;
  
}