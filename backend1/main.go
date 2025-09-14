package main

import (
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var (
	dashRegex   = regexp.MustCompile(`(__[^_]+__)([^_]+)`)
	squareRegex = regexp.MustCompile(`(\[[^\]]+\])([^\[]+)`)
	//starRegex
)

type CV struct {
	Contact, Education, Interest map[string]string
	Certificate                  []string
	Job                          map[string]map[string]map[string]string
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/ping", func(c *gin.Context) { c.String(http.StatusOK, "pong") })
	r.GET("/cv", func(c *gin.Context) {
		if cv, err := getCV("cv.md"); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusOK, cv)
		}
	})
	r.Run(":8011")
}

func getCV(path string) (CV, error) {
	file, err := os.ReadFile(path)
	if err != nil {
		return CV{}, err
	}
	cv := CV{
		Contact: make(map[string]string), Education: make(map[string]string),
		Interest: make(map[string]string), Job: make(map[string]map[string]map[string]string),
	}
	content := string(file)
	sections := regexp.MustCompile(`(?m)^## `).Split(content, -1)
	for _, section := range sections[1:] {
		parts := strings.Split(section, "$")
		header := parts[0]
		switch {
		case strings.HasPrefix(header, "Contact"):
			parseSection("dash", parts, cv.Contact)
		case strings.HasPrefix(header, "Education"):
			parseSection("square", parts, cv.Education)
		case strings.HasPrefix(header, "Interest"):
			parseSection("square", parts, cv.Interest)
		case strings.HasPrefix(header, "Certificate"):
			cv.Certificate = append(cv.Certificate, parts[0], parts[1])
		default:
			parseJob(parts, &cv)
		}
	}
	return cv, nil
}

func parseSection(filterType string, parts []string, target map[string]string) {
	var re *regexp.Regexp
	switch filterType {
	case "dash":
		re = dashRegex
	case "square":
		re = squareRegex
	}
	target["header"] = parts[0]
	for _, m := range re.FindAllStringSubmatch(parts[1], -1) {
		target[strings.Trim(m[1], "[]")] = m[2] //strings.TrimSpace(m[2])
	}
}

func parseJob(parts []string, cv *CV) {
	jobType := strings.ToLower(strings.TrimSpace(parts[0])) // Extract job type from the header (DEV, ART, TRADE)
	cv.Job[jobType] = map[string]map[string]string{
		"obj": {}, "skill": {}, "persona": {}, "exp": {}, "proj": {},
	}
	bodyParts := regexp.MustCompile(`(?m)^### `).Split(parts[1], -1)
	for _, bodyPart := range bodyParts[1:] {
		subBody := strings.Split(bodyPart, "?")
		sectionType := strings.ToLower(strings.Split(subBody[0], "|")[0])
		sectionType = strings.TrimSpace(sectionType)
		switch sectionType {
		case "objective":
			parseSection("square", subBody, cv.Job[jobType]["obj"])
		case "skill":
			parseSection("dash", subBody, cv.Job[jobType]["skill"])
		case "persona":
			parseSection("square", subBody, cv.Job[jobType]["persona"])
		case "experience":
			parseSection("square", subBody, cv.Job[jobType]["exp"])
		case "project":
			parseSection("square", subBody, cv.Job[jobType]["proj"])
		}
	}
}
