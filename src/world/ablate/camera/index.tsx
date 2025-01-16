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
      progress: 0.5
    }
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);
    camera.position.set(0 , 10 , 10);

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
        uScreenSpaceMask: { value: loader.load('/texture/ScreenRamp.jpg') },
        uThreshold: { value: 0.0 },
        uWorkDistance: { value: 20.0 },
        uPlayerPos: { value: new THREE.Vector3(0, 0, 0) },
        uCameraPosition: { value: camera.position },
        uResolution: {value: new THREE.Vector2(1,1)},
      }
    })

    initScene();
    // handle window resize
    function handleResize() {
      if (!divRef.current) return;
      const { width, height } = divRef.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      const dPR = window.devicePixelRatio;
      material.uniforms.uResolution.value.set(width * dPR, height * dPR);
    }

    // animation
    function animation() {

      control.update();
      stats.update();
      material.uniforms.uCameraPosition.value = camera.position;
      renderer.render(scene, camera);
    }
    function addSettings(){

      const gui = new GUI();
      gui.add(params , 'progress' , 0.0 , 1.0).step(0.01).onChange(v=>{
        scene.getObjectByName('box')!.position.x =  (2 * v - 1) * 10;
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
      const capsuleGeometry = new THREE.CapsuleGeometry(0.25, 1, 8, 8);
      const capsuleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
      const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
      capsule.position.set(0, 0.5, 0);
      capsule.name = 'player'
      scene.add(capsule);
      const groundGeometry = new THREE.PlaneGeometry(10, 10);
      const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, side: THREE.DoubleSide });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.castShadow = ground.receiveShadow = true;
      ground.position.set(0, 0, 0);
      ground.rotation.set(-Math.PI / 2, 0, 0);
      scene.add(ground);
      const geometry = new THREE.BoxGeometry(10, 10 , 0.2);
      const mesh = new THREE.Mesh(geometry , material);
      mesh.name = 'box';
      mesh.position.z = 2;
      mesh.position.y = 5;
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

  return <div ref={divRef} style={{ position:'relative', width:'100%', height: '100%' }} />;
  
}