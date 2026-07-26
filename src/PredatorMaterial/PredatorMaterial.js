import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CSM from 'three-custom-shader-material'
import Frag from './shaders/Frag'
import Vert from './shaders/Vert'
import { easing } from 'maath'

export default function PredatorCloakMaterial({ originalMaterial, gridWidth, gridHeight, iridescence, color, hover }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0.0 },
      gridWidth: { value: gridWidth },
      gridHeight: { value: gridHeight }
    }),
    [gridHeight, gridWidth]
  )

  const frag = useMemo(() => `${Frag}`, [])

  const baseMaterialCustom = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: color ? new THREE.Color(color) : null,
      map: originalMaterial ? originalMaterial.map : null,
      roughness: originalMaterial?.roughness ?? 0.4,
      metalness: originalMaterial?.metalness ?? 0.4,
      normalMap: originalMaterial ? originalMaterial.normalMap : null,
      normalScale: new THREE.Vector2(0.9, -0.5),
      ior: 1.1,
      thickness: 1.9,
      transmission: 1,
      iridescence: iridescence ? iridescence : null,
      envMapIntensity: 1
    })
  }, [color, originalMaterial, iridescence])

  useFrame((state, dt) => {
    uniforms.uTime.value += dt
    easing.damp(uniforms.uProgress, 'value', hover ? 1.0 : 0.0, 1.2, dt)
    const p = uniforms.uProgress.value
    // Match shader: glass engages in the first ~8% of progress
    const glass = Math.min(1, p / 0.08)
    const glassSmooth = glass * glass * (3 - 2 * glass)
    baseMaterialCustom.envMapIntensity = 1 + glassSmooth * 5
  })

  return (
    <CSM
      baseMaterial={baseMaterialCustom}
      uniforms={uniforms}
      vertexShader={Vert}
      fragmentShader={frag}
    />
  )
}
