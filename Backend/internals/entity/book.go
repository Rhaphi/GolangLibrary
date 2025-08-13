package entity

import "github.com/google/uuid"

type Book struct {
	ID              uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"id"`
	Title           string    `json:"title"`
	Author          string    `json:"author"`
	ISBN            string    `json:"isbn"`
	Publisher       string    `json:"publisher"`
	YearPublished   int       `json:"year_published"`
	CountryofOrigin string    `json:"country_of_origin"`
	ImageURL        string    `json:"image_url"`
}

type BookInput struct {
	Title           string `json:"title"`
	Author          string `json:"author"`
	ISBN            string `json:"isbn"`
	Publisher       string `json:"publisher"`
	YearPublished   int    `json:"year_published"`
	CountryofOrigin string `json:"country_of_origin"`
	ImageURL        string `json:"image_url"`
}

func GenerateID() string {
	return uuid.New().String()
}
