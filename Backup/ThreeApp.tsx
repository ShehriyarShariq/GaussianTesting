import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
// Assume gaussian-splats-3d can be imported directly; adjust the path as necessary.
import * as GaussianSplats3D from '@xspada/xspada-three-quick-viewer'

function ThreeApp() {
  const canvasParent = useRef(null)

  const viewer = useRef(null)

  useEffect(() => {
    canvasParent.current.innerHTML = ''
    viewer.current = new GaussianSplats3D.Viewer({
      cameraUp: [0, -1, -1.0],
      initialCameraPosition: [1, 1, 2],
      initialCameraLookAt: [0, 0, 0],
      sharedMemoryForWorkers: false,
      //   integerBasedSort: false,
      rootElement: canvasParent.current,
    })

    let path = 'polycam'
    path += '.ksplat'

    viewer.current
      .addSplatScene(
        path,
        //     {
        //     rotation: [
        //       //   0.7942534493271024,
        //       Math.PI / 2,
        //       0.5860189875490383,
        //       -0.1536048060771537,
        //       0.045884159031195075,
        //     ],
        //   }
      )
      .then(() => {
        viewer.current.start()

        //   const rotationAxis = new THREE.Vector3(1, 0, 0).normalize()
        //   const baseQuaternion = new THREE.Quaternion(
        //     0.7942534493271024,
        //     0.5860189875490383,
        //     -0.1536048060771537,
        //     0.045884159031195075,
        //   )
        //   const rotationQuaternion = new THREE.Quaternion()
        //   const quaternion = new THREE.Quaternion()

        //   requestAnimationFrame(update)
        //   function update() {
        //     requestAnimationFrame(update)
        //     const angle = Math.PI / 2

        //     rotationQuaternion.setFromAxisAngle(rotationAxis, angle)
        //     quaternion.copy(baseQuaternion).premultiply(rotationQuaternion)

        //     const splatScene = viewer.current.getSplatScene(0)
        //     splatScene.quaternion.copy(quaternion)

        //     // console.log(viewer.current.getSplatScene(0))
        //   }
      })

    // Cleanup function to stop or dispose viewer when component unmounts
    return () => {}
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={canvasParent}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      ></div>
      <div
        style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2 }}
      >
        <button
          style={{
            width: '150px',
            height: '70px',
            borderRadius: '7.5px',
          }}
          onClick={() => {
            console.log(viewer.current.getSplatScene(0))
            // const splatScene = viewer.current.getSplatScene(0)
            // const axis = new THREE.Vector3(1, 0, 0).normalize() // X-axis
            // const angle = Math.PI / 2 // 90 degrees in radians
            // const quaternion = new THREE.Quaternion().setFromAxisAngle(
            //   axis,
            //   angle,
            // )
            // splatScene.quaternion.copy(quaternion)
          }}
        >
          Rotate X + 180
        </button>
      </div>
    </div>
  )
}

export default ThreeApp
