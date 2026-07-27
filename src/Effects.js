import { useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three/webgpu";
import { pass, uv, float, Fn } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";

export default function Effects() {
  const { scene, camera, gl } = useThree();

  const renderPipeline = useMemo(() => {
    const scenePass = pass(scene, camera);
    const sceneColor = scenePass.getTextureNode("output");

    const bloomPass = bloom(sceneColor, 0.4, 0.7, 0.67);
    let composite = sceneColor.add(bloomPass);

    const vignette = Fn(() => {
      const dist = uv().sub(0.5).length();
      return float(1.0).sub(dist.mul(1.35)).clamp(0.55, 1.0);
    });
    composite = composite.mul(vignette());

    const pipeline = new THREE.RenderPipeline(gl);
    pipeline.outputNode = composite;

    return pipeline;
  }, [scene, camera, gl]);

  useFrame(() => {
    renderPipeline.render();
  }, 1);

  return (
    <directionalLight
      shadow-mapSize={1024}
      shadow-bias={-0.001}
      shadow-normalBias={0.03}
      castShadow
      position={[-25, 1, 30]}
      intensity={6}
    />
  );
}
