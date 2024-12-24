import * as THREE from 'three';
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
class ThreeSceneManager {
    divRef: any;
    camera!: THREE.Camera;
    scene!: THREE.Scene;
    renderer!: THREE.WebGLRenderer;
    control!: OrbitControls;
    gui!: GUI;
    constructor(divRef: any) {
        this.divRef = divRef;
        this.init();
    }

    init() {
        const width = this.divRef.clientWidth;
        const height = this.divRef.clientHeight;

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
        this.camera.position.z = 3;

        // 创建场景
        this.scene = new THREE.Scene();

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setAnimationLoop(this.animation.bind(this));

        const divCurrent = this.divRef;
        divCurrent.appendChild(this.renderer.domElement);

        // 创建轨道控制器
        this.control = new OrbitControls(this.camera, this.renderer.domElement);

        // 创建GUI
        this.gui = this.addSettings();

        // 添加窗口大小改变事件监听
        window.addEventListener('resize', this.handleResize.bind(this));

        // 添加物体示例（这里以添加一个球体为例，可根据需求调整添加逻辑）
    }

    addSettings() {
        const settings = {
            progress: 0
        };
        const gui = new GUI();
        gui.add(settings, 'progress', 0, 1).onChange((v: any) => { });
        return gui;
    }

    async addObject() {
        const textureLoader = new THREE.TextureLoader();
        const texture = await textureLoader.loadAsync('/log512.png');
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: {
                    value: 0
                },
                uTexture: {
                    value: texture
                }
            }
        });
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        return mesh;
    }

    handleResize() {
        const width = this.divRef.clientWidth;
        const height = this.divRef.clientHeight;
        this.renderer.setSize(width, height);
        // this.camera.aspect = width / height;
        // this.camera.updateProjectionMatrix();
        this.renderer.render(this.scene, this.camera);
    }

    animation() {
        this.control.update();
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        this.renderer.setAnimationLoop(null);
        window.removeEventListener('resize', this.handleResize);
        const divCurrent = this.divRef;
        divCurrent.removeChild(this.renderer.domElement);
        this.gui.destroy();
        this.scene.traverse((child:THREE.Object3D)=>{
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
    }
}
export default ThreeSceneManager;