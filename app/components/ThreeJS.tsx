import React from 'react';
import { StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';

export default function ThreeJS() {
  const onContextCreate = async (gl: WebGLRenderingContext) => {
    console.log('WebGL context created:', gl);

    if (!gl) {
      console.error('WebGL context is not available');
      return;
    }

    // Set up the scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);

    // Set up the renderer with GLView's canvas
    const renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
    });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    scene.background = new THREE.Color(0xeeeeee);

    // Create a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    console.log('Cube created:', cube);

    // Position the camera
    camera.position.z = 5;
    camera.lookAt(cube.position);

    // Handle context loss
    gl.canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.warn('WebGL context lost');
    });

    gl.canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
      onContextCreate(gl); // Reinitialize the scene
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the cube
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // Render the scene with the camera
      renderer.render(scene, camera);

      // The GLView component will handle the frame swapping automatically
      gl.flush(); // Ensure the frame is flushed to the screen
    };

    animate(); // Start the animation loop
  };

  return (
    <GLView
      style={{ width: '100%', height: 300, backgroundColor: 'teal' }}
      onContextCreate={onContextCreate}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});