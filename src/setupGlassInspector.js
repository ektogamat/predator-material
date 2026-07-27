import { glassSettings } from "./glassSettings";
import { gridSettings } from "./gridSettings";
import { cloakSettings } from "./cloakSettings";

function blockPointerBubbling(inspector) {
  const stop = (event) => event.stopPropagation();
  const el = inspector.domElement;

  el.addEventListener("pointerdown", stop);
  el.addEventListener("pointermove", stop);
  el.addEventListener("pointerup", stop);
  el.addEventListener("wheel", stop);
}

export function setupGlassInspector(inspector) {
  blockPointerBubbling(inspector);

  const glass = inspector.createParameters("Glass");

  glass.add(glassSettings, "dispersion", 0, 20, 0.01);
  glass.add(glassSettings, "ior", 1, 2.5, 0.01);
  glass.add(glassSettings, "thickness", 0, 10, 0.1);
  glass.add(glassSettings, "transmission", 0, 1, 0.01);
  glass.add(glassSettings, "envMapIntensity", 0, 12, 0.1);

  const surface = glass.addFolder("Surface");
  surface.add(glassSettings, "roughness", 0, 1, 0.01);
  surface.add(glassSettings, "metalness", 0, 1, 0.01);
  surface.add(glassSettings, "specularIntensity", 0, 2, 0.01);
  surface.addColor(glassSettings, "specularColor");
  surface.add(glassSettings, "anisotropy", 0, 1, 0.01);
  surface.add(glassSettings, "anisotropyRotation", 0, Math.PI * 2, 0.01);

  const clearcoat = glass.addFolder("Clearcoat");
  clearcoat.add(glassSettings, "clearcoat", 0, 1, 0.01);
  clearcoat.add(glassSettings, "clearcoatRoughness", 0, 1, 0.01);

  const iridescence = glass.addFolder("Iridescence");
  iridescence.add(glassSettings, "iridescence", 0, 1, 0.01);
  iridescence.add(glassSettings, "iridescenceIOR", 1, 2.5, 0.01);
  iridescence.add(glassSettings, "iridescenceThicknessMin", 0, 1000, 1);
  iridescence.add(glassSettings, "iridescenceThicknessMax", 0, 1000, 1);

  const sheen = glass.addFolder("Sheen");
  sheen.add(glassSettings, "sheen", 0, 1, 0.01);
  sheen.add(glassSettings, "sheenRoughness", 0, 1, 0.01);
  sheen.addColor(glassSettings, "sheenColor");

  const rim = glass.addFolder("Rim");
  rim.add(glassSettings, "fresnelIntensity", 0, 2, 0.01);
  rim.addColor(glassSettings, "fresnelColor");

  const grid = inspector.createParameters("Grid");
  grid.addSelect(gridSettings, "projection", {
    UV: 0,
    Object: 1,
    World: 2,
    View: 3,
  });
  grid.add(gridSettings, "ringDensity", 1, 40, 0.1);
  grid.add(gridSettings, "ringWidth", 0.01, 0.5, 0.01);
  grid.add(gridSettings, "ringSpeed", 0, 3, 0.01);
  grid.add(gridSettings, "fadePower", 0.5, 8, 0.1);
  grid.add(gridSettings, "sizeMax", 1, 40, 0.1);

  const gridCenter = grid.addFolder("Center");
  gridCenter.add(gridSettings, "centerX", -5, 5, 0.01);
  gridCenter.add(gridSettings, "centerY", -5, 5, 0.01);
  gridCenter.add(gridSettings, "centerZ", -5, 5, 0.01);
  gridCenter.add(gridSettings, "axisScaleX", 0.1, 3, 0.01);
  gridCenter.add(gridSettings, "axisScaleY", 0.1, 3, 0.01);
  gridCenter.add(gridSettings, "axisScaleZ", 0.1, 3, 0.01);

  const gridUv = grid.addFolder("UV mode");
  gridUv.add(gridSettings, "uvScale", 1, 8, 0.1);
  gridUv.add(gridSettings, "cellOffset", 0, 1, 0.01);

  const gridShimmer = grid.addFolder("Shimmer");
  gridShimmer.add(gridSettings, "shimmerSpeed", 0, 6, 0.01);
  gridShimmer.add(gridSettings, "shimmerScale", 1, 40, 0.1);
  gridShimmer.add(gridSettings, "shimmerNormalScale", 0, 30, 0.1);
  gridShimmer.add(gridSettings, "shimmerMin", 0, 1, 0.01);
  gridShimmer.addColor(gridSettings, "cellColor");
  gridShimmer.add(gridSettings, "metalnessInCell", 0, 1, 0.001);

  const demo = inspector.createParameters("Demo");
  demo.add(cloakSettings, "forceCloak");
  demo.addButton(cloakSettings, "toggleCloak");
}
