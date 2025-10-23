import { config } from "@/config";
import { useEffect, useState } from "react";
import { Card, CardDescription, CardFooter, CardHeader } from "./ui/card";

export default function CV1() {
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