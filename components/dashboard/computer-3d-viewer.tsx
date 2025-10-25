"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment, PresentationControls, Grid, Stats } from "@react-three/drei"
import { Group, AxesHelper } from "three"

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
  const [scale, setScale] = useState(0.1)
  const [cameraX, setCameraX] = useState(-20)
  const [cameraY, setCameraY] = useState(0)
  const [cameraZ, setCameraZ] = useState(0)
  const [cameraFOV, setCameraFOV] = useState(120)
  const [modelX, setModelX] = useState(-3.5)
  const [modelY, setModelY] = useState(-4.7)
  const [modelZ, setModelZ] = useState(-5.0)

  // Preset positions cho các góc nhìn phổ biến
  const presetPositions = {
    front: { camera: [0, 0, 30], model: [0, -0.5, 0], fov: 70 },
    back: { camera: [0, 0, -30], model: [0, -0.5, 0], fov: 70 },
    left: { camera: [-30, 0, 0], model: [0, -0.5, 0], fov: 70 },
    right: { camera: [30, 0, 0], model: [0, -0.5, 0], fov: 70 },
    top: { camera: [0, 30, 0], model: [0, -0.5, 0], fov: 70 },
    diagonal: { camera: [20, 15, 20], model: [0, -0.5, 0], fov: 75 },
    far: { camera: [0, 0, 50], model: [0, -0.5, 0], fov: 80 },
    veryFar: { camera: [0, 0, 80], model: [0, -0.5, 0], fov: 90 },
    wide: { camera: [40, 25, 40], model: [0, -0.5, 0], fov: 100 },
    overview: { camera: [0, 50, 0], model: [0, -0.5, 0], fov: 120 }
  }

  const applyPreset = (preset: keyof typeof presetPositions) => {
    const { camera, model, fov } = presetPositions[preset]
    setCameraX(camera[0])
    setCameraY(camera[1])
    setCameraZ(camera[2])
    setCameraFOV(fov)
    setModelX(model[0])
    setModelY(model[1])
    setModelZ(model[2])
  }

  return (
    <div className="h-96 w-full overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 relative">
      {/* Debug controls */}
      <div className="absolute top-4 left-4 z-10 bg-black/80 text-white p-4 rounded-lg space-y-2">
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="px-3 py-1 bg-blue-600 rounded text-sm"
        >
          {showDebug ? 'Hide' : 'Show'} Debug
        </button>
        
        {showDebug && (
          <div className="space-y-2 text-xs max-h-96 overflow-y-auto">
            {/* Preset buttons */}
            <div className="space-y-1">
              <label className="font-bold">Preset Views:</label>
              <div className="grid grid-cols-2 gap-1">
                <button onClick={() => applyPreset('front')} className="px-2 py-1 bg-green-600 rounded text-xs">Front</button>
                <button onClick={() => applyPreset('back')} className="px-2 py-1 bg-green-600 rounded text-xs">Back</button>
                <button onClick={() => applyPreset('left')} className="px-2 py-1 bg-green-600 rounded text-xs">Left</button>
                <button onClick={() => applyPreset('right')} className="px-2 py-1 bg-green-600 rounded text-xs">Right</button>
                <button onClick={() => applyPreset('top')} className="px-2 py-1 bg-green-600 rounded text-xs">Top</button>
                <button onClick={() => applyPreset('diagonal')} className="px-2 py-1 bg-green-600 rounded text-xs">Diagonal</button>
                <button onClick={() => applyPreset('far')} className="px-2 py-1 bg-blue-600 rounded text-xs">Far</button>
                <button onClick={() => applyPreset('veryFar')} className="px-2 py-1 bg-blue-600 rounded text-xs">Very Far</button>
                <button onClick={() => applyPreset('wide')} className="px-2 py-1 bg-blue-600 rounded text-xs">Wide</button>
                <button onClick={() => applyPreset('overview')} className="px-2 py-1 bg-purple-600 rounded text-xs">Overview</button>
              </div>
            </div>

            {/* Model controls */}
            <div className="space-y-1">
              <label className="font-bold">Model Position:</label>
              <div>
                <label>Model X: {modelX}</label>
                <input 
                  type="range" 
                  min="-5" 
                  max="5" 
                  step="0.1" 
                  value={modelX} 
                  onChange={(e) => setModelX(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label>Model Y: {modelY}</label>
                <input 
                  type="range" 
                  min="-5" 
                  max="5" 
                  step="0.1" 
                  value={modelY} 
                  onChange={(e) => setModelY(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label>Model Z: {modelZ}</label>
                <input 
                  type="range" 
                  min="-5" 
                  max="5" 
                  step="0.1" 
                  value={modelZ} 
                  onChange={(e) => setModelZ(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Scale control */}
            <div>
              <label>Scale: {scale}</label>
              <input 
                type="range" 
                min="0.05" 
                max="1" 
                step="0.05" 
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Camera controls */}
            <div className="space-y-1">
              <label className="font-bold">Camera Position:</label>
              <div>
                <label>Camera X: {cameraX}</label>
                <input 
                  type="range" 
                  min="-20" 
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
                  max="50" 
                  step="1" 
                  value={cameraZ} 
                  onChange={(e) => setCameraZ(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label>FOV (Field of View): {cameraFOV}°</label>
                <input 
                  type="range" 
                  min="20" 
                  max="120" 
                  step="5" 
                  value={cameraFOV} 
                  onChange={(e) => setCameraFOV(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Current values display */}
            <div className="bg-gray-800 p-2 rounded text-xs">
              <div className="font-bold mb-1">Current Values:</div>
              <div>Model: ({modelX.toFixed(1)}, {modelY.toFixed(1)}, {modelZ.toFixed(1)})</div>
              <div>Camera: ({cameraX.toFixed(1)}, {cameraY.toFixed(1)}, {cameraZ.toFixed(1)})</div>
              <div>FOV: {cameraFOV}°</div>
              <div>Scale: {scale.toFixed(1)}x</div>
            </div>
          </div>
        )}
      </div>

      <Canvas
        camera={{ position: [cameraX, cameraY, cameraZ], fov: cameraFOV }}
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
            <ComputerModel scale={scale} position={[modelX, modelY, modelZ]} />
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
