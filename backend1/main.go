package main

import (
	"bufio"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	r := gin.Default()

	// Ping test
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
type CV struct {
	About 	string 	`json:"about"`
	Contact 	string 	`json:"contact"`
	Stack	string 	`json:"stack"`
	Experience string 	`json:"experience"`
	Projects 	string 	`json:"projects"`
	Education string	`json:"education"` 
	Certificate string	`json:"certificate"`
}
type profile struct{
	About string `json:"about"`
	Skill string `json:"skill"`
	Experience string `json:"experience"`
	Project string `json:"project"`

}
type CV2 struct {
	Contact string `json:"contact"`
	Certificate string `json:"certificate"`
	Education string `json:"education"`
	Dev profile `json:"dev"`
	Art profile `json:"art"`
}

func getCV(path string) (CV,error) {
	// read cd.md
	file, err := os.Open(path)
	if err != nil {
		return CV{}, err
	}
	defer file.Close()

	cv := CV{}
	section := ""
	var builder strings.Builder
	
	setSection := func() {
		switch section {
		case "about": cv.About = builder.String()
		case "contact": cv.Contact = builder.String()
		case "stack": cv.Stack = builder.String()
		case "experience": cv.Experience = builder.String()
		case "projects": cv.Projects = builder.String()
		case "education": cv.Education = builder.String()
		case "certificate": cv.Certificate = builder.String()
		}
		builder.Reset()
	}
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "# "){
			if section != "" {
				setSection()
			}
			section = strings.ToLower(strings.TrimSpace(line[2:]))
		} else if section != "" {
			builder.WriteString((line + "\n"))
		}
	}
	if section != "" {
		setSection()
	}
	return cv, scanner.Err()
}

func main() {
	r := setupRouter()
	r.Run(":8011") // port in 0.0.0.0:8011

	
}
