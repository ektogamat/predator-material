import React from 'react'
import {
  EffectComposer,
  Vignette,
  Bloom,
  HueSaturation,
  Autofocus
} from '@react-three/postprocessing'
import { Environment } from '@react-three/drei'

export default function Effects() {
  return (
    <>
      <EffectComposer disableNormalPass multisampling={0}>
        <Bloom
          luminanceThreshold={0.67}
          radius={0.7}
          levels={5}
          intensity={0.8}
          mipmapBlur
        />
        <Autofocus target={[-0.05, 1.35, 0]} bokehScale={20} smoothTime={0.4} />
        <Vignette offset={0.8} darkness={0.45} />
        <HueSaturation hue={0.1} saturation={0.4} />
      </EffectComposer>
      <directionalLight
        shadow-mapSize={1024}
        shadow-bias={-0.001}
        shadow-normalBias={0.03}
        castShadow
        position={[-25, 1, 30]}
        intensity={6}
      />
      <Environment
        ground={{ height: 15, radius: 590, scale: 50 }}
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rainforest_trail_1k.hdr"
      />
    </>
  )
}
