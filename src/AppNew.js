// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useRef, useState } from 'react'
import * as SPLAT from '@xspada/xspada-quick-viewer'

function AppNew() {
  const scene = useRef(null)
  const camera = useRef(null)
  const renderer = useRef(null)
  const controls = useRef(null)

  const isStencilGeoVisible = useRef(false)

  const isInit = useRef(false)
  const animTimerRef = useRef(null)

  const [keyframes, setKeyframes] = useState([])
  const [currentKeyframe, setCurrentKeyframe] = useState(null)

  const [xPosition, setXPosition] = useState(0)
  const [yPosition, setYPosition] = useState(0)
  const [zPosition, setZPosition] = useState(0)

  const [xRotation, setXRotation] = useState(0)
  const [yRotation, setYRotation] = useState(0)
  const [zRotation, setZRotation] = useState(0)

  const [xSize, setXSize] = useState(1)
  const [ySize, setYSize] = useState(1)
  const [zSize, setZSize] = useState(1)

  const sampleKeyframe = {
    matrix:
      '[0.2507952323837337,0.9680401600210546,5.551115123125783e-17,0,-0.14342534737929796,0.037157955641970886,0.9889633239213864,0,0.957356214343813,-0.2480272866418538,0.1481605343482636,0,0.7587234692740742,-0.08656371985474104,-0.20763755252896438,1]',
    fov: 50,
    aspect: 1,
  }

  const saveToFile = (data, name) => {
    const blob = new Blob([data.buffer], { type: 'application/octet-stream' })
    const link = document.createElement('a')
    link.download = name
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]

    await SPLAT.PLYLoader.LoadFromFileAsync(file, scene.current, (progress) => {
      console.log('Loading PLY file: ' + progress)

      if (progress == 1) {
        setTimeout(() => {
          scene.current.rotateObject(0, rotateByOnAxis(90, 'x'))
          // scene.current.rotate(rotateByOnAxis(90, 'x'))
          // scene.current.limitBox(-0.5, 0.5, -0.5, 0.5, -0.5, 0.5)
          controls.current.setPositionAndRotation(
            new SPLAT.Vector3(0.75, -0.75, 0.75),
            new SPLAT.Vector3(0, 0, 0),
          )
        }, 1000)
      }
    })
    // saveToFile(scene.current.data, file.name.replace('.ply', '.splat'))
  }

  const handleSplatUpload = async (e) => {
    const file = e.target.files[0]

    await SPLAT.Loader.LoadFromFileAsync(file, scene.current, (progress) => {
      console.log('Loading PLY file: ' + progress)

      if (progress == 1) {
        setTimeout(() => {
          scene.current.rotateObject(0, rotateByOnAxis(90, 'x'))
          // scene.current.rotate(rotateByOnAxis(90, 'x'))
          // scene.current.limitBox(-0.5, 0.5, -0.5, 0.5, -0.5, 0.5)
          controls.current.setPositionAndRotation(
            new SPLAT.Vector3(0.75, -0.75, 0.75),
            new SPLAT.Vector3(0, 0, 0),
          )
        }, 1000)
      }
    })
  }

  // const handlePathUpload = (e) => {
  //   const file = e.target.files[0]

  //   const reader = new FileReader()
  //   reader.onload = (event) => {
  //     var obj = JSON.parse(event.target.result)

  //     const fileKeyframes = []

  //     for (let i = 0; i < obj['camera_path'].length; i++) {
  //       fileKeyframes.push({
  //         position: rotateVector90DegXAxis(
  //           new SPLAT.Vector3(
  //             // obj['camera_path'][i]['camera_to_world'][3],
  //             // obj['camera_path'][i]['camera_to_world'][7],
  //             // obj['camera_path'][i]['camera_to_world'][11],
  //             obj['camera_path'][i]['camera_to_world'][0],
  //             obj['camera_path'][i]['camera_to_world'][1],
  //             obj['camera_path'][i]['camera_to_world'][2],
  //           ),
  //         ),
  //         rotation: rotateVector90DegXAxis(
  //           new SPLAT.Vector3(
  //             // -obj['camera_path'][i]['camera_to_world'][2],
  //             // -obj['camera_path'][i]['camera_to_world'][6],
  //             // -obj['camera_path'][i]['camera_to_world'][10],
  //             -obj['camera_path'][i]['camera_to_world'][12],
  //             -obj['camera_path'][i]['camera_to_world'][13],
  //             -obj['camera_path'][i]['camera_to_world'][14],
  //           ),
  //         ),
  //       })
  //     }
  //     setKeyframes(fileKeyframes)

  //     console.log(fileKeyframes)

  //     setTimeout(() => {
  //       setCurrentKeyframe(0)
  //     }, 0)
  //   }
  //   reader.readAsText(file)
  // }

  // const convertBlenderToWebGL = () => {
  //   let matrix = JSON.parse(sampleKeyframe.matrix)

  //   return {
  //     matrix: matrix, // Transformed matrix
  //     fov: sampleKeyframe.fov,
  //     aspect: sampleKeyframe.aspect,
  //   }
  // }

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
      renderer.current = new SPLAT.WebGLRenderer(null, null) //, 1)

      controls.current = new SPLAT.OrbitControls(
        camera.current,
        renderer.current.canvas,
      )

      main()
    }
  })

  useEffect(() => {
    if (keyframes.length > 0) {
      let i = 0
      animTimerRef.current = setInterval(() => {
        if (i < keyframes.length - 1) {
          controls.current.setPositionAndRotation(
            keyframes[i]['position'],
            keyframes[i]['rotation'],
            false,
          )

          // console.log(controls.current.getCurrentPositionAndRotation())

          i++
        } else {
          i = 0
        }
      }, 1000 / 24)
    }
  }, [keyframes])

  // useEffect(() => {
  //   const onAnimInterrupt = () => {
  //     if (animTimerRef.current != null) {
  //       clearInterval(animTimerRef.current)
  //       animTimerRef.current = null
  //     }
  //   }

  //   // window.addEventListener('keydown', onAnimInterrupt)

  //   // renderer.current.canvas.addEventListener('dragenter', onAnimInterrupt)
  //   // renderer.current.canvas.addEventListener('contextmenu', onAnimInterrupt)

  //   // renderer.current.canvas.addEventListener('mousedown', onAnimInterrupt)
  //   // renderer.current.canvas.addEventListener('wheel', onAnimInterrupt)

  //   // renderer.current.canvas.addEventListener('touchstart', onAnimInterrupt)

  //   return () => {
  //     // renderer.current.canvas.removeEventListener('dragenter', onAnimInterrupt)
  //     // renderer.current.canvas.removeEventListener(
  //     //   'contextmenu',
  //     //   onAnimInterrupt,
  //     // )

  //     // renderer.current.canvas.removeEventListener('mousedown', onAnimInterrupt)
  //     // renderer.current.canvas.removeEventListener('wheel', onAnimInterrupt)

  //     // renderer.current.canvas.removeEventListener('touchstart', onAnimInterrupt)

  //     // window.removeEventListener('keydown', onAnimInterrupt)
  //   }
  // }, [])

  // return (
  //   <div>
  //     <div>
  //       <input type="file" accept=".ply" onChange={handleFileChange} />
  //     </div>
  //     <div
  //       ref={(el) => (el ? el.appendChild(renderer.current.canvas) : null)}
  //     />
  //   </div>
  // )

  // const scene = useRef(new SPLAT.Scene())
  // const camera = useRef(
  //   new SPLAT.Camera(),
  //   // new SPLAT.Vector3(
  //   //   -0.043491134311137526,
  //   //   4.239469358442465,
  //   //   2.6504731804083153,
  //   // ),
  // )
  // const renderer = useRef(new SPLAT.WebGLRenderer())
  // const controls = useRef(
  //   new SPLAT.OrbitControls(camera.current, renderer.current.canvas),
  // )

  // useEffect(() => {
  //   const main = async () => {
  //     const url =
  //       'https://xspada-data.nyc3.digitaloceanspaces.com/splat/a2bc57d1-ff3e-406a-ad8e-4bc6e7b7e91d.splat'

  //     await SPLAT.Loader.LoadAsync(url, scene.current, () => {})

  //     const frame = () => {
  //       controls.current.update()
  //       renderer.current.render(scene.current, camera.current)

  //       requestAnimationFrame(frame)
  //     }

  //     requestAnimationFrame(frame)
  //   }

  //   main()
  // }, [])

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
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
        }}
      >
        <input type="file" accept=".ply" onChange={handleFileChange} />
      </div>
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
          // onChange={handlePathUpload}
        />
      </div> */}
      <div
        ref={(el) =>
          el && renderer.current
            ? el.appendChild(renderer.current.canvas)
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
            // scene.current.rotateObject(0, rotateByOnAxis(90, 'x'))
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
        {/* <button
          style={{
            width: '150px',
            height: '70px',
            borderRadius: '7.5px',
          }}
          onClick={() => {
            const convertedKeyframe = convertBlenderToWebGL()
            const convertedKeyframeMatrix = convertedKeyframe.matrix

            const cameraPosition = rotateVector90DegXAxis(
              new SPLAT.Vector3(
                convertedKeyframeMatrix[12],
                convertedKeyframeMatrix[13],
                convertedKeyframeMatrix[14],
              ),
            )

            const lookAtPosition = rotateVector90DegXAxis(
              new SPLAT.Vector3(
                -convertedKeyframeMatrix[8],
                -convertedKeyframeMatrix[9],
                -convertedKeyframeMatrix[10],
              ),
            )

            controls.current.setPositionAndRotation(
              cameraPosition,
              lookAtPosition,
            )

            console.log(controls.current.getCurrentPositionAndRotation())
          }}
        >
          Set Camera To Keyframe
        </button> */}
        {/* <button
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
        <button
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

export default AppNew
