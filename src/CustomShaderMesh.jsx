import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

const CustomShaderMesh = () => {
  // Load shaders
  const vertexShader = `
    precision mediump float;

    // attribute vec3 position;
    varying vec3 vPosition;

    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    precision mediump float;

    varying vec3 vPosition;

    void main() {
        gl_FragColor = vec4(vPosition * 0.5 + 0.5, 1.0);
    }
  `

  // Define shader material
  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
      }),
    [],
  )

  return (
    <mesh material={shaderMaterial}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  )
}

export default CustomShaderMesh
