import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Effects from './Effects'
import { Predator } from './Predator'

export const App = ({ position = [0, 1.3, 0.9], fov = 35 }) => (
  <Canvas shadows gl={{ toneMappingExposure: 0.7 }} dpr={1} camera={{ position, fov }} eventSource={document.getElementById('root')} eventPrefix="client">
    <Suspense fallback={null}>
      <Predator rotation={[0, 0.9, 0]} scale={0.7} position={[0, 0.05, 0]} />
      <Effects />
    </Suspense>
    <OrbitControls minDistance={0.5} maxDistance={4} target={[-0.05, 1.35, 0]} maxPolarAngle={Math.PI / 1.8} />
  </Canvas>
)
