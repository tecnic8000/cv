package main

import (
	"bufio"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/text/internal/language"
)

var db = make(map[string]string)

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

	// Get user value
	r.GET("/user/:name", func(c *gin.Context) {
		user := c.Params.ByName("name")
		value, ok := db[user]
		if ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "value": value})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "status": "no value"})
		}
	})

	// Authorized group (uses gin.BasicAuth() middleware)
	// Same than:
	// authorized := r.Group("/")
	// authorized.Use(gin.BasicAuth(gin.Credentials{
	//	  "foo":  "bar",
	//	  "manu": "123",
	//}))
	authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
		"foo":  "bar", // user:foo password:bar
		"manu": "123", // user:manu password:123
	}))

	/* example curl for /admin with basicauth header
	   Zm9vOmJhcg== is base64("foo:bar")

		curl -X POST \
	  	http://localhost:8080/admin \
	  	-H 'authorization: Basic Zm9vOmJhcg==' \
	  	-H 'content-type: application/json' \
	  	-d '{"value":"bar"}'
	*/
	authorized.POST("admin", func(c *gin.Context) {
		user := c.MustGet(gin.AuthUserKey).(string)

		// Parse JSON
		var json struct {
			Value string `json:"value" binding:"required"`
		}

		if c.Bind(&json) == nil {
			db[user] = json.Value
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		}
	})

	return r
}
type CVstack struct {
	language string 
	frontend string
	backend string
	cloud string
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
