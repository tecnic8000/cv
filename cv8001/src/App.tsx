import "./style/style1.css"
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter

} from "@/components/ui/card"
import { motion } from "motion/react"
import { useEffect, useState, useRef } from "react";
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Car } from "lucide-react";
import { string } from "three/tsl";


interface Description {
  titleDesc: string,
  vn: string,
  en: string,
  fr: string,
  jp: string,
}
interface Profile {
  about: Description,
  skill: string[],
  experience: Description,
  project: Description;
}
interface contactDetail {
  titleContact: string,
  name: string[],
  address: string[],
  link: string[],
}
interface CVData {
  contact: contactDetail,
  certificate: string[],
  education: string[],
  interest: Description,
  dev: Profile,
  art: Profile, 
}
interface DisplayCV {
  contact: {
    name: string;
    address: string;
    link: string[];
  }
  certificate: string[],
  education: string[],
  interest: any,
  dev: any
  art: {
    about: string,
    skill: string[],
    experience: Description,
    project: Description,
  }
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
  const [cv, setCv]= useState< CVData| null >(null)
  const [langMode, setLangMode] = useState<"vn" | "en" | "fr" | "jp">("vn");
  let displayCV: DisplayCV;
  useEffect(()=>{
    async function getCV() {
      const res = await fetch(LOCAL_URL)
      if (!res.ok) throw Error("ERR--API FAILED--001")
      const cv  = await res.json();
      setCv(cv)
    }
    getCV();

  },[])

  console.log(cv)
  // CV PROCESSING
  if (!cv) return <div>Loading...</div>
  
  switch (langMode) {
    case "vn": 
      displayCV = {
        contact: {
          name: cv.contact.name[0],
          address: cv.contact.address[0],
          link: cv.contact.link,
        },
        certificate: [cv.certificate[0].split("|")[0], ...cv.certificate.slice(1)],
        education: [cv.education[0].split("|")[0],...cv.education.slice(1)],
        interest: cv.interest,
        dev: cv.dev,
        art: {
          about: cv.art.about.vn,
          skill: cv.dev.skill,
          experience:cv.dev.experience,
          project:cv.dev.project,
        }

      }
      displayCV.interest.titleDesc = displayCV.interest.titleDesc.split("|")[0]
      displayCV.dev.about.titleDesc = displayCV.dev.about.titleDesc.split("|")[0]
      displayCV.dev.skill[0] = displayCV.dev.skill[0].split("|")[0]
      displayCV.dev.experience.titleDesc = displayCV.dev.experience.titleDesc.split("|")[0]
      displayCV.dev.project.titleDesc = displayCV.dev.project.titleDesc.split("|")[0]

      break;
    case "en": return "ENG"
    case "fr": return "FRA"
    case "jp": return "JPA"
  }
  
  console.log(displayCV)
  return (
    <>
      <div className='bg-blue-700'>{displayCV.contact.name}</div>
      <br/>
      
      {/* <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} /> */}
      {/* <GLBAnimation modelUrl="/web1.glb" /> */}
      {/* <div className="contact1">{data?.contact}</div> */}

      <Card className="w-[300px] h-[400px]">
        <CardHeader>
          {displayCV.dev.about.titleDesc}
        </CardHeader>
        <CardContent>
          {displayCV.dev.about[langMode]}
        </CardContent>
      </Card>
      <Card className="w-[300px] h-[300px] bg-orange-400">
        <CardHeader>{displayCV.dev.skill[0]}</CardHeader>
        <CardContent bg-blue-200>{displayCV.dev.skill[1]}</CardContent>
      </Card>
      <Card className="w-[300px] h-[300px]">
        <CardHeader>{displayCV.dev.experience.titleDesc}</CardHeader>
        <CardContent>{displayCV.dev.experience[langMode]}</CardContent>
      </Card>
      <Card className="w-[300px] h-[500px]">
        <CardHeader>{displayCV.dev.project.titleDesc}</CardHeader>
        <CardContent>{displayCV.dev.project[langMode]}</CardContent>
      </Card>

      <Card className="w-[300px] h-[300px]">
        <CardHeader>
          <CardTitle>{displayCV.contact.name}</CardTitle>
          <CardDescription>{displayCV.contact.address}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{displayCV.contact.link}</p>
        </CardContent>
        <CardFooter>
          <Button>Action</Button>
        </CardFooter>
      </Card>

      <Card className="w-[300px] h-[200px]">
        <CardHeader>
          <CardTitle>{displayCV.certificate[0]}</CardTitle>
        </CardHeader>
        <CardContent>
          {displayCV.certificate.slice(1).map((item, index) => (<CardDescription key={index+1}>{item}</CardDescription>))}
        </CardContent>
      </Card>

      <Card className="w-[300px] h-[200px]">
        <CardHeader>
          <CardTitle>{displayCV.education[0]}</CardTitle>
        </CardHeader>
        <CardContent>
          {displayCV.education[1].split("_")[0]}<br/>
          {displayCV.education[1].split("_")[1]}<br/>
          {displayCV.education[1].split("_")[2]}<br/>
        </CardContent>
      </Card>

      <Card className="w-[300px] h-[200px]">
        <CardHeader>
          <CardTitle>{displayCV.interest.titleDesc}</CardTitle>
        </CardHeader> 
        <CardContent>
          {displayCV.interest[langMode]}
        </CardContent>
      </Card>

    </>
  )
}
export default App
