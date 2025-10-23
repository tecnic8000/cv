import "./style1.css";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom"
// import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { motion } from "motion/react";
import { useEffect, useState } from "react";
import cv2 from "./cv.json"
import CV1 from "./components/cv1";
// import * as THREE from "three";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useGLTF, OrbitControls, Environment } from "@react-three/drei";

// function Model({ url }: { url: string }) {
//   const { scene, animations } = useGLTF(url);
//   const modelRef = useRef<THREE.Group>(null);
//   const mixerRef = useRef<THREE.AnimationMixer | null>(null);

//   // Set up animation mixer
//   if (animations.length > 0 && !mixerRef.current) {
//     mixerRef.current = new THREE.AnimationMixer(scene);
//     animations.forEach((clip) => {
//       const action = mixerRef.current!.clipAction(clip);
//       action.setLoop(THREE.LoopRepeat, Infinity);
//       action.play();
//     });
//   }

//   // Update animation mixer on each frame
//   useFrame((state, delta) => {
//     if (mixerRef.current) {
//       mixerRef.current.update(delta);
//       state.get() // dummy to turn off warning
//     }
//   });
//   return <primitive ref={modelRef} object={scene} />;
// }

// function GLBAnimation({
//   modelUrl,
//   width = 400,
//   height = 400,
// }: {
//   modelUrl: string;
//   width?: number;
//   height?: number;
// }) {
//   return (
//     <div style={{ width, height }}>
//       <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />
//         <Model url={modelUrl} />
//         <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
//         <Environment preset="city" />
//       </Canvas>
//     </div>
//   );
// }

function CV2() {
  const [mode, setMode] = useState<"dev" | "art" | "wage">("dev")
  const [lang, setLang] = useState<"en" | "vn" | "fr" | "jp">("en")
  const [langIndex, setLangIndex] = useState<number>(0)
  const link = useLocation()

  useEffect(() => {
    switch (link.pathname.split("/").slice(1)[1]) {
      case "dev": setMode("dev"); break
      case "art": setMode("art"); break
      case "wage": setMode("wage"); break
      default: console.log("!-missing mode ")
    }
    switch (link.pathname.split("/").slice(1)[2]) {
      case "en": setLang("en"); setLangIndex(0); break
      case "vn": setLang("vn"); setLangIndex(1); break
      case "fr": setLang("fr"); setLangIndex(2); break
      case "jp": setLang("jp"); setLangIndex(3); break
      default: console.log("!-missing lang")
    }
  }, [link])

  console.log("/cv/[mode]/[lang] to access cv. currently: " + mode + lang)
  interface CV {
    contact: { [key: string]: string | string[] },
    interest: { [key: string]: string | string[] },
    education: { [key: string]: string | string[] }
    certificate: string[],
    job: {
      [key: string]: { //dev
        [key: string]: { //obj
          [key: string]: string | string[] // header, lang
        }
      }
    }
  }
  const cv: CV = cv2 as CV

  if (!cv2) return <div>LOADING JSON</div>

  return (<>
    <div className="flex items-center justify-center" >
      <Card className="bg-[url('./white.png')] m-4 p-2 max-w-2xl w-full">

        {/* PROFILE */}
        <div className="sm:flex ">
          <CardHeader className="bg-blue-300 w-full min-w-[300px] h-auto sm:text-md lg:text-lg m-1 border-r-2 rounded-l-md" >
            <div className="h-1 pt-2 text-xl">{cv.contact["name"][langIndex]}</div><br />
            {mode == "wage" && (
              <div className="text-sm ">
                {cv.contact["link"][0] + " " + cv.contact["link"][1]}
                <br /> {cv.contact["address"][langIndex].slice(10)}
              </div>)}
            {mode == "dev" && (
              <div className="text-sm pb-2"> Software Developer </div>)}
          </CardHeader>
          <div>
            <CardDescription className="bg-teal-000">
              {((item) => {
                switch (mode) {
                  case "dev": return (
                    <div>
                      <span className="text-lg">{item[0]}</span><br />
                      {item[1]}<br />
                    </div>);
                }
              })(cv.contact["link"])
              }

            </CardDescription>
            <CardDescription className="bg-pink-000">
              {mode == "dev" && cv.contact["address"][langIndex].slice(10)}
            </CardDescription>
          </div>
        </div>

        {/* <CardDescription className="">{cv.Job[jobMode].obj[langMode]}</CardDescription> */}

        {/* EXPERIENCE */}
        <div className="bg-blue-000">
          <CardFooter className="border-t border-l ml-2 rounded-tl-lg border-gray-950">
            {(cv.job[mode].exp["header"] as string).split("|")[langIndex]}
          </CardFooter>
          <CardDescription >
            {(cv.job[mode].exp[lang] as string).split("@").map((item, index) => (
              <div key={index}>{item.split("__").slice(1).map((detail, i) => {
                switch (i) {
                  case 0: return (
                    <div key={i} className="bg-blue-300 max-w-2xl px-3 py-1 mb-1 flex justify-between rounded-sm">
                      <span >
                        {detail.split("_")[0]}&nbsp;- {detail.split("_")[1]}
                      </span>
                      <span>
                        {detail.split("_")[2]}&nbsp;{detail.split("_")[3]}
                      </span>
                    </div>
                  )
                  case 1: return detail.split("-").slice(1).map((sub, i) => (<div key={i}>- {sub}</div>));
                  default: return null;
                }
              })}
              </div>
            ))}
          </CardDescription>
        </div>
        {/* <CardDescription>{cv.Job[jobMode].skill["__backend__"]}</CardDescription> */}

        {/* SKILL & PERSONA */}
        <div >
          <CardFooter className="border w-fit pt-1 mb-2 rounded-md">
            {(cv.job[mode].skill["header"] as string).split("|")[langIndex]}
          </CardFooter>
          <CardDescription >
            {
              (() => {
                switch (mode) {
                  case "dev": return (
                    <div>
                      &middot; {cv.job[mode].skill["Language"]}<br />
                      &middot; {cv.job[mode].skill["Frontend"]}<br />
                      &middot; {cv.job[mode].skill["Backend"]}<br />
                      &middot; {cv.job[mode].skill["Database"]}
                    </div>
                  )
                  case "art": return "empty.."
                  case "wage": return (
                    <>
                      {(cv.job[mode].skill[lang] as string).split("-").slice(1)
                        .map((item, index) => (<div key={index}>&middot;{item}</div>))
                      }
                    </>
                  )
                  default: return null
                }
              })
                ()}
            {/* PERSONA */}
            {mode === "wage" && (
              <CardFooter className="border w-fit py-1 my-2 rounded-md ">
                {(cv.job[mode].persona["header"] as string).split("|")[langIndex]}
              </CardFooter>
            )}
            {(cv.job[mode].persona[lang] as string[]).map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </CardDescription>
        </div>

        {/* PROJECT */}
        <div className="bg-blue-000">
          <CardFooter className="border-1 w-fit pt-1 mb-2 rounded-lg">
            {(cv.job[mode].proj["header"] as string).split("|")[langIndex]}
          </CardFooter>
          <CardDescription>
            {(cv.job[mode].proj[lang] as string[]).map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </CardDescription>
        </div>

        {/* CERTIFICATE */}
        {/* <div className="bg-green-300">
        <CardHeader>{cv.Certificate[0].split("|")[langIndex]}</CardHeader>
        <CardDescription>{cv.Certificate[1]}</CardDescription>
      </div> */}

        {/* EDUCATION */}
        <div className="">
          <CardFooter className="pt-0 border-t border-r rounded-tr-lg border-gray-900 w-fit">
            {(cv.education["header"] as string).split("|")[langIndex]}
          </CardFooter>
          <CardFooter>
            {(cv.education["header"] as string).split("@")[1].split("_")[0]}<br />
            {(cv.education["header"] as string).split("@")[1].split("_")[1]}&nbsp;
            {(cv.education["header"] as string).split("@")[1].split("_")[2]}
          </CardFooter>
          <CardDescription>
            {(cv.education[lang] as string[]).map((item, index) => {
              if (mode == "wage" && index === 1) return null;
              return (<div key={index}>{item}</div>)
            })}
          </CardDescription>
        </div>

        <div className="">
          <div className="bg-blue-400 w-[10px] h-[10px] flex float-end"></div>
        </div>
      </Card>
    </div>
  </>
  )
}
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cv/dev/vn" element={<CV2 />} />  {/* must match vite.config.ts */}
        <Route path="/cv/dev/en" element={<CV2 />} />
        <Route path="/cv/art/vn" element={<CV2 />} />
        <Route path="/cv/wage/vn" element={<CV2 />} />
        <Route path="/v1" element={<CV1 />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
