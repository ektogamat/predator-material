// Cloak grid / contour lines — Inspector → Parameters → Grid, or `__gridSettings`.
export const gridSettings = {
  projection: 0,
  uvScale: 3,
  fadePower: 3.5,
  sizeMax: 20.5,
  cellOffset: 0.25,

  ringDensity: 14,
  ringWidth: 0.12,
  ringSpeed: 0.35,
  centerX: 0,
  centerY: 0,
  centerZ: 0,
  axisScaleX: 1,
  axisScaleY: 1,
  axisScaleZ: 1,

  shimmerSpeed: 2,
  shimmerScale: 15,
  shimmerNormalScale: 10.5,
  shimmerMin: 0.6,

  cellColor: '#e6e6e6',
  metalnessInCell: 0.003,
}

export function applyGridUniforms(uniforms) {
  const s = gridSettings

  uniforms.projection.value = s.projection
  uniforms.uvScale.value = s.uvScale
  uniforms.fadePower.value = s.fadePower
  uniforms.sizeMax.value = s.sizeMax
  uniforms.cellOffset.value = s.cellOffset
  uniforms.ringDensity.value = s.ringDensity
  uniforms.ringWidth.value = s.ringWidth
  uniforms.ringSpeed.value = s.ringSpeed
  uniforms.centerX.value = s.centerX
  uniforms.centerY.value = s.centerY
  uniforms.centerZ.value = s.centerZ
  uniforms.axisScaleX.value = s.axisScaleX
  uniforms.axisScaleY.value = s.axisScaleY
  uniforms.axisScaleZ.value = s.axisScaleZ
  uniforms.shimmerSpeed.value = s.shimmerSpeed
  uniforms.shimmerScale.value = s.shimmerScale
  uniforms.shimmerNormalScale.value = s.shimmerNormalScale
  uniforms.shimmerMin.value = s.shimmerMin
  uniforms.metalnessInCell.value = s.metalnessInCell
  uniforms.cellColor.value.set(s.cellColor)
}

if (import.meta.env.DEV) {
  globalThis.__gridSettings = gridSettings
}
