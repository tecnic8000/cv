import "./style/style1.css"
import { Button } from './components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/Addons.js";

function ThreeJS(){
  const scene1 = new THREE.Scene();
  const light1 = new THREE.HemisphereLight(0xffffff, 0x080820, 7);
  const camera1 = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100)
  const render1 = new THREE.WebGLRenderer({antialias: true});
  
  render1.setSize(window.innerWidth, window.innerHeight)
  render1.setClearColor(0x001d9e);
  render1.setPixelRatio(1.0);
  scene1.add(light1);
  camera1.position.set(5,12,10);

  const loader1 = new GLTFLoader().setPath("assets/");
  loader1.load("web1.glb", (gltf) => {
    const mesh1 = gltf.scene
    scene1.add(mesh1)
    
    const mixer1 = new THREE.AnimationMixer(mesh1);
    // gltf.animations.
  })
  return render1
}

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

      <canvas id="c"></canvas>
      
      {/* <div className="contact1">{data?.contact}</div> */}
      {/* <Button>CLICK ME</Button>
      <Checkbox/> */}
    </>
  )
}
export default App
