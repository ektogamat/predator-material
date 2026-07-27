import { Suspense } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three/webgpu";
import Effects from "./Effects";
import { Predator } from "./Predator";
import { setupGlassInspector } from "./setupGlassInspector";
import { inspectorSettings } from "./inspectorSettings";

const HDR_URL = "/hdri/rainforest_trail_2k.hdr";

export const App = ({ position = [0, 1.3, 0.9], fov = 35 }) => (
  <Canvas
    shadows
    dpr={1}
    camera={{ position, fov }}
    eventSource={document.getElementById("root")}
    eventPrefix="client"
    gl={async (props) => {
      extend(THREE);
      const renderer = new THREE.WebGPURenderer(props);
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.toneMappingExposure = 0.7;
      renderer.alpha = false;

      if (import.meta.env.DEV) {
        const { Inspector } =
          await import("three/addons/inspector/Inspector.js");
        renderer.inspector = new Inspector();
      }

      await renderer.init();

      if (import.meta.env.DEV) {
        globalThis.__inspector = renderer.inspector;
        setupGlassInspector(renderer.inspector);
        inspectorSettings.attach(renderer.inspector);
      }

      return renderer;
    }}
  >
    <Suspense fallback={null}>
      <Environment
        background
        files={HDR_URL}
        backgroundBlurriness={0.03}
        backgroundIntensity={0.4}
        resolution={2048}
        environmentIntensity={0.95}
        backgroundRotation={[0, -0.3, 0]}
      />
      <Predator rotation={[0, 0.9, 0]} scale={0.7} position={[0, 0.05, 0]} />
      <Effects />
    </Suspense>
    <OrbitControls
      minDistance={0.5}
      maxDistance={4}
      target={[-0.05, 1.35, 0]}
      maxPolarAngle={Math.PI / 1.8}
    />
  </Canvas>
);
