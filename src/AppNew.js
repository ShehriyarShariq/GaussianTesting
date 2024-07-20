import React, { useEffect, useRef, useState } from 'react'
import * as SPLAT from '@xspada/xspada-quick-viewer'

function App() {
  const scene = useRef(null)
  const camera = useRef(null)
  const renderer = useRef(null)
  const controls = useRef(null)

  const isStencilGeoVisible = useRef(false)

  const isInit = useRef(false)

  const [xPosition, setXPosition] = useState(0)
  const [yPosition, setYPosition] = useState(0)
  const [zPosition, setZPosition] = useState(0)

  const [xRotation, setXRotation] = useState(0)
  const [yRotation, setYRotation] = useState(0)
  const [zRotation, setZRotation] = useState(0)

  const [xSize, setXSize] = useState(1)
  const [ySize, setYSize] = useState(1)
  const [zSize, setZSize] = useState(1)

  const saveToFile = (data, name) => {
    const blob = new Blob([data.buffer], { type: 'application/octet-stream' })
    const link = document.createElement('a')
    link.download = name
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const handleSplatUpload = async (e) => {
    const file = e.target.files[0]

    await SPLAT.Loader.LoadFromFileAsync(file, scene.current, (progress) => {
      console.log('Loading PLY file: ' + progress)

      if (progress == 1) {
        // setTimeout(() => {
        //   scene.current.rotate(rotateByOnAxis(90, 'x'))
        //   // scene.current.limitBox(-0.5, 0.5, -0.5, 0.5, -0.5, 0.5)
        //   controls.current.setPositionAndRotation(
        //     new SPLAT.Vector3(0.75, -0.75, 0.75),
        //     new SPLAT.Vector3(0, 0, 0),
        //   )
        // }, 1000)
      }
    })
  }

  useEffect(() => {
    const main = async () => {
      // Render loop
      const frame = () => {
        controls.current.update()
        renderer.current.render(scene.current, camera.current)

        requestAnimationFrame(frame)
      }

      requestAnimationFrame(frame)
    }

    if (!isInit.current) {
      isInit.current = true

      scene.current = new SPLAT.Scene()
      camera.current = new SPLAT.Camera()
      renderer.current = new SPLAT.WebGLRenderer(null, null, 1)
      controls.current = new SPLAT.OrbitControls(
        camera.current,
        renderer.current.domElement,
      )

      main()
    }
  })

  const rotateByOnAxis = (rotateBy, axis) => {
    if (axis == 'x') {
      return SPLAT.Quaternion.FromEuler(
        new SPLAT.Vector3(rotateBy * (Math.PI / 180), 0, 0),
      )
    } else if (axis == 'y') {
      return SPLAT.Quaternion.FromEuler(
        new SPLAT.Vector3(0, rotateBy * (Math.PI / 180), 0),
      )
    } else if (axis == 'z') {
      return SPLAT.Quaternion.FromEuler(
        new SPLAT.Vector3(0, 0, rotateBy * (Math.PI / 180)),
      )
    }
  }

  function rotateVector90DegXAxis(vector) {
    const radian = Math.PI // 90 degrees in radians

    // Rotation around X-axis formula
    const newY = vector.y * Math.cos(radian) - vector.z * Math.sin(radian)
    const newZ = vector.y * Math.sin(radian) + vector.z * Math.cos(radian)

    return new SPLAT.Vector3(vector.x, newY, newZ)
  }

  function applyQuaternion(vector, quaternion) {
    // Convert vector to a pure quaternion (w = 0)
    const pureQuat = new SPLAT.Quaternion(vector.x, vector.y, vector.z, 0)

    // Compute q * v
    const quatTimesVector = quaternion.multiply(pureQuat)

    // Compute (q * v) * q⁻¹
    const inverseQuaternion = new SPLAT.Quaternion(
      -quaternion.x,
      -quaternion.y,
      -quaternion.z,
      quaternion.w,
    ) // Assuming unit quaternion for inverse
    const rotatedQuat = quatTimesVector.multiply(inverseQuaternion)

    // Return the rotated vector
    return new SPLAT.Vector3(rotatedQuat.x, rotatedQuat.y, rotatedQuat.z)
  }

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {/* <div
        style={{
          position: 'absolute',
          zIndex: 1,
        }}
      >
        <input type="file" accept=".ply" onChange={handleFileChange} />
      </div> */}
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          left: 100,
        }}
      >
        <input type="file" accept=".splat" onChange={handleSplatUpload} />
      </div>
      {/* <div
        style={{
          position: 'absolute',
          zIndex: 1,
          left: 200,
        }}
      >
        <input
          title="Select Camera Path"
          type="file"
          accept=".json"
          onChange={handlePathUpload}
        />
      </div> */}
      <div
        ref={(el) =>
          el && renderer.current
            ? el.appendChild(renderer.current.domElement)
            : null
        }
        style={{
          position: 'absolute',
          top: 0,
        }}
      />
      <div
        style={{
          background: 'white',
          zIndex: 10,
          position: 'fixed',
          bottom: 0,
        }}
      >
        <div>
          <input
            type="number"
            placeholder="X Position"
            value={xPosition}
            onChange={(e) => setXPosition(e.target.value)}
          />
          <input
            type="number"
            placeholder="Y Position"
            value={yPosition}
            onChange={(e) => setYPosition(e.target.value)}
          />
          <input
            type="number"
            placeholder="Z Position"
            value={zPosition}
            onChange={(e) => setZPosition(e.target.value)}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="X Rotation"
            value={xRotation}
            onChange={(e) => setXRotation(e.target.value)}
          />
          <input
            type="number"
            placeholder="Y Rotation"
            value={yRotation}
            onChange={(e) => setYRotation(e.target.value)}
          />
          <input
            type="number"
            placeholder="Z Rotation"
            value={zRotation}
            onChange={(e) => setZRotation(e.target.value)}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="X Size"
            value={xSize}
            onChange={(e) => setXSize(e.target.value)}
          />
          <input
            type="number"
            placeholder="Y Size"
            value={ySize}
            onChange={(e) => setYSize(e.target.value)}
          />
          <input
            type="number"
            placeholder="Z Size"
            value={zSize}
            onChange={(e) => setZSize(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            console.log(scene.current.getBounds())

            renderer.current.updateStencilTransform(
              new SPLAT.Vector3(xPosition, yPosition, zPosition),
              new SPLAT.Vector3(xRotation + Math.PI / 2, yRotation, zRotation),
              // new SPLAT.Vector3(1, 1, 1),
              new SPLAT.Vector3(xSize, ySize, zSize),
            )

            scene.current.limitBox(
              new SPLAT.Vector3(xPosition, yPosition, zPosition),
              // new SPLAT.Vector3(Math.PI / 4, Math.PI / 4, Math.PI / 4),
              new SPLAT.Vector3(xRotation, yRotation, zRotation),
              new SPLAT.Vector3(xSize, ySize, zSize),
            )

            if (!isStencilGeoVisible.current) {
              renderer.current.toggleStencilGeometry()
              renderer.current.toggleStencil()
              isStencilGeoVisible.current = true
            }

            setTimeout(() => {
              scene.current.refreshScene()

              console.log(scene.current.getBounds())
            }, 0)
          }}
        >
          Go
        </button>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '100px',
          display: 'flex',
          flexDirection: 'row',
          gap: '15px',
        }}
      >
        <button
          style={{
            width: '150px',
            height: '70px',
            borderRadius: '7.5px',
          }}
          onClick={() => {
            scene.current.rotate(rotateByOnAxis(90, 'x'))
          }}
        >
          Rotate X + 90
        </button>
        <button
          style={{
            width: '150px',
            height: '70px',
            borderRadius: '7.5px',
          }}
          onClick={() => {
            controls.current.setPositionAndRotation(
              new SPLAT.Vector3(0.75, -0.75, 0.75),
              new SPLAT.Vector3(0, 0, 0),
            )
          }}
        >
          Set Position
        </button>
        <button
          style={{
            width: '150px',
            height: '70px',
            borderRadius: '7.5px',
          }}
          onClick={() => {
            renderer.current.toggleStencil()

            setTimeout(() => {
              scene.current.refreshScene()
            }, 0)
          }}
        >
          Toggle Stencil
        </button>
        <button
          style={{
            width: '150px',
            height: '70px',
            borderRadius: '7.5px',
          }}
          onClick={() => {
            renderer.current.updateStencilTransform(
              new SPLAT.Vector3(0, 0, 0),
              new SPLAT.Vector3(1, 1, 1),
              new SPLAT.Vector3(5, 5, 5),
            )

            setTimeout(() => {
              scene.current.refreshScene()
            }, 0)
          }}
        >
          Transform Stencil
        </button>
        <button
          style={{
            width: '150px',
            height: '70px',
            borderRadius: '7.5px',
          }}
          onClick={() => {
            renderer.current.updateStencilTransform(
              new SPLAT.Vector3(0, 0, 0),
              new SPLAT.Vector3(Math.PI / 2, 1, 1),
              new SPLAT.Vector3(1, 1, 1),
            )

            setTimeout(() => {
              scene.current.refreshScene()
            }, 0)
          }}
        >
          Reset Transform
        </button>
        {/* <button
          style={{
            width: '150px',
            height: '70px',
            borderRadius: '7.5px',
          }}
          onClick={() => {
            console.log(scene.current.getBounds())

            renderer.current.updateStencilTransform(
              new SPLAT.Vector3(0, 0, 0),
              new SPLAT.Vector3(Math.PI / 2, 1, 1),
              // new SPLAT.Vector3(1, 1, 1),
              new SPLAT.Vector3(1, 1, 1),
            )

            scene.current.limitBox(
              new SPLAT.Vector3(0, 0, 0),
              // new SPLAT.Vector3(Math.PI / 4, Math.PI / 4, Math.PI / 4),
              new SPLAT.Vector3(1, 1, 1),
              new SPLAT.Vector3(1, 1, 1),
            )

            if (!isStencilGeoVisible.current) {
              renderer.current.toggleStencilGeometry()
              renderer.current.toggleStencil()
              isStencilGeoVisible.current = true
            }

            setTimeout(() => {
              scene.current.refreshScene()

              console.log(scene.current.getBounds())
            }, 0)

            // renderer.current.updateStencilTransform(
            //   new SPLAT.Vector3(0, 0, 0),
            //   new SPLAT.Vector3(Math.PI / 2, Math.PI / 2, Math.PI / 2),
            //   new SPLAT.Vector3(0.1, 0.1, 0.1),
            // )

            // setTimeout(() => {
            //   scene.current.refreshScene()
            // }, 0)
          }}
        >
          Crop
        </button> */}
      </div>
    </div>
  )
}

export default App
