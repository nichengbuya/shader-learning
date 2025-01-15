import { useEffect, useRef } from "react";
import * as THREE from 'three';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import vertexShader from "./shader/vertexShader.glsl";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import fragmentShader from "./shader/fragmentShader.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default function Base(){
  const divRef = useRef<HTMLDivElement | any>();

  useEffect(() => {
    // init
    let width = divRef.current.clientWidth;
    let height = divRef.current.clientHeight;
    const params = {
      progress: 0.6
    }
    const meshes = [];
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);
    camera.position.z = 5;
    camera.position.y = 5;
    camera.position.x = 5;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setAnimationLoop(animation);
    const divCurrent = divRef.current;
    divCurrent.appendChild(renderer.domElement);
    const control = new OrbitControls(camera , renderer.domElement);

    
    const gui = addSettings();
    window.addEventListener('resize', handleResize);
    const stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0'; // 距上边距0
    stats.dom.style.left = '0'; // 距左边距0  
    if (divRef.current) {
      divRef.current.appendChild(stats.dom);
    }

    const loader = new THREE.TextureLoader(); 
    const material = new THREE.ShaderMaterial( {
      vertexShader:vertexShader,
      fragmentShader:fragmentShader,
      uniforms:{
        uMainTex: { value: loader.load('/texture/Pergament5.png') },
        uNoiseTex: { value:loader.load('/texture/Noise.png')  },
        uRampTex: { value: loader.load('/texture/gradient.png') },
        uThreshold: { value: params.progress},
        uEdgeLength: { value: 0.1 },
        uMaxDistance: { value: 2.0 },
        uDistanceEffect: { value: 0.65 },
        uStartPoint: { value: new THREE.Vector3(0, 0, 0) }
      }
    })

    initScene();
    initialize();
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
    function addSettings(){

      const gui = new GUI();
      gui.add(params , 'progress' , 0.0 , 1.0).step(0.01).onChange(v=>{
        if(material){
          material.uniforms.uThreshold.value = params.progress;
        }
      })
      return gui;
    }

    function initScene(){
      const light = new THREE.DirectionalLight(0xffffff, 1.5);
      light.position.set(5, 10, 7.5);
      scene.add(light);
      const pointLight = new THREE.PointLight(0xffffff, 1, 50);
      pointLight.position.set(0, 10, 0);
      scene.add(pointLight);
      const ambientLight = new THREE.AmbientLight(0x404040,1.5); // soft white light
      scene.add(ambientLight);
   // ground
      const groundGeometry = new THREE.PlaneGeometry(3, 3);
      // const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, side: THREE.DoubleSide });
      const ground = new THREE.Mesh(groundGeometry, material);
      ground.castShadow = ground.receiveShadow = true;
      ground.position.set(0, 0, 0);
      ground.rotation.set(-Math.PI / 2, 0, 0);
      scene.add(ground);

      const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
      // const pillarMaterial = new THREE.MeshPhongMaterial({ color: 0x704214 });
      const numPillars = 3;
      const spacing = 1; // Distance between each pillar
    
      const matrixSize = Math.sqrt(numPillars); // 确定每行和每列的个数，确保 numPillars 是一个完全平方数

      for (let x = 0; x < matrixSize; x++) {
        for (let y = 0; y < matrixSize; y++) {
          const pillar = new THREE.Mesh(pillarGeometry, material);
          pillar.position.set(
            (x - (matrixSize - 1) / 2) * spacing, // Spread along x-axis
            // 2.5,
            1,
            (y - (matrixSize - 1) / 2) * spacing  // Spread along z-axis
          );
          scene.add(pillar);
        }
      }
    }

    function calculateMaxDistance(verticesArray: number[]) {
      let maxDistance = 0;
      for (let i = 0; i < verticesArray.length; i += 3) {
        const x = verticesArray[i];
        const y = verticesArray[i + 1];
        const z = verticesArray[i + 2];
        const distance = Math.sqrt(x * x + y * y + z * z);
        if (distance > maxDistance) {
          maxDistance = distance;
        }
      }
      return maxDistance;
    }
    function initialize() {

      let maxDistance = 0;
      let dissolveStartPoint = new THREE.Vector3();
      // Traverse the scene to find all meshes
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          meshes.push(object);
  
          // Calculate max distance for each mesh's geometry
          const distance = calculateMaxDistance(object.geometry.attributes.position.array);
          if (distance > maxDistance) maxDistance = distance;
  
          // Initialize and set shader material uniforms
          object.material.uniforms.uStartPoint.value = dissolveStartPoint;
          object.material.uniforms.uMaxDistance.value = maxDistance;
        }
      });
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

  return <div ref={divRef} style={{ position:'relative', width:'100%', height: '100%' }} />;
  
}