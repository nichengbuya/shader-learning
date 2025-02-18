import { useEffect, useRef } from "react";
import * as THREE from 'three';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Base() {
    const divRef = useRef<HTMLDivElement | any>();

    useEffect(() => {
        // init
        let width = divRef.current.clientWidth;
        let height = divRef.current.clientHeight;

        // 创建正交相机，确保平面能撑满屏幕
        const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.01, 10);
        camera.position.z = 1;

        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(animation);

        const divCurrent = divRef.current;
        divCurrent.appendChild(renderer.domElement);

        const control = new OrbitControls(camera, renderer.domElement);
        const gui = addSettings();
        const obj = addObject();

        window.addEventListener('resize', handleResize);

        // handle window resize
        function handleResize() {
            width = divRef.current.clientWidth;
            height = divRef.current.clientHeight;

            // 更新相机的正交投影参数
            camera.left = -width / 2;
            camera.right = width / 2;
            camera.top = height / 2;
            camera.bottom = -height / 2;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);

            // 更新着色器中的分辨率
            obj.material.uniforms.iResolution.value.set(width, height);

            renderer.render(scene, camera);
        }

        // animation
        function animation() {
            const currentTime = performance.now() / 1000; // 转换为秒

            // 更新着色器中的时间
            obj.material.uniforms.iTime.value = currentTime;
            control.update();
            renderer.render(scene, camera);
        }

        function addSettings() {
            const settings = {
                progress: 0
            }
            const gui = new GUI();
            gui.add(settings, 'progress', 0, 1).onChange((v) => { });
            return gui;
        }

        function addObject() {
            const loader = new THREE.TextureLoader();
            const material = new THREE.ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                uniforms: {
                    iTime: {
                        value: 0
                    },
                    iResolution: { value: new THREE.Vector2(width, height) },
                    iChannel0: {
                        value: loader.load('/texture/wave.png')
                    },
                    iChannel1: {
                        value: loader.load('/texture/stone.png')
                    },
                }
            })
            // 创建一个与屏幕尺寸匹配的平面几何体
            const geometry = new THREE.PlaneGeometry(width, height);
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

    return <div ref={divRef} style={{ height: '100%' }} />;
}
