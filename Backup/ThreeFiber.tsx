import React, { useState } from 'react'
import {
  Environment,
  OrbitControls,
  PerformanceMonitor,
  Splat,
} from '@xspada/xspada-r3f-quick-viewer'
import { Canvas } from '@react-three/fiber'
import { Leva, useControls } from 'leva'

import * as THREE from 'three'

const urls = [
  'https://antimatter15.com/splat-data/train.splat',
  'https://antimatter15.com/splat-data/plush.splat',
  // 'https://antimatter15.com/splat-data/truck.splat',
  // 'https://antimatter15.com/splat-data/garden.splat',
  // 'https://antimatter15.com/splat-data/treehill.splat',
  // 'https://antimatter15.com/splat-data/stump.splat',
  // 'https://antimatter15.com/splat-data/bicycle.splat',
  // 'https://media.reshot.ai/models/nike_next/model.splat',
]

const ThreeFiber = () => {
  //   const gl = useThree((state) => state.gl)
  const { url, throttleDpr, maxDpr, throttleSplats, maxSplats } = useControls({
    url: { label: 'Model URL', options: urls },
    throttleDpr: {
      label: 'Degrade pixel ratio based on perf.',
      value: false,
    },
    maxDpr: { label: 'Max pixel ratio', value: window?.devicePixelRatio ?? 1 },
    throttleSplats: {
      label: 'Degrade splat count based on perf.',
      value: false,
    },
    maxSplats: { label: 'Max splat count', value: 10000000 },
  })

  // Performance factor
  const [factor, setFactor] = useState(1)

  // Downsample pixels if perf gets bad
  // const [dpr, setDpr] = useState(maxDpr);
  const dpr = Math.min(maxDpr, Math.round(0.5 + 1.5 * factor))
  const effectiveDpr = throttleDpr ? Math.min(maxDpr, dpr) : maxDpr

  // Downsample splats if perf gets bad
  const [splats, setSplats] = useState(maxSplats)
  // const splats =
  const effectiveSplats = throttleSplats
    ? Math.min(maxSplats, splats)
    : maxSplats

  return (
    <>
      <Leva oneLineLabels collapsed />
      <Canvas
        dpr={1.5}
        camera={{ position: [1, -1.25, 1] }} //
        gl={{ preserveDrawingBuffer: true }}
        style={{ height: '100vh' }}
      >
        <PerformanceMonitor
          ms={250}
          iterations={1}
          step={1}
          onIncline={({ factor }) => {
            setFactor(factor)
            setSplats(
              Math.min(
                maxSplats,
                Math.round((0.9 + 0.2 * factor) * effectiveSplats),
              ),
            )
          }}
          onDecline={({ factor }) => {
            setFactor(factor)
            setSplats(
              Math.min(
                maxSplats,
                Math.round((0.9 + 0.2 * factor) * effectiveSplats),
              ),
            )
          }}
        />

        <OrbitControls />

        <group position={[0, 0, 0]}>
          {/* <Splat url={url} maxSplats={effectiveSplats} /> */}
          <Splat
            src={
              urls[0]
              // 'https://firebasestorage.googleapis.com/v0/b/mne-app-596f1.appspot.com/o/poster.splat?alt=media&token=9f99dac5-c24a-4119-a365-d643d1616997'
              // 'https://xspada-data.nyc3.digitaloceanspaces.com/splat/40bcef11-bead-4d56-b08e-8cab97e92790.splat'
              // 'https://xspada-data.nyc3.digitaloceanspaces.com/splat/dda1a3a0-ebe7-4296-b9c1-ef03b9da22b1.splat'
              // 'https://firebasestorage.googleapis.com/v0/b/mne-app-596f1.appspot.com/o/pepsi-alt.splat?alt=media&token=4406c6e3-25f2-4cee-9aa1-94016147e1f3'
              // 'https://firebasestorage.googleapis.com/v0/b/mne-app-596f1.appspot.com/o/pepsi.splat?alt=media&token=4185a923-c2e0-47ba-a6e9-f308e8ef643a'
            }
            toneMapped={true}
          />
        </group>
        {/* <Environment preset="city" /> */}
      </Canvas>
    </>
  )
}

export default ThreeFiber
