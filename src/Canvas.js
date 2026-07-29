import { Suspense, useRef } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three/webgpu";
import Effects from "./Effects";
import { Predator } from "./Predator";
import { setupGlassInspector } from "./setupGlassInspector";
import { inspectorSettings } from "./inspectorSettings";

const HDR_URL = "/hdri/rainforest_trail_2k.hdr";
const orbitDragging = { current: false };

function CameraSway({ azimuth = 0.45, polar = 0.22, damp = 0.3 }) {
  const controls = useThree((state) => state.controls);
  const sway = useRef(new THREE.Vector2());
  const applied = useRef(new THREE.Vector2());
  const spherical = useRef(new THREE.Spherical());
  const offset = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!controls) return;

    const target = orbitDragging.current ? 0 : 1;
    easing.damp2(
      sway.current,
      [state.pointer.x * target, -state.pointer.y * target],
      damp,
      delta
    );

    offset.current.copy(state.camera.position).sub(controls.target);
    spherical.current.setFromVector3(offset.current);

    spherical.current.theta -= applied.current.x * azimuth;
    spherical.current.phi -= applied.current.y * polar;

    spherical.current.theta += sway.current.x * azimuth;
    spherical.current.phi += sway.current.y * polar;
    spherical.current.phi = Math.max(
      controls.minPolarAngle,
      Math.min(controls.maxPolarAngle, spherical.current.phi)
    );
    spherical.current.makeSafe();

    applied.current.copy(sway.current);

    offset.current.setFromSpherical(spherical.current);
    state.camera.position.copy(controls.target).add(offset.current);
    state.camera.lookAt(controls.target);
  });

  return null;
}

export const App = ({ position = [0.3, 1.3, 0.9], fov = 35 }) => (
  <Canvas
    shadows
    dpr={1.5}
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
        backgroundIntensity={0.3}
        environmentIntensity={0.95}
        backgroundRotation={[0, -0.3, 0]}
      />
      <Predator rotation={[0, 0.9, 0]} scale={0.7} position={[0, 0.05, 0]} />
      <Effects />
    </Suspense>
    <OrbitControls
      makeDefault
      minDistance={0.5}
      maxDistance={4}
      target={[-0.05, 1.35, 0]}
      maxPolarAngle={Math.PI / 1.5}
      minPolarAngle={Math.PI / 2.0}
      onStart={() => {
        orbitDragging.current = true;
      }}
      onEnd={() => {
        orbitDragging.current = false;
      }}
    />
    <CameraSway />
  </Canvas>
);
