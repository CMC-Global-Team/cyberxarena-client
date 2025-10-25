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

  // Animation xoay nhẹ model (chỉ khi không tương tác)
  useFrame((state) => {
    if (groupRef.current) {
      // Giảm animation để không can thiệp vào tương tác
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[3.5, 3.5, 3.5]} position={[0, -0.5, 0]} />
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
        <div className="h-80 w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
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
                rotation={[0.1, 0.1, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                snap
              >
                <ComputerModel />
              </PresentationControls>
              
              {/* Thêm OrbitControls để dễ tương tác hơn */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                zoomSpeed={0.6}
                rotateSpeed={0.5}
                panSpeed={0.8}
                minDistance={3}
                maxDistance={15}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI - Math.PI / 6}
              />
              
              <Environment preset="sunset" />
            </Suspense>
          </Canvas>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            🖱️ Kéo chuột trái để xoay • 🖱️ Cuộn chuột để zoom • 🖱️ Kéo chuột phải để di chuyển
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Hoặc sử dụng touch gestures trên mobile
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
