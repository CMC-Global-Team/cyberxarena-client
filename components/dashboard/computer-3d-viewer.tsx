"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment, PresentationControls } from "@react-three/drei"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Group, Mesh } from "three"

// Component để load và hiển thị model 3D
function ComputerModel() {
  const { scene } = useGLTF("/Computer.glb")
  const groupRef = useRef<Group>(null)

  // Animation xoay nhẹ model
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[2, 2, 2]} position={[0, -1, 0]} />
    </group>
  )

  // Preload model
  useGLTF.preload("/Computer.glb")
}

// Loading component
function ModelLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

// Main 3D Viewer component
export function Computer3DViewer() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Máy tính 3D</CardTitle>
        <CardDescription>Xem mô hình máy tính trong không gian 3D</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />
              
              <PresentationControls
                global
                rotation={[0.13, 0.1, 0]}
                polar={[-0.4, 0.2]}
                azimuth={[-1, 0.75]}
                config={{ mass: 2, tension: 400 }}
                snap={{ mass: 4, tension: 400 }}
              >
                <ComputerModel />
              </PresentationControls>
              
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Kéo để xoay • Cuộn để zoom • Giữ chuột giữa để di chuyển
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
