import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { vertex as vertexShader } from './renderers/shaders/vertex.glsl'
import { frag as fragmentShader } from './renderers/shaders/frag.glsl'

const RowLength = 3 * 4 + 3 * 4 + 4 + 4

const NewThreeJsImpl = () => {
  const scene = useRef(null)
  const camera = useRef(null)
  const renderer = useRef(null)
  const controls = useRef(null)

  const canvas = useRef(null)

  const worker = useRef(null)

  const isInit = useRef(false)

  const shaderMaterial = useRef(null)

  const positions = useRef([])
  const vertexCount = useRef(0)

  const geometryRef = useRef(null)

  function calculateTextureSize(data) {
    const sideWidth = 2048

    const sideHeight = Math.ceil((2 * (data.length / RowLength)) / sideWidth)

    return { width: sideWidth, height: sideHeight }
  }

  function parseSplat(data) {
    const { width, height } = calculateTextureSize(data)

    vertexCount.current = data.length / RowLength
    positions.current = new Float32Array(vertexCount.current * 3)
    const colors = new Uint8Array(vertexCount.current * 3)
    const scales = new Float32Array(vertexCount.current * 3) // If needed
    const rotations = new Float32Array(vertexCount.current * 4) // If needed

    const _floatView = new Float32Array(1)
    const _int32View = new Int32Array(_floatView.buffer)

    const floatToHalf = (float) => {
      _floatView[0] = float
      const f = _int32View[0]

      const sign = (f >> 31) & 0x0001
      const exp = (f >> 23) & 0x00ff
      let frac = f & 0x007fffff

      let newExp
      if (exp == 0) {
        newExp = 0
      } else if (exp < 113) {
        newExp = 0
        frac |= 0x00800000
        frac = frac >> (113 - exp)
        if (frac & 0x01000000) {
          newExp = 1
          frac = 0
        }
      } else if (exp < 142) {
        newExp = exp - 112
      } else {
        newExp = 31
        frac = 0
      }

      return (sign << 15) | (newExp << 10) | (frac >> 13)
    }

    const packHalf2x16 = (x, y) => {
      return (floatToHalf(x) | (floatToHalf(y) << 16)) >>> 0
    }

    const _data = new Uint32Array(width * height * 4)

    const dataView = new DataView(data.buffer)
    const _dataView = new DataView(_data.buffer)

    for (let i = 0; i < vertexCount.current; i++) {
      // Assuming the structure based on the provided setData function
      const offset = i * RowLength

      //   if (dataView.getFloat32(8 * i + 0, true) != NaN) {
      //     positions[3 * i + 0] = dataView.getFloat32(8 * i + 0, true)
      //   }
      //   if (dataView.getFloat32(8 * i + 1, true) != NaN) {
      //     positions[3 * i + 1] = dataView.getFloat32(8 * i + 1, true)
      //   }
      //   if (dataView.getFloat32(8 * i + 2, true) != NaN) {
      //     positions[3 * i + 2] = dataView.getFloat32(8 * i + 2, true)
      //   }

      positions.current[3 * i + 0] = dataView.getFloat32(offset + 0, true)
      positions.current[3 * i + 1] = dataView.getFloat32(offset + 4, true)
      positions.current[3 * i + 2] = dataView.getFloat32(offset + 8, true)
      //   positions[3 * i + 0] = dataView.getFloat32(8 * i + 0, true)
      //   positions[3 * i + 1] = dataView.getFloat32(8 * i + 1, true)
      //   positions[3 * i + 2] = dataView.getFloat32(8 * i + 2, true)

      // Rotation quaternion components are stored immediately after the position.
      rotations[4 * i + 0] = (dataView.getUint8(offset + 12) - 128) / 128
      rotations[4 * i + 1] = (dataView.getUint8(offset + 13) - 128) / 128
      rotations[4 * i + 2] = (dataView.getUint8(offset + 14) - 128) / 128
      rotations[4 * i + 3] = (dataView.getUint8(offset + 15) - 128) / 128

      // Scale components are assumed to be stored after rotation.
      scales[3 * i + 0] = dataView.getFloat32(offset + 16, true)
      scales[3 * i + 1] = dataView.getFloat32(offset + 20, true)
      scales[3 * i + 2] = dataView.getFloat32(offset + 24, true)

      // Colors are assumed to follow after scales.
      colors[i * 3 + 0] = dataView.getUint8(offset + 28)
      colors[i * 3 + 1] = dataView.getUint8(offset + 29)
      colors[i * 3 + 2] = dataView.getUint8(offset + 30)

      _dataView.setFloat32(8 * i + 0, positions.current[3 * i + 0], true)
      _dataView.setFloat32(8 * i + 1, positions.current[3 * i + 1], true)
      _dataView.setFloat32(8 * i + 2, positions.current[3 * i + 2], true)

      _dataView.setUint8(
        4 * (8 * i + 7) + 0,
        dataView.getUint8(32 * i + 24 + 0),
      )
      _dataView.setUint8(
        4 * (8 * i + 7) + 1,
        dataView.getUint8(32 * i + 24 + 1),
      )
      _dataView.setUint8(
        4 * (8 * i + 7) + 2,
        dataView.getUint8(32 * i + 24 + 2),
      )
      _dataView.setUint8(
        4 * (8 * i + 7) + 3,
        dataView.getUint8(32 * i + 24 + 3),
      )

      const quaternion = new THREE.Quaternion(
        rotations[4 * i + 1],
        rotations[4 * i + 2],
        rotations[4 * i + 3],
        -rotations[4 * i + 0],
      )

      const scale = new THREE.Vector3(
        scales[3 * i + 0],
        scales[3 * i + 1],
        scales[3 * i + 2],
      )

      const matrix = new THREE.Matrix4()
      matrix.compose(
        new THREE.Vector3(0, 0, 0), // Assuming no translation
        quaternion,
        scale,
      )

      // Extract the rotation matrix part for covariance computation
      const M = new THREE.Matrix3().setFromMatrix4(matrix)

      const sigma = [
        M.elements[0] * M.elements[0] +
          M.elements[3] * M.elements[3] +
          M.elements[6] * M.elements[6],
        M.elements[0] * M.elements[1] +
          M.elements[3] * M.elements[4] +
          M.elements[6] * M.elements[7],
        M.elements[0] * M.elements[2] +
          M.elements[3] * M.elements[5] +
          M.elements[6] * M.elements[8],
        M.elements[1] * M.elements[1] +
          M.elements[4] * M.elements[4] +
          M.elements[7] * M.elements[7],
        M.elements[1] * M.elements[2] +
          M.elements[4] * M.elements[5] +
          M.elements[7] * M.elements[8],
        M.elements[2] * M.elements[2] +
          M.elements[5] * M.elements[5] +
          M.elements[8] * M.elements[8],
      ]

      _data[8 * i + 4] = packHalf2x16(4 * sigma[0], 4 * sigma[1])
      _data[8 * i + 5] = packHalf2x16(4 * sigma[2], 4 * sigma[3])
      _data[8 * i + 6] = packHalf2x16(4 * sigma[4], 4 * sigma[5])
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions.current, 3),
    )

    geometry.setAttribute(
      'aPosition',
      new THREE.BufferAttribute(positions.current, 2),
    )

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3, true)) // true for normalized colors

    console.log(geometry.getAttribute('aPosition'))

    return { data: _data, geometry }
  }

  function createPointCloud(geometry) {
    shaderMaterial.current.uniforms.projection.value =
      controls.current.projectionMatrix
    shaderMaterial.current.uniforms.view.value =
      controls.current.matrixWorldInverse

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
    })

    const pointCloud = new THREE.Points(geometry, shaderMaterial.current)
    // const pointCloud = new THREE.Points(geometry, material)
    scene.current.add(pointCloud)

    const serializedScene = {
      positions: positions.current,
      vertexCount: vertexCount.current,
    }
    worker.current.postMessage({ scene: serializedScene })
  }

  const handleSplatUpload = (event) => {
    const file = event.target.files[0]
    if (!file) {
      console.log('No file selected.')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      const buffer = e.target.result

      const { data, geometry } = parseSplat(new Uint8Array(buffer))

      geometryRef.current = geometry

      const { width, height } = calculateTextureSize(new Uint8Array(buffer))

      const dataTexture = new THREE.DataTexture(
        data,
        width,
        height,
        THREE.RGBAIntegerFormat,
        THREE.UnsignedIntType,
      )
      dataTexture.internalFormat = 'RGBA32UI'
      dataTexture.needsUpdate = true

      // // Update the shader material with the new texture
      shaderMaterial.current.uniforms.u_texture.value = dataTexture

      createPointCloud(geometry)
    }
    reader.readAsArrayBuffer(file)
  }

  useEffect(() => {
    if (!isInit.current) {
      isInit.current = true

      const main = async () => {
        // Render loop
        const frame = () => {
          shaderMaterial.current.uniforms.projection.value =
            camera.current.projectionMatrix
          shaderMaterial.current.uniforms.view.value =
            camera.current.matrixWorldInverse

          camera.current.updateMatrixWorld() // Ensure the camera's world matrix is up to date

          const viewMatrix = new THREE.Matrix4()
          viewMatrix.copy(camera.current.matrixWorldInverse) // Get the view matrix

          const viewProjMatrix = new THREE.Matrix4()
          viewProjMatrix.multiplyMatrices(
            camera.current.projectionMatrix,
            viewMatrix,
          )

          worker.current.postMessage({ viewProj: viewProjMatrix })

          controls.current.update()
          renderer.current.render(scene.current, camera.current)

          requestAnimationFrame(frame)
        }

        requestAnimationFrame(frame)
      }

      scene.current = new THREE.Scene()
      scene.current.rotation.x = Math.PI / 2
      scene.current.rotation.y = Math.PI

      camera.current = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      )

      canvas.current = document.createElement('canvas')
      document.body.appendChild(canvas.current)
      const context = canvas.current.getContext('webgl2')
      renderer.current = new THREE.WebGLRenderer({
        canvas: canvas.current,
        context: context,
      })
      renderer.current.getContext().getExtension('EXT_color_buffer_float')
      renderer.current.setSize(window.innerWidth, window.innerHeight)
      //   document.body.appendChild(renderer.current.domElement)

      renderer.current.setClearColor(0x000000)

      controls.current = new OrbitControls(camera.current, canvas.current)
      camera.current.position.z = 5

      worker.current = new Worker(
        new URL('./renderers/webgl/Worker.js', import.meta.url),
        { type: 'module' },
      )

      const uniforms = {
        u_texture: { type: 't', value: null }, // You will need to set these textures with your data
        projection: { value: controls.current.projectionMatrix },
        view: { value: controls.current.matrixWorldInverse },
        viewport: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        u_useDepthFade: { value: true },
        u_depthFade: { value: 1.0 },
      }

      // Create ShaderMaterial
      shaderMaterial.current = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        glslVersion: THREE.GLSL3,
        transparent: true, // if you're using alpha values
        depthWrite: false, // Depending on your needs
        // blending: THREE.AdditiveBlending,
      })

      worker.current.onmessage = (e) => {
        if (e.data.depthIndex) {
          const { depthIndex } = e.data

          if (geometryRef.current) {
            // console.log(depthIndex)

            const instanceIndices = new Uint32Array(depthIndex) // or Float32Array, depending on your use case
            const attribute = new THREE.InstancedBufferAttribute(
              instanceIndices,
              1,
              false,
            )
            geometryRef.current.setAttribute('index', attribute)
            attribute.needsUpdate = true

            console.log(geometryRef.current.getAttribute('index'))
          }
        }
      }

      main()
    }
  }, [])

  return (
    <div>
      <input type="file" onChange={handleSplatUpload} />
    </div>
  )
}

export default NewThreeJsImpl
