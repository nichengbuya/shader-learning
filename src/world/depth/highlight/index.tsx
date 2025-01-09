import { useEffect, useRef } from "react";
import * as THREE from 'three';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import Stats from "three/examples/jsm/libs/stats.module";
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Base() {
  const divRef = useRef<HTMLDivElement | any>();

  useEffect(() => {
    // init
    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, controls: OrbitControls, stats: Stats;
    let target: THREE.WebGLRenderTarget<THREE.Texture>;
    let gui: GUI;
    let shaderMaterial: THREE.ShaderMaterial;
    // let material: THREE.MeshBasicMaterial;
    const divCurrent = divRef.current;

    let width = divRef.current.clientWidth;
    let height = divRef.current.clientHeight;
    let sphere: THREE.Object3D<THREE.Object3DEventMap>;
    init();

    function init() {

      renderer = new THREE.WebGLRenderer();

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      renderer.setAnimationLoop(animate);
      divCurrent.appendChild(renderer.domElement);

      stats = new Stats();
      stats.dom.style.position = 'absolute';
      stats.dom.style.top = '0'; // 距上边距0
      stats.dom.style.left = '0'; // 距左边距0  
      divCurrent.appendChild(stats.dom);

      camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
      camera.position.y = 4;
      camera.position.x = 4;
      camera.position.z = 4;
      // camera.lookAt(new THREE.Vector3(0, 0, 0));

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      // Create a render target with depth texture
      setupRenderTarget();

      // Our scene
      setupScene();

      // Setup post-processing step

      onWindowResize();
      window.addEventListener('resize', onWindowResize);

      //
      gui = new GUI({ width: 300 });

      gui.open();

    }

    function setupRenderTarget() {

      if (target) target.dispose();

      const dpr = renderer.getPixelRatio();
      target = new THREE.WebGLRenderTarget(width * dpr, height * dpr);
      target.texture.format = THREE.RGBAFormat;
      target.texture.minFilter = THREE.NearestFilter;
      target.texture.magFilter = THREE.NearestFilter;
      target.depthBuffer = true;
      target.depthTexture = new THREE.DepthTexture(width, height);
      target.depthTexture.type = THREE.UnsignedShortType;
    }


    function setupScene() {

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xcccccc);
      const cubeGeometry = new THREE.BoxGeometry();
      const planeGeometry = new THREE.PlaneGeometry(2, 2);
      planeGeometry.rotateX(- Math.PI / 2);
      // 普通材质
      // uniform sampler2D tDiffuse;
      // uniform sampler2D tDepth;
      // uniform float cameraNear;
      // uniform float cameraFar;
      // 将它们添加到场景中
      shaderMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          _MainTex: { value: new THREE.TextureLoader().load('/texture/Pergament3.png')},
          tDepth: { value: target.depthTexture },
          _IntersectionColor: { value: new THREE.Color(1, 1, 0) }, // 黄色
          _IntersectionWidth: { value: 0.01},
          uNear: { value: camera.near},
          uFar: { value: camera.far},
        }
      });
      // material = new THREE.MeshBasicMaterial({color: 0x00ff00});
      const cube = new THREE.Mesh(cubeGeometry, shaderMaterial);
      sphere = new THREE.Mesh(planeGeometry, shaderMaterial);
      sphere.position.z = 0.5;

      // 使用自定义着色器材质代替基本材质
      scene.add(cube);
      scene.add(sphere);

    }

    function onWindowResize() {

      const aspect = width / height;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      const dpr = renderer.getPixelRatio();
      target.setSize(width * dpr, height * dpr);
      renderer.setSize(width, height);

    }

    function animate() { 

      requestAnimationFrame(animate);

      // 将场景渲染到深度渲染目标
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      shaderMaterial.uniforms.tDepth.value = target.depthTexture;
;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
      controls.update(); // required because damping is enabled

      stats.update();

    }


    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', onWindowResize);

      divCurrent.removeChild(renderer.domElement);
      gui.destroy();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      })
    };
  }, []);

  return <div ref={divRef} style={{ height: '100%', position: 'relative' }} />;

}