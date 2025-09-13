package main

import (
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default()) // should change for production security
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})
	r.GET("/cv", func(ctx *gin.Context) {
		cv, err := getCV("cv.md")
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, cv)
	})
	return r
}

type profile struct {
	Objective  map[string]string `json:"objective"`
	Skill      map[string]string `json:"skill"`
	Persona 	 map[string]string `json:"persona"`
	Experience map[string]string `json:"experience"`
	Project    map[string]string `json:"project"`
}
type CV struct {
	Contact     map[string]string `json:"contact"`
	Education   map[string]string `json:"education"`
	Interest    map[string]string `json:"interest"`
	Certificate []string          `json:"certificate"`
	Dev         profile           `json:"dev"`
	Art         profile           `json:"art"`
}

func getCV(path string) (CV, error) {
	file, err := os.ReadFile(path)
	if err != nil {
		return CV{}, err
	}

	cv := CV{}
	cv.Contact = make(map[string]string)
	cv.Education = make(map[string]string)
	cv.Interest = make(map[string]string)

	cv.Dev.Objective = make(map[string]string)
	cv.Dev.Experience = make(map[string]string)
	cv.Dev.Project = make(map[string]string)
	cv.Dev.Skill = make(map[string]string)
	cv.Dev.Persona = make(map[string]string)

	cv.Art.Objective = make(map[string]string)
	cv.Art.Experience = make(map[string]string)
	cv.Art.Project = make(map[string]string)
	cv.Art.Skill = make(map[string]string)
	cv.Art.Persona = make(map[string]string)


	setSquare := func (lines []string, target map[string]string) {
		target["header"] = lines[0]
		re := regexp.MustCompile(`(\[[^\]]+\])([^\[]+)`)
		matches := re.FindAllStringSubmatch(lines[1], -1)
		for _, m := range matches {
				key := strings.Trim(m[1], "[]")
				val := strings.TrimPrefix(m[2], "- ")
				target[key] = val
			}
	}

	setDash := func (sub []string, target map[string]string){
	target["header"] = sub[0]
			re := regexp.MustCompile(`(__[^_]+__)([^_]+)`)
			matches := re.FindAllStringSubmatch(sub[1], -1)
			for _, m := range matches {
				key := strings.Trim(m[1], "_")
				val := strings.TrimPrefix(m[2], "- ")
				target[key] = val
			}

	}

	content := string(file)
	sections := regexp.MustCompile(`(?m)^## `).Split(content, -1)
	for _, section := range sections[1:] {
		lines := strings.Split(section, "$")
		switch {
		case strings.HasPrefix(lines[0], "Contact"):
			setDash(lines, cv.Contact)
		case strings.HasPrefix(lines[0], "Education"):
			setSquare(lines, cv.Education)
		case strings.HasPrefix(lines[0], "Interest"):
			setSquare(lines, cv.Interest)
		case strings.HasPrefix(lines[0], "Certificate"):
			cv.Certificate = append(cv.Certificate, lines[0])
			cv.Certificate = append(cv.Certificate, lines[1])
		case strings.HasPrefix(lines[0], "DEV"):
			body := strings.Split(section, "^\n")
			bodyDev := regexp.MustCompile(`(?m)^### `).Split(body[1],-1)
			for _, bodyDev := range bodyDev[1:]{
				subsection := strings.Split(bodyDev, "?")
				switch {
				case strings.HasPrefix(subsection[0], "Objective"):
					setSquare(subsection, cv.Dev.Objective)
				case strings.HasPrefix(subsection[0], "Experience"):
					setSquare(subsection, cv.Dev.Experience)
				case strings.HasPrefix(subsection[0], "Project"):
					setSquare(subsection, cv.Dev.Project)
				case strings.HasPrefix(subsection[0], "Skill"):
					setDash(subsection, cv.Dev.Skill)
				case strings.HasPrefix(subsection[0], "Persona"):
					setSquare(subsection, cv.Dev.Persona)
				}
			}
		case strings.HasPrefix(lines[0], "ART"):
			body := strings.Split(section, "^\n")
			bodyArt := regexp.MustCompile(`(?m)^### `).Split(body[1],-1)
			for _, bodyArt := range bodyArt[1:]{
				subsection := strings.Split(bodyArt, "?")
				switch {
				case strings.HasPrefix(subsection[0], "Objective"):
					setSquare(subsection, cv.Art.Objective)
				case strings.HasPrefix(subsection[0], "Experience"):
					setSquare(subsection, cv.Art.Experience)
				case strings.HasPrefix(subsection[0], "Project"):
					setSquare(subsection, cv.Art.Project)
				case strings.HasPrefix(subsection[0], "Skill"):
					setDash(subsection, cv.Art.Skill)
				case strings.HasPrefix(subsection[0], "Persona"):
					setSquare(subsection, cv.Art.Persona)
				}
			}
		}
	}

	return cv, nil
}

func main() {
	r := setupRouter()
	r.Run(":8011") // port in 0.0.0.0:8011

}
