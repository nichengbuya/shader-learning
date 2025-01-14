import { useEffect, useRef } from "react";
import * as THREE from 'three';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default function Ablate() {
  const divRef = useRef<HTMLDivElement | any>();

  useEffect(() => {
    // init
    let width = divRef.current.clientWidth;
    let height = divRef.current.clientHeight;
    let params = {
      edgeColor: 0xd27b00,
      scale: 1,
      threshold: 0.0,
      edgeWidth: 0.03,
      edgeBrightness: 2.0

    }
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 2000);
    camera.position.set(6, -2, 20);
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    THREE.ColorManagement.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(width, height);
    renderer.setAnimationLoop(render);

    //添加光源
    // const pointLight = new THREE.PointLight(0xffffff, 0.5);
    // const ambientLight = new THREE.AmbientLight(0x0c0c0c);

    // pointLight.position.set(40, 55, 50); //设置位置
    // pointLight.castShadow = true;
    // scene.add(pointLight);
    // scene.add(ambientLight);

    const divCurrent = divRef.current;
    divCurrent.appendChild(renderer.domElement);

    
    const control = new OrbitControls(camera, renderer.domElement);
    const gui = addSettings();
    let phantom: any;
    addObject();
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

    // let time = 0;
    // animation
    function render() {
      // time += 0.05;
      if (phantom) {
        phantom.scale.set(params.scale, params.scale, params.scale);
        phantom.material.uniforms.threshold.value = params.threshold;
        phantom.material.uniforms.edgeColor.value = new THREE.Color(params.edgeColor);
        phantom.material.uniforms.edgeWidth.value = params.edgeWidth;
        phantom.material.uniforms.edgeBrightness.value = params.edgeBrightness;
      }


      // obj.material.uniforms.uTime.value = time;
      control.update();
      renderer.render(scene, camera);
    }

    function addSettings() {

      const gui = new GUI();
      gui.addColor(params, "edgeColor");
      gui.add(params, "scale", 0.1, 1);
      gui.add(params, "threshold", 0.0, 1.0).step(0.01);
      gui.add(params, "edgeWidth", 0.0, 0.06).step(0.01);

      return gui;
    }

    function addObject() {
      let textureLoader = new THREE.TextureLoader();
      let objLoader = new OBJLoader();

      let uniforms = {
        edgeColor: { value: new THREE.Color(params.edgeColor) },
        edgeWidth: { value: 0.02 },
        edgeBrightness: { value: 2.0 },
        threshold: { value: params.threshold },
        mainTex: {
          value: textureLoader.load(
            "/texture/Phantom_diffuse.png"
          ),
          onProgress
        },
        noiseTex: {
          value: textureLoader.load("/texture/noise-2.png"),
          onProgress
        }
      };
      let shaderMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.FrontSide
        // blending: THREE.AdditiveBlending,
        // transparent: true
      });

      objLoader.load(
        "https://oliverxh.github.io/demo/asset/Mesh/phantom.obj",
        onLoad,
        onProgress
      );

      function onLoad(obj: any) {
        let geometry = obj.children[0].geometry;
        phantom = new THREE.Mesh(geometry, shaderMaterial);
        scene.add(phantom);
        phantom.position.y = -6;

        // console.log(phantom);

        render();
      }

      // 加载过程回调函数-可以获得加载进度
      function onProgress(xhr: any) {
        // 后台打印查看模型文件加载进度
        console.log()
      }
      return phantom;
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