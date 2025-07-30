package entity

import "github.com/google/uuid"

type Book struct {
	ID              uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"id"`
	Title           string    `json:"title"`
	Author          string    `json:"author"`
	YearPublished   int       `json:"year_published"`
	Publisher       string    `json:"publisher"`
	ISBN            string    `json:"isbn"`
	CountryofOrigin string    `json:"country_of_origin"`
}

type BookInput struct {
	Title           string `json:"title"`
	Author          string `json:"author"`
	YearPublished   int    `json:"year_published"`
	Publisher       string `json:"publisher"`
	ISBN            string `json:"isbn"`
	CountryofOrigin string `json:"country_of_origin"`
}

func GenerateID() string {
	return uuid.New().String()
}
