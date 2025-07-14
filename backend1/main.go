package main

import (
	"bufio"
	"net/http"
	"os"
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

type language struct {
	VN string `json:"vn"`
	EN string `json:"en"`
	FR string `json:"fr"`
	JP string `json:"jp"`
}
type profile struct {
	About      language `json:"about"`
	Skill      language `json:"skill"`
	Experience language `json:"experience"`
	Project    language `json:"project"`
}
type contactDetail struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Link    string `json:"link"`
}
type CV struct {
	Contact     contactDetail `json:"contact"`
	Certificate string        `json:"certificate"`
	Education   string        `json:"education"`
	Interest    language      `json:"interest"`
	Dev         profile       `json:"dev"`
	Art         profile       `json:"art"`
}

func getCV(path string) (CV, error) {
	file, err := os.Open(path)
	if err != nil {
		return CV{}, err
	}
	defer file.Close()

	cv := CV{}
	section := ""
	subsection := ""
	language := ""
	builder := strings.Builder{}

	setBody := func() {
		if section == "CONTACT" {
			val := strings.TrimRight(builder.String(), "\n")
			switch subsection {
			case "name":
				cv.Contact.Name = val
			case "address":
				cv.Contact.Address = val
			case "link":
				cv.Contact.Link = val
			}
		} else if section == "INTEREST" {
			switch language {
			case "VN":
				cv.Interest.VN = builder.String()
			case "EN":
				cv.Interest.EN = builder.String()
			case "FR":
				cv.Interest.FR = builder.String()
			case "JP":
				cv.Interest.JP = builder.String()
			}
		} else if section == "DEV" {
			switch subsection {
			case "ABOUT":
				switch language {
				case "VN":
					cv.Dev.About.VN = builder.String()
				case "EN":
					cv.Dev.About.EN = builder.String()
				case "FR":
					cv.Dev.About.FR = builder.String()
				case "JP":
					cv.Dev.About.JP = builder.String()
				}
			case "SKILL":
				switch language {
				case "VN":
					cv.Dev.Skill.VN = builder.String()
				case "EN":
					cv.Dev.Skill.EN = builder.String()
				case "FR":
					cv.Dev.Skill.FR = builder.String()
				case "JP":
					cv.Dev.Skill.JP = builder.String()
				}
			case "EXPERIENCE":
				switch language {
				case "VN":
					cv.Dev.Experience.VN = builder.String()
				case "EN":
					cv.Dev.Experience.EN = builder.String()
				case "FR":
					cv.Dev.Experience.FR = builder.String()
				case "JP":
					cv.Dev.Experience.JP = builder.String()
				}
			case "PROJECT":
				switch language {
				case "VN":
					cv.Dev.Project.VN = builder.String()
				case "EN":
					cv.Dev.Project.EN = builder.String()
				case "FR":
					cv.Dev.Project.FR = builder.String()
				case "JP":
					cv.Dev.Project.JP = builder.String()
				}
			}
		} else if section == "ART" {
			switch subsection {
			case "ABOUT":
				switch language {
				case "VN":
					cv.Art.About.VN = builder.String()
				case "EN":
					cv.Art.About.EN = builder.String()
				case "FR":
					cv.Art.About.FR = builder.String()
				case "JP":
					cv.Art.About.JP = builder.String()
				}
			case "SKILL":
				switch language {
				case "VN":
					cv.Art.Skill.VN = builder.String()
				case "EN":
					cv.Art.Skill.EN = builder.String()
				case "FR":
					cv.Art.Skill.FR = builder.String()
				case "JP":
					cv.Art.Skill.JP = builder.String()
				}
			case "EXPERIENCE":
				switch language {
				case "VN":
					cv.Art.Experience.VN = builder.String()
				case "EN":
					cv.Art.Experience.EN = builder.String()
				case "FR":
					cv.Art.Experience.FR = builder.String()
				case "JP":
					cv.Art.Experience.JP = builder.String()
				}
			case "PROJECT":
				switch language {
				case "VN":
					cv.Art.Project.VN = builder.String()
				case "EN":
					cv.Art.Project.EN = builder.String()
				case "FR":
					cv.Art.Project.FR = builder.String()
				case "JP":
					cv.Art.Project.JP = builder.String()
				}
			}
		}
		builder.Reset()
	}

	setSection := func() {
		if language != "" {
			setBody()
			language = ""
		}
		switch section {
		case "CERTIFICATE":
			cv.Certificate = builder.String()
		case "EDUCATION":
			cv.Education = builder.String()
		}
		builder.Reset()
	}

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "# ") {
			if section == "CONTACT" {
				setBody()
			}
			if section != "" {
				setSection()
			}
			section = strings.TrimSpace(line[2:])
		} else if strings.HasPrefix(line, "## ") {
			if section == "CONTACT" {
				setBody()
			} else if language != "" {
				setBody()
				language = ""
			}
			subsection = strings.TrimSpace(line[3:])
		} else if strings.HasPrefix(line, "### ") {
			if language != "" {
				setBody()
			}
			language = strings.TrimSpace(line[4:])
		} else if section != "" {
			builder.WriteString(line + "\n")
		}
	}
	if section == "CONTACT" && builder.Len() > 0 {
		setBody()
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

// EXPECTED OUTPUT upon GET /cv
// cv = {
// 	"contact":"",
// 	"certificate": "",
// 	"education": "",
// 	"DEV": {
// 		"profile":"",
// 		"skill":"",
// 		"experience":"",
// 		"project":"",
// 	}
// 	"ART": {
// 		"profile":"",
// 		"skill":"",
// 		"experience":"",
// 		"project":"",
// 	}
// }
