import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import depthVertexShader from './shaders/depth-vs.glsl';
import depthFragmentShader from './shaders/depth-fs.glsl';
import shieldVertexShader from './shaders/shield-vs.glsl';
import shieldFragmentShader from './shaders/shield-fs.glsl';

const EnergyShield: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // stats
    const stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0'; // 距上边距0
    stats.dom.style.left = '0'; // 距左边距0  
    if (containerRef.current) {
      containerRef.current.appendChild(stats.dom);
    }

    // scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 1, 2);

    // control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.5;
    controls.maxDistance = 10;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.autoRotate = false;

    // cube
    const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: 'rgb(100, 70, 30)',
      roughness: 0.4,
      metalness: 0.0,
      side: THREE.DoubleSide
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = cube.receiveShadow = true;
    cube.position.set(-0.6, 0.2, -0.6);
    cube.rotation.set(-Math.PI / 2, 0, 0);
    scene.add(cube);

    // ground
    const groundGeometry = new THREE.PlaneGeometry(3, 3);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 'rgb(20, 20, 30)',
      roughness: 0.4,
      metalness: 0.0,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.castShadow = ground.receiveShadow = true;
    ground.position.set(0, 0, 0);
    ground.rotation.set(-Math.PI / 2, 0, 0);
    scene.add(ground);

    // light1
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-2, 2, 0.5);
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = -2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = -2;
    light.shadow.bias = -0.00001;
    light.shadow.mapSize.set(4096, 4096);
    scene.add(light);

    // light2
    const hemiLight = new THREE.HemisphereLight(0xbbbbbb, 0x080808, 1);
    scene.add(hemiLight);

    // light1 helper
    scene.add(new THREE.DirectionalLightHelper(light, 2, 0xFFFF00));
    // axis helper
    scene.add(new THREE.AxesHelper(100));

    const depthMaterial = new THREE.RawShaderMaterial({
      uniforms: {},
      vertexShader: depthVertexShader,
      fragmentShader: depthFragmentShader,
    });
    const depth = new THREE.WebGLRenderTarget(1, 1, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: true
    });
    const hdr = new THREE.WebGLRenderTarget(1, 1, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: true
    });

    // shield
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/noise.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    const shieldGeometry = new THREE.SphereGeometry(0.5, 100, 100);
    const shieldMaterial = new THREE.RawShaderMaterial({
      uniforms: {
        depthBuffer: { value: null },
        resolution: { value: new THREE.Vector2(1, 1) },
        bufColor: { value: null },
        u_tex: { value: null },
        time: { value: 0 }
      },
      vertexShader: shieldVertexShader,
      fragmentShader: shieldFragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.position.set(0, 0.3, 0);
    shield.material.uniforms.depthBuffer.value = depth.texture;
    shield.material.uniforms.bufColor.value = depth.texture;
    shield.material.uniforms.u_tex.value = texture;
    scene.add(shield);

    // tween
    const moveCube = () => {
      const tween = new TWEEN.Tween(cube.position);
      tween.to({
        x: 0.6,
        z: 0.6
      }, 5000);
      tween.yoyo(true);
      tween.repeat(Infinity);
      tween.start();
    };

    // resize
    const resize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const dPR = window.devicePixelRatio;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      depth.setSize(width * dPR, height * dPR);
      hdr.setSize(width * dPR, height * dPR);
      shield.material.uniforms.resolution.value.set(width * dPR, height * dPR);
    };

    // render
    const render = () => {
      shield.visible = false;
      scene.overrideMaterial = depthMaterial;
      renderer.setRenderTarget(depth);
      renderer.render(scene, camera);

      shield.visible = true;
      scene.overrideMaterial = null;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      TWEEN.update();
      stats.update();
      controls.update();
      shield.material.uniforms.time.value = performance.now();
    };

    window.addEventListener('resize', resize);

    moveCube();
    resize();
    renderer.setAnimationLoop(render);

    return () => {
      window.removeEventListener('resize', resize);
      renderer.dispose();
      TWEEN.removeAll();
      // 清理其他资源，如材质、纹理等
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};

export default EnergyShield;