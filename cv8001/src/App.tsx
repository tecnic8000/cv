import "./style/style1.css"
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { motion } from "motion/react"
import { useEffect, useState, useRef } from "react";
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Car } from "lucide-react";


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
function Model({ url }: { url: string }) {
  const { scene, animations } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)

  // Set up animation mixer
  if (animations.length > 0 && !mixerRef.current) {
    mixerRef.current = new THREE.AnimationMixer(scene)
    animations.forEach((clip) => {
      const action = mixerRef.current!.clipAction(clip)
      action.setLoop(THREE.LoopRepeat, Infinity)
      action.play()
    })
  }

  // Update animation mixer on each frame
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)
    }
  })

  // OPTIONAL: Force a basic material for testing
  // scene.traverse((child: any) => {
  //   if (child.isMesh) {
  //     child.material = new THREE.MeshStandardMaterial({ color: 'orange' })
  //   }
  // })

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
      
      {/* <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} /> */}
      {/* <GLBAnimation modelUrl="/web1.glb" /> */}
      {/* <div className="contact1">{data?.contact}</div> */}
      <Card className="w-[300px] h-[300px]">
        <h1 className="text-2xl font-bold">Card Title</h1>
        <p className="text-gray-600">This is a simple card component.</p>
      </Card>
      <Button>CLICK ME</Button>
      <Checkbox/> 
    </>
  )
}
export default App
