import "./style1.css";
import { config } from "./config"
import { BrowserRouter, Routes, Route } from "react-router-dom"
// import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { motion } from "motion/react";
import { useEffect, useState } from "react";
import cv2 from "./cv.json"
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

function CV1() {
  interface CV {
    Contact: { [key: string]: string };
    Education: { [key: string]: string };
    Certificate: { [key: string]: string };
    Interest: { [key: string]: string };
    Job: {
      [jobType: string]: {
        [sectionType: string]: {
          [key: string]: string
        };
      }
    }
  }

  const [cv, setCV] = useState<CV | null>(null);
  // const [langMode, setLangMode] = useState<"vn" | "en" | "fr" | "jp">("vn");
  const langMode: string = "vn";
  // const [langIndex, setLangIndex] = useState<number>(0);
  // const [jobMode, setJobMode] = useState<"dev" | "art" | "trade">("dev");
  const jobMode: string = "dev";

  let langIndex: number = 0;
  useEffect(() => {
    async function getCV() {
      const res = await fetch(config.cvURL);
      if (!res.ok) throw Error("ERR--API FAILED--001");
      const cv = await res.json();
      setCV(cv);
    }
    getCV();
  }, []);

  // console.log(cv)
  switch (langMode) {
    case "vn": langIndex = 1; break;
    case "fr": langIndex = 2; break;
    case "jp": langIndex = 3; break;
  }

  if (!cv) return <div>LOADING... goBackend seems offline</div>
  // console.log(langIndex, langMode)
  // console.log(cv.Job[jobMode].exp["vn"])
  // console.log(cv.Job[jobMode].proj["vn"])
  return (<>

    <Card className="bg-white m-4 p-2">

      {/* PROFILE */}
      <div className="flex ">
        <CardHeader className="bg-blue-300 w-100 m-1 border-r-2 rounded-l-md" >
          <div className="h-1 pt-2 text-2xl">{cv.Contact["__name__"].split(/\n/).slice(1, -1)[langIndex]}</div><br />Fullstack Developer
        </CardHeader>
        <div>
          <CardDescription className="bg-teal-000">
            {((item) => {
              switch (jobMode) {
                case "dev": return (
                  <div>
                    <span className="text-lg">{item[0]}</span><br />
                    {item[1]}<br />{item[2]}<br />
                  </div>);
              }
            })(cv.Contact["__link__"].split("\n").slice(1, -1))
            }

          </CardDescription>
          <CardDescription className="bg-pink-000">
            {cv.Contact["__address__"].split(/\n/).slice(1, -1)[langIndex].slice(10)}
          </CardDescription>
        </div>
      </div>

      {/* <CardDescription className="">{cv.Job[jobMode].obj[langMode]}</CardDescription> */}

      {/* EXPERIENCE */}
      <div className="bg-blue-000">
        <CardFooter className="border-t border-l ml-2 border-gray-950">{cv.Job[jobMode].exp["header"].split("|")[langIndex]}</CardFooter>
        <CardDescription >
          {cv.Job[jobMode].exp[langMode].split("@").map((item, index) => (
            <div key={index}> {item.split("__").slice(1).map((detail, i) => {
              switch (i) {
                case 0: return (
                  <div key={i} className="bg-blue-300 max-w-2xl px-3 py-1 mb-1 flex justify-between rounded-sm">
                    <span >
                      {detail.split("_")[0]}&nbsp;- {detail.split("_")[1]}
                    </span>
                    <span>
                      {detail.split("_")[2]}&nbsp;{detail.split("_")[3]}
                    </span>
                  </div>);
                case 1: return detail.split("\n").slice(1).map((sub, i) => (<div key={i}>{sub}</div>));
                default: return null;
              }
            })} </div>
          ))
          }
        </CardDescription>
      </div>
      {/* <CardDescription>{cv.Job[jobMode].skill["__backend__"]}</CardDescription> */}

      {/* SKILL */}
      <div >
        <CardFooter className="border w-fit pt-1 mb-2 rounded-md">{cv.Job[jobMode].skill["header"].split("|")[langIndex]}</CardFooter>
        <CardDescription >
          {
            (() => {
              switch (jobMode) {
                case "dev": return (
                  <div>
                    &middot;{cv.Job[jobMode].skill["__Language__"]}<br />
                    &middot;{cv.Job[jobMode].skill["__Frontend__"]}<br />
                    &middot;{cv.Job[jobMode].skill["__Backend__"]}<br />
                    &middot;{cv.Job[jobMode].skill["__Database__"]}
                  </div>
                )
                case "art": return "empty.."
                case "trade": return "empty.."
                default: return null
              }
            })
              ()}
        </CardDescription>
      </div>


      {/* PROJECT */}
      <div className="bg-blue-000">
        <CardFooter className="border-1 w-fit pt-1 mb-2 rounded-lg">{cv.Job[jobMode].proj["header"].split("|")[langIndex]}</CardFooter>
        <CardDescription>
          {cv.Job[jobMode].proj[langMode].split("\n").slice(1, -1).map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </CardDescription>
      </div>
      {/* PERSONA */}
      {/* <CardDescription>{cv.Job[jobMode].persona[langMode]}</CardDescription> */}

      {/* CERTIFICATE */}
      {/* <div className="bg-green-300">
        <CardHeader>{cv.Certificate[0].split("|")[langIndex]}</CardHeader>
        <CardDescription>{cv.Certificate[1]}</CardDescription>
      </div> */}

      {/* EDUCATION */}
      <div className="border-t border-gray-900 w-fit">
        <CardFooter className="pt-2">{cv.Education["header"].split("@")[0].split("|")[langIndex]}</CardFooter>
        <CardFooter>
          {cv.Education["header"].split("@")[1].split("_")[0]}<br />
          {cv.Education["header"].split("@")[1].split("_")[1]}&nbsp;
          {cv.Education["header"].split("@")[1].split("_")[2]}
        </CardFooter>
        <CardDescription>
          {cv.Education[langMode].split("\n").slice(1, -1).map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </CardDescription>
      </div>

      <div className="">
        {/* v0.1 */}
        <div className="bg-blue-400 w-[10px] h-[10px] flex float-end"></div>
      </div>
    </Card>
  </>
  )
}

function CV2() {
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
  const langMode: string = "vn";
  // const [langIndex, setLangIndex] = useState<number>(0);
  // const [jobMode, setJobMode] = useState<"dev" | "art" | "trade">("dev");
  const jobMode: string = "dev";

  let langIndex: number = 0;
  switch (langMode) {
    case "vn": langIndex = 1; break;
    case "fr": langIndex = 2; break;
    case "jp": langIndex = 3; break;
  }

  if (!cv2) return <div>LOADING JSON</div>
  // console.log(langIndex, langMode)
  // console.log(cv.Job[jobMode].exp["vn"])
  // console.log(cv.Job[jobMode].proj["vn"])
  return (<>

    <Card className="bg-white m-4 p-2">

      {/* PROFILE */}
      <div className="flex ">
        <CardHeader className="bg-blue-300 w-100 m-1 border-r-2 rounded-l-md" >
          <div className="h-1 pt-2 text-2xl">{cv.contact["name"][langIndex]}</div><br />Frontend Developer
        </CardHeader>
        <div>
          <CardDescription className="bg-teal-000">
            {((item) => {
              switch (jobMode) {
                case "dev": return (
                  <div>
                    <span className="text-lg">{item[0]}</span><br />
                    {item[1]}<br />{item[2]}<br />
                  </div>);
              }
            })(cv.contact["link"])
            }

          </CardDescription>
          <CardDescription className="bg-pink-000">
            {cv.contact["address"][langIndex].slice(10)}
          </CardDescription>
        </div>
      </div>

      {/* <CardDescription className="">{cv.Job[jobMode].obj[langMode]}</CardDescription> */}

      {/* EXPERIENCE */}
      <div className="bg-blue-000">
        <CardFooter className="border-t border-l ml-2 rounded-tl-lg border-gray-950">
          {(cv.job[jobMode].exp["header"] as string).split("|")[langIndex]}
        </CardFooter>
        <CardDescription >
          {(cv.job[jobMode].exp[langMode] as string).split("@").map((item, index) => (
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
          {(cv.job[jobMode].skill["header"] as string).split("|")[langIndex]}
        </CardFooter>
        <CardDescription >
          {
            (() => {
              switch (jobMode) {
                case "dev": return (
                  <div>
                    &middot; {cv.job[jobMode].skill["Language"]}<br />
                    &middot; {cv.job[jobMode].skill["Frontend"]}<br />
                    &middot; {cv.job[jobMode].skill["Backend"]}<br />
                    &middot; {cv.job[jobMode].skill["Database"]}
                  </div>
                )
                case "art": return "empty.."
                case "trade": return "empty.."
                default: return null
              }
            })
              ()}
          {/* PERSONA */}
          {(cv.job[jobMode].persona[langMode] as string[]).map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </CardDescription>
      </div>

      {/* PROJECT */}
      <div className="bg-blue-000">
        <CardFooter className="border-1 w-fit pt-1 mb-2 rounded-lg">
          {(cv.job[jobMode].proj["header"] as string).split("|")[langIndex]}
        </CardFooter>
        <CardDescription>
          {(cv.job[jobMode].proj[langMode] as string[]).map((item, index) => (
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
          {(cv.education[langMode] as string[]).map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </CardDescription>
      </div>

      <div className="">
        {/* v0.1 */}
        <div className="bg-blue-400 w-[10px] h-[10px] flex float-end"></div>
      </div>
    </Card>
  </>
  )
}
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CV2 />} />
        <Route path="/v1" element={<CV1 />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
