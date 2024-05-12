import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SplatMesh, SplatLoader } from '@xspada/xspada--three-quickviewer'

function SplatMeshComponent({ url }) {
  const splatMeshRef = useRef()
  const { scene, camera, gl } = useThree() // Get the scene and camera from the R3F context

  const [mesh, setMesh] = useState(null)

  useEffect(() => {
    // Async function to load the SplatMesh
    async function loadSplatMesh() {
      try {
        // Load the splat file and add the mesh to the scene
        const splatMesh = await SplatLoader.LoadAsync(
          url,
          scene,
          camera,
          gl,
          () => {},
          false,
        )

        // splatMesh.position.set(0, 0, 0) // Set the position of the mesh

        splatMeshRef.current = splatMesh // Store the reference to the mesh

        console.log(splatMesh)

        setMesh(splatMesh)

        scene.add(splatMesh) // Add the mesh to the scene

        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // soft white light
        // scene.add(ambientLight)
      } catch (error) {
        console.error('Failed to load splat file:', error)
      }
    }

    loadSplatMesh()

    // Optional cleanup function
    return () => {
      if (splatMeshRef.current) {
        // Perform any cleanup if necessary
        // splatMeshRef.current.dispose()
      }
    }
  }, [url, scene, camera]) // Dependencies for the useEffect hook

  useFrame(() => {
    // Update the splat mesh in the animation loop
    if (splatMeshRef.current) {
      // splatMeshRef.current.updateCamera(camera)
      splatMeshRef.current.render()
    }
  })

  return null
}

export default SplatMeshComponent
