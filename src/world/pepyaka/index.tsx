import React from "react";
import { useEffect, useRef } from "react";
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import vertexShader from './vertexShader.js';
import fragmentShader from './fragmentShader.js';
import vertexParticles from './vertexParticles.js';
import fragmentParticles from './fragmentParticles.js';
export default function Pepyaka(){
    const divRef = useRef<HTMLDivElement | any>();

    useEffect(() => {
      // init
      let width = divRef.current.clientWidth;
      let height = divRef.current.clientHeight;
      const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
      camera.position.z = 4;
  
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
  
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setAnimationLoop(animation);
  
      const divCurrent = divRef.current;
      divCurrent.appendChild(renderer.domElement);
      const control = new OrbitControls(camera , renderer.domElement);
      const gui = addSettings();
      const obj = addObject();
      const particles = addParticles();
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
      let time = 0 ;
      // animation
      function animation() {
        time += 0.05;
        obj.material.uniforms.uTime.value = time;
        particles.material.uniforms.uTime.value = time;
        particles.rotation.y = time / 10;
        control.update();
        renderer.render(scene, camera);

      }
      function addSettings(){
        const settings = {
          progress: 0 
        }
        const gui = new GUI();
        gui.add(settings , 'progress' , 0 , 1 ).onChange((v)=>{});
        return gui;
      }

      function addObject(){
        const material = new THREE.ShaderMaterial( {
          side:THREE.DoubleSide,
          vertexShader:vertexShader,
          fragmentShader:fragmentShader,
          // wireframe:true,
          uniforms:{
            uTime:{
              value:0
            },

          },
          extensions: { derivatives: true }
        })
        // const geometry = new THREE.PlaneGeometry(2,2 );
        const geometry = new THREE.SphereGeometry(1, 164, 164);

        const mesh = new THREE.Mesh(geometry , material);
        scene.add(mesh)
        return mesh; 
      }

      function addParticles(){
        const material = new THREE.ShaderMaterial( {
          side:THREE.DoubleSide,
          vertexShader:vertexParticles,
          fragmentShader:fragmentParticles,
          // wireframe:true,
          transparent:true,
          uniforms:{
            uTime:{
              value:0
            },

          },
          extensions: { derivatives: true }
        })
        // const geometry = new THREE.PlaneGeometry(2,2 );
        let N = 6000;
        let positions = new Float32Array(N * 3);
        const radius = 1.8;
        const geometry = new THREE.BufferGeometry();
        const inc = Math.PI * (3 - Math.sqrt(5));
        const off = 2 / N;
        for(let i = 0 ; i < N ; i++){
          let y = i * off -1 + (off /2);
          let r = Math.sqrt( 1 - y * y);
          const phi = i * inc;
      
          positions[3 * i]     = radius * Math.cos(phi) * r;
          positions[3 * i + 1] = radius * y;
          positions[3 * i + 2] = radius * Math.sin(phi) * r;
        }
        geometry.setAttribute('position' , new THREE.BufferAttribute(positions , 3))

        const mesh = new THREE.Points(geometry , material);
        scene.add(mesh)
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
  
    return <div ref={divRef} style={{ height: '100%' }} />;
  
}