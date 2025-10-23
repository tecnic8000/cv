#!/usr/bin/env python3

import json
import os
import re

cvDict = {
      "contact": {}, "education": {}, "interest": {}, "certificate": [],
      "job": {k: {s: {} for s in ["exp", "obj", "persona", "proj", "skill"]} for k in ["dev", "art", "wage"] }
    }

def parseContent(dict, sect, data, spec=False):
  dict[sect]["header"] = data[0].strip()
  key, lines = None, data[1].strip().splitlines()
  for line in lines:
    if line.startswith("[") and line.endswith("]"):
      key = line.strip("[]")
      dict[sect][key] = "" if spec else []  # init
    elif key:
      dict[sect][key] += line if spec else [line.strip()]

def parseJob(dict, sect):
    jobpart = re.split(r"###", sect)  # Split the job section into subsections
    jobSection = [p.strip() for p in jobpart if p.strip()]  # Remove empty parts
    for js in jobSection:
        subsect = js.split("?")  # Split into subsection name and content
        if len(subsect) == 2:  # Ensure there is both a name and content
            match (subsect[0].split("|", 1)[0].strip()):
                case "Objective": parseContent(dict, "obj", subsect)
                case "Experience": parseContent(dict, "exp", subsect, True)
                case "Persona": parseContent(dict, "persona", subsect)
                case "Project": parseContent(dict, "proj", subsect)
                case "Skill": parseContent(dict, "skill", subsect, True)
                case _: print(f"Unrecognized subsection: {subsect[0]}")
        else:
            print(f"Malformed subsection: {js}")

def getCV(filepath, start_marker, end_marker, jsonpath):
    capture = False
    lines = []

    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            if start_marker in line:
                capture = True
                continue
            if end_marker in line:
                break
            if capture:
                lines.append(line)
    capturedString = "".join(lines).strip() # first read as string

    parts = re.split(r"(?<!#)##(?!#)", capturedString) # find everything between ## ... until the next ##
    sectionlist = [p.strip() for p in parts if p.strip()]
   
    for s in sectionlist:
        section = s.split("$")
        if len(section) == 2 :
            match (section[0].split("|", 1)[0].strip()):
              case "Contact": parseContent(cvDict, "contact", section)
              case "Education": parseContent(cvDict, "education", section)
              case "Interest": parseContent(cvDict, "interest", section)
              case "Certificate": 
                cvDict["certificate"].append(section[0].strip())
                cvDict["certificate"].append(section[1].strip())
              case "DEV": parseJob(cvDict["job"]["dev"], section[1])
              case "ART":  parseJob(cvDict["job"]["art"], section[1])
              case "WAGE": parseJob(cvDict["job"]["wage"], section[1])
              case _: print("default case hit")
          
    # Load existing JSON data if the file exists
    if os.path.exists(jsonpath):
        with open(jsonpath, "r", encoding="utf-8") as f:
            try:
                existingCvDict = json.load(f)
            except json.JSONDecodeError:
                existingCvDict = {}
    else:
        existingCvDict = {}
    
    existingCvDict.update(cvDict)
        
    with open (jsonpath, "w") as f:
        json.dump(existingCvDict, f, indent=3, ensure_ascii=False) # dict to json
    print("\n cv updated @ ~/REPO1/cv/cv8001/cv.json \n")
    return existingCvDict

getCV(
    os.path.expanduser("~/REPO1/note1.md"),
    "[CV-START]",
    "[CV-END]",
    os.path.expanduser("~/REPO1/cv/cv8001/src/cv.json")
)

# print(getCV)
