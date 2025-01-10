import { useEffect, useRef } from "react";
import * as THREE from 'three';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import Stats from "three/examples/jsm/libs/stats.module";
import DepthVsShader from "./shader/depth_vs.glsl";
import DepthFsShader from "./shader/depth_fs.glsl";
import HighlightFsShader from "./shader/highlight_fs.glsl";
import HighlightVsShader from "./shader/highlight_vs.glsl";
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
      uniforms:{
        uFar:{value: 10.0},
        uNear:{value: 0.1}
      }
    })
    let width = divCurrent.clientWidth;
    let height = divCurrent.clientHeight;
    let plane: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

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
      onWindowResize();
      window.addEventListener('resize', onWindowResize);
    }

    function setupRenderTarget() {
      target = new THREE.WebGLRenderTarget(1, 1, {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        stencilBuffer: false,
        depthBuffer: true
      });
    }

    function setupScene() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xcccccc);

      const cubeGeometry = new THREE.BoxGeometry();
      const planeGeometry = new THREE.PlaneGeometry(2, 2);
      planeGeometry.rotateX(-Math.PI / 2);

      const planeMaterial = new THREE.ShaderMaterial({
        uniforms: {
          depthBuffer: { value: null },
          resolution: { value: new THREE.Vector2(1, 1) },
          bufColor: { value: null },
          u_tex: { value: null },
          time: { value: 0 },
          mainTex: { value: new THREE.TextureLoader().load('/texture/Pergament3.png') },
        },
        vertexShader: HighlightVsShader,
        fragmentShader: HighlightFsShader,
        // transparent: true,
        // depthWrite: false,
        side: THREE.DoubleSide
      });

      const cube = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('/texture/Pergament3.png') }));
      plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.z = 0.5;
      plane.material.uniforms.depthBuffer.value = target.texture;
      plane.material.uniforms.bufColor.value = target.texture;
      // plane.material.uniforms.u_tex.value = texture;
      scene.add(cube);
      scene.add(plane);
    }

    function setupGUI() {
      gui = new GUI({ width: 300 });
      gui.open();
    }

    function onWindowResize() {
      if (!divRef.current) return;
      const { width, height } = divRef.current.getBoundingClientRect();
      const dPR = window.devicePixelRatio;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      target.setSize(width * dPR, height * dPR);
      // hdr.setSize(width * dPR, height * dPR);
      plane.material.uniforms.resolution.value.set(width * dPR, height * dPR);
    }

    function animate() {
      controls.update();
      plane.visible = false;
      scene.overrideMaterial = depthMaterial;
      renderer.setRenderTarget(target);
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

  return <div ref={divRef} style={{ width:'100%', height: '100%', position: 'relative' }} />;
}