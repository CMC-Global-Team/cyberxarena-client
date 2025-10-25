"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment, PresentationControls } from "@react-three/drei"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

// Component để reset camera về vị trí ban đầu
function ResetCamera() {
  const { camera } = useThree()
  
  const resetCamera = () => {
    camera.position.set(5, 3, 8)
    camera.lookAt(0, 0, 0)
  }

  return (
    <Button
      onClick={resetCamera}
      size="sm"
      variant="outline"
      className="absolute top-2 right-2 z-10"
    >
      🔄 Reset View
    </Button>
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
        <div className="h-80 w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 relative">
          <ResetCamera />
          <Canvas
            camera={{ position: [5, 3, 8], fov: 45 }}
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
                minDistance={6}
                maxDistance={20}
                minPolarAngle={Math.PI / 8}
                maxPolarAngle={Math.PI - Math.PI / 8}
                target={[0, 0, 0]}
                enableDamping={true}
                dampingFactor={0.05}
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
            Hoặc sử dụng touch gestures trên mobile • Nhấn nút "Reset View" nếu bị kẹt
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
