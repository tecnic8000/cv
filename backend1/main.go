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

type description struct {
	TitleDesc string `json:"titleDesc"`
	VN    string `json:"vn"`
	EN    string `json:"en"`
	FR    string `json:"fr"`
	JP    string `json:"jp"`
}
type profile struct {
	About      description `json:"about"`
	Skill      description `json:"skill"`
	Experience description `json:"experience"`
	Project    description `json:"project"`
}
type contactDetail struct {
	TitleContact string `json:"TitleContact"`
	Name    []string `json:"name"`
	Address []string `json:"address"`
	Link    []string `json:"link"`
}
type CV struct {
	Contact     contactDetail `json:"contact"`
	Certificate []string      `json:"certificate"`
	Education   []string      `json:"education"`
	Interest    description   `json:"interest"`
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
	title := ""
	description := ""
	builder := strings.Builder{}

	setBody := func() {
		if section == "CONTACT" {
			val := strings.TrimRight(builder.String(), "\n")

			switch subsection {
			case "name":
				lines := strings.Split(val, "\n")
				var names []string
				for _, l := range lines {
					l = strings.TrimSpace(l)
					if l != "" {
						names = append(names, l)
					}
				}
				cv.Contact.Name = names
			case "address":
				lines := strings.Split(val, "\n")
				var addresses []string
				for _, l := range lines {
					l = strings.TrimSpace(l)
					if l != "" {
						addresses = append(addresses, l)
					}
				}
				cv.Contact.Address = addresses
			case "link":
				lines := strings.Split(val, "\n")
				var links []string
				for _, l := range lines {
					l = strings.TrimSpace(l)
					if l != "" {
						links = append(links, l)
					}
				}
				cv.Contact.Link = links
			}
		} else if section == "INTEREST" {
			cv.Interest.TitleDesc = title
			switch description {
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
				cv.Dev.About.TitleDesc = title
				switch description {
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
				cv.Dev.Skill.TitleDesc = title
				switch description {
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
				cv.Dev.Experience.TitleDesc = title
				switch description {
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
				cv.Dev.Project.TitleDesc = title
				switch description {
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
				cv.Art.About.TitleDesc = title
				switch description {
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
				cv.Art.Skill.TitleDesc = title
				switch description {
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
				cv.Art.Experience.TitleDesc = title
				switch description {
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
				cv.Art.Project.TitleDesc = title
				switch description {
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
		if description != "" {
			setBody()
			description = ""
		}
		switch section {
		case "CERTIFICATE":
			lines := strings.Split(builder.String(), "\n")
			var arr []string
			for _, l := range lines {
				l = strings.TrimSpace(l)
				if l != "" {
					arr = append(arr, l)
				}
			}
			if len(arr) > 0 {
				cv.Certificate = append([]string{title}, arr...)
			}
		case "EDUCATION":
			lines := strings.Split(builder.String(), "\n")
			var arr []string
			for _, l := range lines {
				l = strings.TrimSpace(l)
				if l != "" {
					arr = append(arr, l)
				}
			}
			if len(arr) > 0 {
				cv.Education = append([]string{title}, arr...)
			}
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
			// Extract section between "# " and ":" if present
			sectionLine := strings.TrimSpace(line[2:])
			if idx := strings.Index(sectionLine, ":"); idx != -1 {
				section = strings.TrimSpace(sectionLine[:idx])
				title = strings.TrimSpace(sectionLine[idx+1:])
				if section == "CONTACT"{
					cv.Contact.TitleContact = title
				} else if section == "CERTIFICATE" {
					// cv.Certificate[0] = title
				}
			} else {
				section = sectionLine
			}
		} else if strings.HasPrefix(line, "## ") {
			if section == "CONTACT" {
				setBody()
			} else if description != "" {
				setBody()
				description = ""
			}
			// Extract subsection between "## " and ":" if present
			subsectionLine := strings.TrimSpace(line[3:])
			if idx := strings.Index(subsectionLine, ":"); idx != -1 {
				subsection = strings.TrimSpace(subsectionLine[:idx])
				title = strings.TrimSpace(subsectionLine[idx+1:])
			} else {
				subsection = subsectionLine
			}
		} else if strings.HasPrefix(line, "### ") {
			if description != "" {
				setBody()
			}
			description = strings.TrimSpace(line[4:])
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
