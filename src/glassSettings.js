// Tweaked live in dev via Inspector → Parameters → Glass, or `__glassSettings` in the console.
export const glassSettings = {
  dispersion: 12,
  ior: 1.16,
  thickness: 2.4,
  transmission: 1,
  envMapIntensity: 1.8,
  fresnelIntensity: 0.88,
  fresnelColor: '#f2f7ff',

  roughness: 0.3,
  metalness: 0.42,
  specularIntensity: 1,
  specularColor: '#ffffff',
  anisotropy: 0,
  anisotropyRotation: 0,

  clearcoat: 0.07,
  clearcoatRoughness: 0.14,

  iridescence: 0.21,
  iridescenceIOR: 1.36,
  iridescenceThicknessMin: 0,
  iridescenceThicknessMax: 1000,

  sheen: 0,
  sheenRoughness: 0.29,
  sheenColor: '#ffffff',
}

export function applyGlassSettings(material, uniforms, glassSmooth) {
  const s = glassSettings

  uniforms.fresnelIntensity.value = s.fresnelIntensity
  uniforms.transmission.value = s.transmission
  uniforms.fresnelColor.value.set(s.fresnelColor)

  material.ior = s.ior
  material.thickness = s.thickness
  material.dispersion = glassSmooth * s.dispersion
  material.envMapIntensity = s.envMapIntensity
  material.roughness = s.roughness
  material.metalness = s.metalness
  material.specularIntensity = s.specularIntensity
  material.specularColor.set(s.specularColor)
  material.clearcoat = s.clearcoat
  material.clearcoatRoughness = s.clearcoatRoughness
  material.iridescence = s.iridescence
  material.iridescenceIOR = s.iridescenceIOR
  material.iridescenceThicknessRange = [
    s.iridescenceThicknessMin,
    s.iridescenceThicknessMax,
  ]
  material.sheen = s.sheen
  material.sheenRoughness = s.sheenRoughness
  material.sheenColor.set(s.sheenColor)
  material.anisotropy = s.anisotropy
  material.anisotropyRotation = s.anisotropyRotation
}

if (import.meta.env.DEV) {
  globalThis.__glassSettings = glassSettings
}
