import { useEffect, useRef } from "react";
import * as THREE from 'three';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import vertexShader from "./shader/vertexShader.glsl";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import fragmentShader from "./shader/fragmentShader.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default function Base() {
  const divRef = useRef<HTMLDivElement | any>();

  useEffect(() => {
    // init
    let width = divRef.current.clientWidth;
    let height = divRef.current.clientHeight;
    const params = {
      progress: 0.0
    }
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animation);

    const divCurrent = divRef.current;
    divCurrent.appendChild(renderer.domElement);
    const control = new OrbitControls(camera, renderer.domElement);


    const gui = addSettings();
    window.addEventListener('resize', handleResize);
    const stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0'; // 距上边距0
    stats.dom.style.left = '0'; // 距左边距0  
    if (divRef.current) {
      divRef.current.appendChild(stats.dom);
    }

    const uniforms = {
      uMainTex: { value: new THREE.TextureLoader().load('/texture/bump/bricks2.jpg') },
      uNormalMap: { value: new THREE.TextureLoader().load('/texture/bump/bricks2_normal.jpg') },
    };


    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
    })

    initScene();
    // handle window resize
    function handleResize() {
      if (!divRef.current) return;
      const { width, height } = divRef.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    // animation
    function animation() {

      control.update();
      stats.update();
      renderer.render(scene, camera);
    }
    function addSettings() {

      const gui = new GUI();
      gui.add(params, 'progress', 0.0, 1.0).step(0.01).onChange(v => {
        if (material) {
          material.uniforms.threshold.value = params.progress;
        }
      })
      return gui;
    }

    function initScene() {


      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return mesh;
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

  return <div ref={divRef} style={{ position: 'relative', width: '100%', height: '100%' }} />;

}