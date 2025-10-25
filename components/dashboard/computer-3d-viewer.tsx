"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment, PresentationControls, Grid, Stats } from "@react-three/drei"
import { Group, AxesHelper } from "three"

// Component để load và hiển thị model 3D
function ComputerModel({ scale }: { scale: number }) {
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
      <primitive object={scene} scale={[scale, scale, scale]} position={[0, -0.5, 0]} />
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


// Debug components
function DebugHelpers() {
  return (
    <>
      {/* Grid để thấy mặt phẳng */}
      <Grid 
        position={[0, -2, 0]} 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor="#6f6f6f" 
        sectionSize={3} 
        sectionThickness={1} 
        sectionColor="#9d4edd" 
        fadeDistance={30} 
        fadeStrength={1} 
        followCamera={false} 
      />
      
      {/* Axes helper để thấy trục X, Y, Z */}
      <axesHelper args={[2]} />
      
      {/* Stats để xem FPS và performance */}
      <Stats />
    </>
  )
}

// Component Canvas wrapper
function CanvasWrapper() {
  const [showDebug, setShowDebug] = useState(false)
  const [scale, setScale] = useState(0.3)
  const [cameraX, setCameraX] = useState(8)
  const [cameraY, setCameraY] = useState(5)
  const [cameraZ, setCameraZ] = useState(12)

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 relative">
      {/* Debug controls */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 text-white p-4 rounded-lg space-y-2">
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="px-3 py-1 bg-blue-600 rounded text-sm"
        >
          {showDebug ? 'Hide' : 'Show'} Debug
        </button>
        
        {showDebug && (
          <div className="space-y-2 text-xs">
            <div>
              <label>Scale: {scale}</label>
              <input 
                type="range" 
                min="0.1" 
                max="2" 
                step="0.1" 
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label>Camera X: {cameraX}</label>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="1" 
                value={cameraX} 
                onChange={(e) => setCameraX(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label>Camera Y: {cameraY}</label>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="1" 
                value={cameraY} 
                onChange={(e) => setCameraY(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label>Camera Z: {cameraZ}</label>
              <input 
                type="range" 
                min="0" 
                max="30" 
                step="1" 
                value={cameraZ} 
                onChange={(e) => setCameraZ(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <Canvas
        camera={{ position: [cameraX, cameraY, cameraZ], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          {/* Debug helpers */}
          {showDebug && <DebugHelpers />}
          
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
            <ComputerModel scale={scale} />
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
  )
}

// Main 3D Viewer component
export function Computer3DViewer() {
  return <CanvasWrapper />
}
