import { useEffect, useRef } from "react";
import * as THREE from 'three';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import Stats from "three/examples/jsm/libs/stats.module";
import DepthVsShader from "./shader/depth_vs.glsl";
import DepthFsShader from "./shader/depth_fs.glsl";
import HighlightFsShader from "./shader/highlight_fs.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Base() {
  const divRef = useRef<HTMLDivElement | any>();

  useEffect(() => {
    let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, controls: OrbitControls, stats: Stats;
    let target: THREE.WebGLRenderTarget;
    let gui: GUI;
    const divCurrent = divRef.current;
    const depthMaterial = new THREE.ShaderMaterial({
      vertexShader: DepthVsShader,
      fragmentShader: DepthFsShader,
      side: THREE.DoubleSide,
      uniforms: {
        uNear: { value: 0.1 },
        uFar: { value: 100 },
      }
    })
    let width = divCurrent.clientWidth;
    let height = divCurrent.clientHeight;
    let plane: THREE.Object3D;

    init();

    function init() {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      renderer.setAnimationLoop(animate);
      divCurrent.appendChild(renderer.domElement);

      stats = new Stats();
      divCurrent.appendChild(stats.dom);

      camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100);
      camera.position.set(4, 4, 4);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      setupRenderTarget();
      setupScene();
      setupGUI();

      window.addEventListener('resize', onWindowResize);
    }

    function setupRenderTarget() {
      const dpr = renderer.getPixelRatio();
      target = new THREE.WebGLRenderTarget(width * dpr, height * dpr);
      target.texture.format = THREE.RGBAFormat;
      target.texture.minFilter = THREE.NearestFilter;
      target.texture.magFilter = THREE.NearestFilter;
      target.depthTexture = new THREE.DepthTexture(width * dpr, height * dpr);
      target.depthTexture.type = THREE.UnsignedShortType;
    }

    function setupScene() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xcccccc);

      const cubeGeometry = new THREE.BoxGeometry();
      const planeGeometry = new THREE.PlaneGeometry(2, 2);
      planeGeometry.rotateX(-Math.PI / 2);

      const planeMaterial = new THREE.ShaderMaterial({
        vertexShader: DepthVsShader,
        fragmentShader: HighlightFsShader,
        uniforms: {
          mainTex: { value: new THREE.TextureLoader().load('/texture/Pergament3.png') },
          tDepth: { value: target.texture },
          intersectionColor: { value: new THREE.Color(1, 1, 0) }, 
          intersectionWidth: { value: 0.01 },
          uNear: { value: camera.near },
          uFar: { value: camera.far },
        }
      });

      const cube = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('/texture/Pergament3.png') }));
      plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.z = 0.5;

      scene.add(cube);
      scene.add(plane);
    }

    function setupGUI() {
      gui = new GUI({ width: 300 });
      gui.open();
    }

    function onWindowResize() {
      const newWidth = divCurrent.clientWidth;
      const newHeight = divCurrent.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newWidth, newHeight);
    }

    function animate() {
      controls.update();
      
      renderer.setRenderTarget(target);
      plane.visible = false;
      scene.overrideMaterial = depthMaterial;
      renderer.render(scene, camera);

      plane.visible = true;
      scene.overrideMaterial = null;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      stats.update();
    }

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', onWindowResize);
      gui.destroy();
      renderer.dispose();
      target.dispose();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    };
  }, []);

  return <div ref={divRef} style={{ height: '100%', position: 'relative' }} />;
}