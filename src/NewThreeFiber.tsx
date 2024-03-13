import { OrbitControls, TransformControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useEffect, useRef, useState } from 'react'
import { Splat } from './components/splat/Splat'

const urls = [
  'https://antimatter15.com/splat-data/train.splat',
  'https://firebasestorage.googleapis.com/v0/b/mne-app-596f1.appspot.com/o/pepsi.splat?alt=media&token=4185a923-c2e0-47ba-a6e9-f308e8ef643a',
  // 'https://antimatter15.com/splat-data/plush.splat',
  // 'https://antimatter15.com/splat-data/truck.splat',
  // 'https://antimatter15.com/splat-data/garden.splat',
  // 'https://antimatter15.com/splat-data/treehill.splat',
  // 'https://antimatter15.com/splat-data/stump.splat',
  // 'https://antimatter15.com/splat-data/bicycle.splat',
  // 'https://media.reshot.ai/models/nike_next/model.splat',
]

function NewThreeFiber() {
  const throttleDpr = false
  const throttleSplats = false
  const maxDpr = window?.devicePixelRatio ?? 1
  const maxSplats = 10000000

  const transform = useRef()
  const orbit = useRef()
  const { mode } = useControls({
    mode: {
      label: 'Mode',
      options: ['translate', 'scale', 'rotate'],
    },
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

  useEffect(() => {
    if (transform.current) {
      const controls = transform.current
      ;(controls as any).setMode(mode)
      const callback = (event: any) =>
        ((orbit.current as any).enabled = !event.value)

      ;(controls as any).addEventListener('dragging-changed', callback)

      return () =>
        (controls as any).removeEventListener('dragging-changed', callback)
    }
  })

  return (
    <>
      <Leva oneLineLabels collapsed />
      <Canvas
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'black',
        }}
        gl={{ antialias: false }}
        dpr={effectiveDpr}
      >
        <OrbitControls ref={orbit as any} />

        <TransformControls ref={transform as any}>
          <group position={[0, 0, 0]}>
            <Splat url={urls[1]} maxSplats={effectiveSplats} />
          </group>
        </TransformControls>
      </Canvas>
    </>
  )
}

export default NewThreeFiber
