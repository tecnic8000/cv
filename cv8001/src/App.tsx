import "./style/style1.css"
import { Button } from './components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "motion/react"
import { useEffect, useState, useRef } from "react";
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';


interface Language {
  vn: string,
  en: string,
  fr: string,
  jp: string,
}
interface Profile {
  about: Language,
  skill: Language,
  experience: Language,
  project: Language;
}
interface CVData {
  contact: string,
  certificate: string,
  education: string,
  dev: Profile,
  art: Profile, 
}

// function Scene() {
//   const gltf = useLoader(GLTFLoader, './public/asset.gltf')
//   return <primitive object={gltf.scene} />
// }

function Model({ url }: { url: string }) {
  const { scene, animations } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)

  // Set up animation mixer
  if (animations.length > 0 && !mixerRef.current) {
    mixerRef.current = new THREE.AnimationMixer(scene)
    animations.forEach((clip) => {
      const action = mixerRef.current!.clipAction(clip)
      action.setLoop(THREE.LoopRepeat, Infinity) // Loop infinitely
      action.play()
    })
  }

  // Update animation mixer on each frame
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
  })

  return <primitive ref={modelRef} object={scene} />
}

function GLBAnimation({ 
  modelUrl, 
  width = 400, 
  height = 400 
}: { 
  modelUrl: string
  width?: number
  height?: number
}) {
  return (
    
    <div style={{ width, height }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Model url={modelUrl} />
        
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

function App() {

  const LOCAL_URL:string = "http://localhost:8011/cv"
  const REAL_URL = "https://"
  const [data, setData]= useState< CVData| null >(null)
 
  useEffect(()=>{
    async function getCV() {
      const res = await fetch(LOCAL_URL)
      if (!res.ok) throw Error("ERR--API FAILED--001")
      const data  = await res.json();
      setData(data)
    }
    getCV();
  },[])
  // console.log(data)
  return (
    <>
      <div className='bg-blue-700'>cv8001</div>
      <br/>
      {/* <Scene /> */}
      {/* <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} /> */}
      {/* <canvas id="c"></canvas> */}
      <GLBAnimation 
        modelUrl="./public/asset.gltf"
        width={500}
        height={500}
      />
      {/* <div className="contact1">{data?.contact}</div>
      {/* <Button>CLICK ME</Button>
      <Checkbox/> */}
    </>
  )
}
export default App
