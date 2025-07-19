import "./style/style1.css";
import { config } from "./config"
import { BrowserRouter, Routes, Route, useParams} from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";

interface Description {
  titleDesc: string;
  vn: string;
  en: string;
  fr: string;
  jp: string;
}
interface Profile {
  about: Description;
  skill: string[];
  experience: Description;
  project: Description;
}
interface contactDetail {
  TitleContact: string;
  name: string[];
  address: string[];
  link: string[];
}
interface CVData {
  contact: contactDetail;
  certificate: string[];
  education: string[];
  interest: Description;
  dev: Profile;
  art: Profile;
}

function Model({ url }: { url: string }) {
  const { scene, animations } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  // Set up animation mixer
  if (animations.length > 0 && !mixerRef.current) {
    mixerRef.current = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => {
      const action = mixerRef.current!.clipAction(clip);
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.play();
    });
  }

  // Update animation mixer on each frame
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
      state.get() // dummy to turn off warning
    }
  });
  return <primitive ref={modelRef} object={scene} />;
}

function GLBAnimation({
  modelUrl,
  width = 400,
  height = 400,
}: {
  modelUrl: string;
  width?: number;
  height?: number;
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
  );
}

function CVdisplay({URL}:{URL:string}){
  const [cv, setCv] = useState<CVData | null>(null);
  const [langMode, setLangMode] = useState<"vn" | "en" | "fr" | "jp">("vn");
  const [jobMode, setJobMode] = useState <"dev" | "art" >("dev");
  const [titleIndex, setTitleIndex] = useState<number>(0);
  const { langParam } = useParams();
  
  useEffect(()=>{
    switch (langParam){
      case "en": setLangMode("en"); break; 
      case "fr": setLangMode("fr"); break;
      case "jp": setLangMode("jp"); break;
    }    
    switch (langMode){
      case "en": setTitleIndex(1); break;
      case "fr": setTitleIndex(2); break;
      case "jp": setTitleIndex(3); break;
    }
  },[langMode, langParam])
  useEffect(() => {
    async function getCV() {
      const res = await fetch(URL);
      if (!res.ok) throw Error("ERR--API FAILED--001");
      const cv = await res.json();
      setCv(cv);
      console.log(cv);
    }
    setJobMode("dev")
    getCV();
  }, [URL]);
  console.log(langMode, langParam, titleIndex);
  if (!cv) return <div>LOADING...</div>
  const expArr:string[] = Array
    .from(cv[jobMode].experience[langMode]
    .matchAll(/(__[^_]+(?:_[^_]+)*__[\s\S]*?)(?=__[^_]+(?:_[^_]+)*__|$)/g))
    .map(m => m[1].trim())
  const skillArr:string[] = Array
    .from(cv[jobMode].skill[1]
    .matchAll(/(__[^_]+(?:_[^_]+)*__[\s\S]*?)(?=__[^_]+(?:_[^_]+)*__|$)/g))
    .map(m => m[1].trim())

 if (langParam == "2") {
return (
  <>
    <div className="bg-blue-500 p-4 flex justify-center">
      <Card className="w-[90vw] ">
        <CardHeader>
          {cv.contact.name[titleIndex]}
          <CardDescription>{cv.contact.address[titleIndex]}</CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>{cv[jobMode].about[langMode]}</CardDescription>
          <br />
          <CardTitle>
            {cv[jobMode].experience.titleDesc.split("|")[titleIndex]}
          </CardTitle>
          <br />
          {expArr.map((item, index) => (
            <CardContent key={index}>
              <CardTitle>
                {item
                  .split("__")
                  .filter(Boolean)[0]
                  .split("_")
                  .map((n, i) => (
                    <p key={i}>{n}</p>
                  ))}
              </CardTitle>
              <CardDescription>
                {item
                  .split("__")
                  .filter(Boolean)[1]
                  .split("\n")
                  .filter(Boolean)
                  .map((n, i) => (
                    <p key={i}>- {n}</p>
                  ))}
              </CardDescription>
            </CardContent>
          ))}
          <br />
          <CardTitle>{cv[jobMode].skill[0].split("|")[titleIndex]}</CardTitle>
          <br />
          {skillArr.map((item, index) => (
            <CardContent key={index}>
              <CardTitle>
                {item
                  .split("__")
                  .filter(Boolean)[0]
                  .split("_")
                  .map((n, i) => (
                    <p key={i}>{n}</p>
                  ))}
              </CardTitle>
              <CardDescription>
                {item
                  .split("__")
                  .filter(Boolean)[1]
                  .split("\n")
                  .filter(Boolean)
                  .map((n, i) => (
                    <p key={i}>- {n}</p>
                  ))}
              </CardDescription>
            </CardContent>
          ))}
          <br />
          <CardTitle>{cv.certificate[0].split("|")[titleIndex]}</CardTitle>
          <br />
          {cv.certificate.slice(1).map((item, index) => (
            <CardDescription key={index + 1}>{item}</CardDescription>
          ))}
          <br/>

          <CardTitle>{cv.education[0].split("|")[titleIndex]}</CardTitle><br/>
          <CardDescription>{cv.education[1].replace(/_/g, " ")}</CardDescription>
        </CardContent>
        <br />
      </Card>
    </div>
  </>
);

 } else
   return (
     <>
       {/* <div className="bg-orange-500 fixed top-0 w-full z-90">CONTACT</div> */}
       {/* <br /> */}
       <div className="p-4 flex bg-blue-500 justify-center">
         {/* <div className="bg-blue-00 grid grid-cols-1 md:grid-cols-2 gap-4"> */}
         <div className="bg-blue-500 grid grid-cols-1 md:grid-cols-2 gap-5 [grid-auto-flow:dense]">
           {/* <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} /> */}
           {/* <GLBAnimation modelUrl="/web1.glb" /> */}
           {/* <div className="contact1">{data?.contact}</div> */}

           <Card className="w-[300px] h-[400px]">
             <CardContent></CardContent>
             <CardHeader className="">
               <Avatar>
                 <AvatarImage
                   src="https://github.com/shadcn.png"
                   alt="@shadcn"
                 />
                 <AvatarFallback>CVAvatar</AvatarFallback>
               </Avatar>
               {cv.contact.name[titleIndex]}
             </CardHeader>
             <CardContent>
               <CardHeader>
                 {cv[jobMode].about.titleDesc.split("|")[titleIndex]}
               </CardHeader>
               <CardDescription>{cv[jobMode].about[langMode]}</CardDescription>
             </CardContent>
           </Card>

           <Card className="w-[300px] ">
             <CardHeader>
               {cv[jobMode].experience.titleDesc.split("|")[titleIndex]}
             </CardHeader>
             {expArr.map((item, index) => (
               <CardContent key={index}>
                 <CardTitle>
                   {item
                     .split("__")
                     .filter(Boolean)[0]
                     .split("_")
                     .map((n, i) => (
                       <p key={i}>{n}</p>
                     ))}
                 </CardTitle>
                 <CardDescription>
                   {item
                     .split("__")
                     .filter(Boolean)[1]
                     .split("\n")
                     .filter(Boolean)
                     .map((n, i) => (
                       <p key={i}>- {n}</p>
                     ))}
                 </CardDescription>
               </CardContent>
             ))}
           </Card>

           <Card className="w-[300px] md:relative md:-mt-100">
             <CardHeader>
               {cv[jobMode].skill[0].split("|")[titleIndex]}
             </CardHeader>
             {skillArr.map((item, index) => (
               <CardContent key={index}>
                 <CardTitle>{item.split("__").filter(Boolean)[0]}</CardTitle>
                 <CardDescription>
                   {item
                     .split("__")
                     .filter(Boolean)[1]
                     .split("\n")
                     .filter(Boolean)
                     .map((n, i) => (
                       <p key={i}>- {n}</p>
                     ))}
                 </CardDescription>
               </CardContent>
             ))}
           </Card>

           <Card className="w-[300px] h-[240px]">
             <CardHeader>
               <CardTitle>{cv.certificate[0].split("|")[titleIndex]}</CardTitle>
               {cv.certificate.slice(1).map((item, index) => (
                 <CardDescription key={index + 1}>{item}</CardDescription>
               ))}

               <CardTitle className="mt-3">
                 {cv.education[0].split("|")[titleIndex]}
               </CardTitle>
               <CardDescription>
                 {cv.education[1].split("_")[1]} &nbsp;
                 {cv.education[1].split("_")[2]}
                 <br />
                 {cv.education[1].split("_")[0]}
                 <br />
               </CardDescription>
             </CardHeader>
           </Card>

           <Card className="w-[300px]">
             <CardHeader>
               <CardTitle>
                 {cv.contact.TitleContact.split("|")[titleIndex]}
                 <br />
                 <br />
                 {cv.contact.name[titleIndex]}
               </CardTitle>
               <CardDescription>
                 {cv.contact.address[titleIndex]}
               </CardDescription>
             </CardHeader>
             <div className="bg-amber-00 grid-cols-2 space-y-4 ml-10 -mt-3">
               <div className="space-x-4">
                 <Button className="w-20"> &#9993; MAIL </Button>
                 <Button className="w-20"> &#128222; CALL </Button>
               </div>
               {jobMode == "dev" ? (
                 <div className="space-x-4">
                   <Button className="w-20">GITHUB</Button>
                   <Button className="w-20">LINKEDIN</Button>
                 </div>
               ) : (
                 <>
                   <Button className="w-20">ARTSTATION</Button>
                   <Button className="w-20">BEHANCE</Button>
                 </>
               )}
             </div>
           </Card>

           <Card className="w-[300px] h-[500px] hidden">
             <CardHeader>
               {cv[jobMode].project.titleDesc.split("|")[titleIndex]}
             </CardHeader>
             <CardContent>{cv[jobMode].project[langMode]}</CardContent>
           </Card>

           <Card className="w-[300px] h-[200px] hidden">
             <CardHeader>
               <CardTitle>
                 {cv.interest.titleDesc.split("|")[titleIndex]}
               </CardTitle>
             </CardHeader>
             <CardContent>{cv.interest[langMode]}</CardContent>
           </Card>
         </div>

         <Card className="w-[300px] hidden">
           <CardHeader>
             <CardTitle>{cv.contact.name[titleIndex]}</CardTitle>
             <CardDescription>{cv.contact.address[titleIndex]}</CardDescription>
           </CardHeader>
           <CardContent>
             <p>{cv.contact.link}</p>
           </CardContent>
           <CardFooter>
             <Button>Action</Button>
           </CardFooter>
         </Card>
       </div>

       <div className="hidden">
         <GLBAnimation modelUrl="web1.glb"></GLBAnimation>
       </div>
     </>
   );
}

function App() {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:langParam" element={<CVdisplay URL={config.cvURL} /> }/>
        <Route path="/" element={<CVdisplay URL={config.cvURL} /> }/>
        <Route path="/:langParam" element={<CVdisplay URL={config.cvURL} /> }/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
