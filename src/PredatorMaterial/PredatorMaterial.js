import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three/webgpu";
import {
  Fn,
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
  float,
  mod,
  floor,
  abs,
  pow,
  sin,
  clamp,
  mix,
  smoothstep,
  dot,
  select,
  length,
  fract,
  normalWorld,
  positionWorld,
  positionLocal,
  positionView,
  cameraPosition,
  materialColor,
  materialRoughness,
  materialMetalness,
} from "three/tsl";
import { easing } from "maath";
import { glassSettings, applyGlassSettings } from "../glassSettings";
import { cloakSettings } from "../cloakSettings";
import { gridSettings, applyGridUniforms } from "../gridSettings";

function buildGridMask({
  uProgress,
  uTime,
  uGridWidth,
  uGridHeight,
  uProjection,
  uUvScale,
  uFadePower,
  uSizeMax,
  uCellOffset,
  uRingDensity,
  uRingWidth,
  uRingSpeed,
  uCenterX,
  uCenterY,
  uCenterZ,
  uAxisScaleX,
  uAxisScaleY,
  uAxisScaleZ,
}) {
  const uvGridMask = Fn(() => {
    const fadeTimer = uProgress.mul(1.3);
    const posI = vec2(
      uv().x.mul(uGridWidth).mul(uUvScale),
      uv().y.mul(uGridHeight).mul(uUvScale),
    );
    const finalPos = mod(posI, 2).sub(vec2(1, 2));
    const posI2 = vec2(
      floor(posI.x.div(2)).div(uGridWidth),
      floor(posI.y.div(2)).div(uGridHeight),
    );
    const size = clamp(pow(fadeTimer.add(posI2.y), uFadePower), 0, uSizeMax)
      .mul(uProgress)
      .abs();
    return float(
      abs(finalPos.x.add(uCellOffset)).add(abs(finalPos.y)).lessThan(size),
    );
  });

  const ringMaskFromPosition = (positionNode) =>
    Fn(() => {
      const local = positionNode.sub(vec3(uCenterX, uCenterY, uCenterZ));
      const scaled = vec3(
        local.x.mul(uAxisScaleX),
        local.y.mul(uAxisScaleY),
        local.z.mul(uAxisScaleZ),
      );
      const dist = length(scaled);
      const phase = dist.mul(uRingDensity).sub(uTime.mul(uRingSpeed));
      const rings = abs(fract(phase).sub(0.5)).mul(2.0);
      const lines = float(1).sub(smoothstep(float(0), uRingWidth, rings));
      const revealRadius = uSizeMax.mul(
        clamp(pow(uProgress.mul(1.3), float(1).div(uFadePower)), 0, 1),
      );
      const reveal = float(dist.lessThan(revealRadius));
      return lines.mul(reveal);
    })();

  const objectRingMask = ringMaskFromPosition(positionLocal);
  const worldRingMask = ringMaskFromPosition(positionWorld);
  const viewRingMask = ringMaskFromPosition(positionView);

  return Fn(() => {
    const uvMask = uvGridMask();
    const isUv = uProjection.lessThan(0.5);
    const isObject = uProjection
      .greaterThan(0.5)
      .and(uProjection.lessThan(1.5));
    const isWorld = uProjection.greaterThan(1.5).and(uProjection.lessThan(2.5));

    return select(
      isUv,
      uvMask,
      select(
        isObject,
        objectRingMask,
        select(isWorld, worldRingMask, viewRingMask),
      ),
    );
  })();
}

export default function PredatorCloakMaterial({
  originalMaterial,
  gridWidth,
  gridHeight,
  color,
  hover,
  materialName = "PredatorCloak",
}) {
  const { material, uniforms } = useMemo(() => {
    const uTime = uniform(0);
    const uProgress = uniform(0);
    const uGridWidth = uniform(gridWidth);
    const uGridHeight = uniform(gridHeight);
    const uFresnelIntensity = uniform(glassSettings.fresnelIntensity);
    const uFresnelColor = uniform(new THREE.Color(glassSettings.fresnelColor));
    const uTransmission = uniform(glassSettings.transmission);
    const uCellColor = uniform(new THREE.Color(gridSettings.cellColor));

    const uProjection = uniform(gridSettings.projection);
    const uUvScale = uniform(gridSettings.uvScale);
    const uFadePower = uniform(gridSettings.fadePower);
    const uSizeMax = uniform(gridSettings.sizeMax);
    const uCellOffset = uniform(gridSettings.cellOffset);
    const uRingDensity = uniform(gridSettings.ringDensity);
    const uRingWidth = uniform(gridSettings.ringWidth);
    const uRingSpeed = uniform(gridSettings.ringSpeed);
    const uCenterX = uniform(gridSettings.centerX);
    const uCenterY = uniform(gridSettings.centerY);
    const uCenterZ = uniform(gridSettings.centerZ);
    const uAxisScaleX = uniform(gridSettings.axisScaleX);
    const uAxisScaleY = uniform(gridSettings.axisScaleY);
    const uAxisScaleZ = uniform(gridSettings.axisScaleZ);
    const uShimmerSpeed = uniform(gridSettings.shimmerSpeed);
    const uShimmerScale = uniform(gridSettings.shimmerScale);
    const uShimmerNormalScale = uniform(gridSettings.shimmerNormalScale);
    const uShimmerMin = uniform(gridSettings.shimmerMin);
    const uMetalnessInCell = uniform(gridSettings.metalnessInCell);

    const material = new THREE.MeshPhysicalNodeMaterial({
      name: materialName,
      color: color ? new THREE.Color(color) : null,
      map: originalMaterial ? originalMaterial.map : null,
      roughness: glassSettings.roughness,
      metalness: glassSettings.metalness,
      normalMap: originalMaterial ? originalMaterial.normalMap : null,
      normalScale: new THREE.Vector2(0.9, -0.5),
      ior: glassSettings.ior,
      thickness: glassSettings.thickness,
      transmission: 0,
      dispersion: 0,
      envMapIntensity: glassSettings.envMapIntensity,
      specularIntensity: glassSettings.specularIntensity,
      specularColor: new THREE.Color(glassSettings.specularColor),
      clearcoat: glassSettings.clearcoat,
      clearcoatRoughness: glassSettings.clearcoatRoughness,
      iridescence: glassSettings.iridescence,
      iridescenceIOR: glassSettings.iridescenceIOR,
      iridescenceThicknessRange: [
        glassSettings.iridescenceThicknessMin,
        glassSettings.iridescenceThicknessMax,
      ],
      sheen: glassSettings.sheen,
      sheenRoughness: glassSettings.sheenRoughness,
      sheenColor: new THREE.Color(glassSettings.sheenColor),
      anisotropy: glassSettings.anisotropy,
      anisotropyRotation: glassSettings.anisotropyRotation,
    });

    const glass = smoothstep(0, 0.08, uProgress);
    material.transmissionNode = glass.mul(uTransmission);

    const gridMask = buildGridMask({
      uProgress,
      uTime,
      uGridWidth,
      uGridHeight,
      uProjection,
      uUvScale,
      uFadePower,
      uSizeMax,
      uCellOffset,
      uRingDensity,
      uRingWidth,
      uRingSpeed,
      uCenterX,
      uCenterY,
      uCenterZ,
      uAxisScaleX,
      uAxisScaleY,
      uAxisScaleZ,
    });

    material.colorNode = mix(materialColor, vec4(uCellColor, 1.0), gridMask);

    material.roughnessNode = mix(
      materialRoughness,
      clamp(
        pow(
          sin(
            uProgress
              .mul(uShimmerScale)
              .add(uTime.mul(uShimmerSpeed))
              .add(normalWorld.y.mul(uShimmerNormalScale)),
          ),
          2,
        ),
        uShimmerMin,
        1,
      ),
      gridMask,
    );
    material.metalnessNode = mix(materialMetalness, uMetalnessInCell, gridMask);

    const fresnelMask = smoothstep(0.4, 0.85, uProgress);
    const viewDir = cameraPosition.sub(positionWorld).normalize();
    const NdotV = clamp(dot(normalWorld, viewDir), 0, 1);
    const fresnel = pow(float(1).sub(NdotV), 4).mul(fresnelMask);
    material.emissiveNode = uFresnelColor.mul(fresnel).mul(uFresnelIntensity);

    const gridUniforms = {
      projection: uProjection,
      uvScale: uUvScale,
      fadePower: uFadePower,
      sizeMax: uSizeMax,
      cellOffset: uCellOffset,
      ringDensity: uRingDensity,
      ringWidth: uRingWidth,
      ringSpeed: uRingSpeed,
      centerX: uCenterX,
      centerY: uCenterY,
      centerZ: uCenterZ,
      axisScaleX: uAxisScaleX,
      axisScaleY: uAxisScaleY,
      axisScaleZ: uAxisScaleZ,
      shimmerSpeed: uShimmerSpeed,
      shimmerScale: uShimmerScale,
      shimmerNormalScale: uShimmerNormalScale,
      shimmerMin: uShimmerMin,
      metalnessInCell: uMetalnessInCell,
      cellColor: uCellColor,
    };

    const uniforms = {
      uTime,
      uProgress,
      fresnelIntensity: uFresnelIntensity,
      fresnelColor: uFresnelColor,
      transmission: uTransmission,
      grid: gridUniforms,
    };

    return { material, uniforms };
  }, [gridHeight, gridWidth, color, originalMaterial, materialName]);

  useFrame((state, dt) => {
    uniforms.uTime.value += dt;
    const active = hover || cloakSettings.forceCloak;
    easing.damp(uniforms.uProgress, "value", active ? 1.0 : 0.0, 1.2, dt);

    const p = uniforms.uProgress.value;
    const glass = Math.min(1, p / 0.08);
    const glassSmooth = glass * glass * (3 - 2 * glass);

    applyGlassSettings(material, uniforms, glassSmooth);
    applyGridUniforms(uniforms.grid);
  });

  return <primitive object={material} attach="material" />;
}
