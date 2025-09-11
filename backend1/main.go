package main

import (
	"fmt"
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
	About      map[string]string `json:"about"`
	Skill      map[string]string `json:"skill"`
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
	cv.Dev.About = make(map[string]string)
	cv.Dev.Experience = make(map[string]string)
	cv.Dev.Project = make(map[string]string)
	cv.Dev.Skill = make(map[string]string)

	content := string(file)
	sections := regexp.MustCompile(`(?m)^## `).Split(content, -1)

	// fmt.Printf("sampleLog2 %s\n", sections)
	for _, section := range sections[1:] {
		lines := strings.Split(section, "$")
		// fmt.Printf("test2 %s\n", section)
		switch {
		case strings.HasPrefix(lines[0], "Contact"):
			cv.Contact["header"] = lines[0]
			re := regexp.MustCompile(`(__[^_]+__)([^_]+)`)
			matches := re.FindAllStringSubmatch(lines[1], -1)
			for _, m := range matches {
				key := strings.Trim(m[1], "_")
				val := m[2]
				cv.Contact[key] = val
			}
		case strings.HasPrefix(lines[0], "Education"):
			cv.Education["header"] = lines[0]
			re := regexp.MustCompile(`(\[[^\]]+\])([^\[]+)`)
			matches := re.FindAllStringSubmatch(lines[1], -1)
			for _, m := range matches {
				key := strings.Trim(m[1], "[]")
				val := m[2]
				cv.Education[key] = val
			}
		case strings.HasPrefix(lines[0], "Interest"):
			cv.Interest["header"] = lines[0]
			re := regexp.MustCompile(`(\[[^\]]+\])([^\[]+)`)
			matches := re.FindAllStringSubmatch(lines[1], -1)
			for _, m := range matches {
				key := strings.Trim(m[1], "[]")
				val := m[2]
				cv.Interest[key] = val
			}
		case strings.HasPrefix(lines[0], "Certificate"):
			cv.Certificate = append(cv.Certificate, lines[0])
			cv.Certificate = append(cv.Certificate, lines[1])
		case strings.HasPrefix(lines[0], "DEV"):
			body := strings.Split(section, "^\n")
			bodyDev := regexp.MustCompile(`(?m)^### `).Split(body[1],-1)
			for _, bodyDev := range bodyDev[1:]{
				subsection := strings.Split(bodyDev, "?")
				switch {
				case strings.HasPrefix(subsection[0], "ABOUT"):
					cv.Dev.About["subH"] = subsection[0]
					re := regexp.MustCompile(`(\[[^\]]+\])([^\[]+)`)
					matches := re.FindAllStringSubmatch(subsection[1], -1)
					for _, m := range matches {
						key := strings.Trim(m[1], "[]")
						val := m[2]
						cv.Dev.About[key] = val
					}
				case strings.HasPrefix(subsection[0], "EXPERIENCE"):
					cv.Dev.Experience["subH"] = subsection[0]
					re := regexp.MustCompile(`(\[[^\]]+\])([^\[]+)`)
					matches := re.FindAllStringSubmatch(subsection[1], -1)
					for _, m := range matches {
						key := strings.Trim(m[1], "[]")
						val := m[2]
						cv.Dev.Experience[key] = val
					}
				case strings.HasPrefix(subsection[0], "PROJECT"):
					cv.Dev.Project["subH"] = subsection[0]
					re := regexp.MustCompile(`(\[[^\]]+\])([^\[]+)`)
					matches := re.FindAllStringSubmatch(subsection[1], -1)
					for _, m := range matches {
						key := strings.Trim(m[1], "[]")
						val := m[2]
						cv.Dev.Project[key] = val
					}
				case strings.HasPrefix(subsection[0], "SKILL"):
					cv.Dev.Skill["subH"] = subsection[0]
					re := regexp.MustCompile(`(__[^_]+__)([^_]+)`)
					matches := re.FindAllStringSubmatch(subsection[1], -1)
					for _, m := range matches {
						key := strings.Trim(m[1], "_")
						val := m[2]
						cv.Dev.Skill[key] = val
					}
				}
			}
		case strings.HasPrefix(lines[0], "ART"):
			fmt.Print("ART part")
		}
	}

	return cv, nil
}

func main() {
	r := setupRouter()
	r.Run(":8011") // port in 0.0.0.0:8011

}
