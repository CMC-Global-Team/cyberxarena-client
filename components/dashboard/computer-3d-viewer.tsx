"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment, PresentationControls } from "@react-three/drei"
import { Group } from "three"

// Component để load và hiển thị model 3D
function ComputerModel({ scale, position }: { scale: number, position: [number, number, number] }) {
  const { scene } = useGLTF("/Computer.glb")
  const groupRef = useRef<Group>(null)

  // Animation xoay nhẹ model (chỉ khi không tương tác)
  useFrame((state) => {
    if (groupRef.current) {
      // Giảm animation để không can thiệp vào tương tác
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[scale, scale, scale]} position={position} />
    </group>
  )

  // Preload model
  useGLTF.preload("/Computer.glb")
}





// Component Canvas wrapper
function CanvasWrapper() {
  return (
    <div className="h-96 w-full overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <Canvas
        camera={{ position: [-5, 12, 25], fov: 120 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          {/* Cải thiện lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize={1024}
          />
          <directionalLight 
            position={[-10, 5, -5]} 
            intensity={0.8} 
          />
          <pointLight position={[0, 10, 0]} intensity={0.6} />
          <spotLight 
            position={[5, 5, 5]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1}
            castShadow
          />
          
          <PresentationControls
            global
            rotation={[0.1, 0.5, 0]}
            polar={[-Math.PI / 6, Math.PI / 6]}
            azimuth={[-Math.PI / 3, Math.PI / 3]}
            snap
          >
            <ComputerModel scale={0.1} position={[-3.5, -4.7, -5.0]} />
          </PresentationControls>
          
          {/* Thêm OrbitControls để dễ tương tác hơn */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.6}
            rotateSpeed={0.5}
            panSpeed={0.8}
            minDistance={12}
            maxDistance={40}
            minPolarAngle={Math.PI / 12}
            maxPolarAngle={Math.PI - Math.PI / 12}
            target={[0, 0, 0]}
            enableDamping={true}
            dampingFactor={0.05}
          />
          
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Main 3D Viewer component
export function Computer3DViewer() {
  return <CanvasWrapper />
}
