package repository

import (
	"GolangLibrary/internals/entity"
	"strings"

	"gorm.io/gorm"
)

type BookRepository interface {
	GetAll(page, pageSize int, title string) ([]entity.Book, error)
	CountBooks(title string) int
	Create(book entity.Book) (entity.Book, error)
	Exists(title, author string) bool
	GetByTitle(title string, partial bool) ([]entity.Book, error)
	GetByAuthor(author string) ([]entity.Book, error)
	GetByID(id string) (entity.Book, bool)
	ExistsByISBN(isbn string) bool
	FindByISBN(isbn string) (entity.Book, bool)
	Update(id string, updatedData entity.BookInput) (entity.Book, bool)
	Delete(id string) bool
}

type bookRepository struct {
	db *gorm.DB
}

func NewBookRepository(db *gorm.DB) BookRepository {
	return &bookRepository{db: db}
}

func (uc *bookRepository) GetAll(page, pageSize int, title string) ([]entity.Book, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}
	if len(title) > 255 {
		return nil, gorm.ErrInvalidData
	}

	offset := (page - 1) * pageSize

	var books []entity.Book
	query := uc.db.Model(&entity.Book{})

	if title != "" {
		query = query.Where("title ILIKE ?", "%"+title+"%")
	}

	err := query.Order("id ASC").Offset(offset).Limit(pageSize).Find(&books).Error
	return books, err

}

func (uc *bookRepository) Create(book entity.Book) (entity.Book, error) {
	err := uc.db.Create(&book).Error
	return book, err
}

func (uc *bookRepository) Exists(title, author string) bool {
	var count int64
	uc.db.Model(&entity.Book{}).Where("title = ? AND author = ?", title, author).Count(&count)
	return count > 0
}

func (r *bookRepository) CountBooks(title string) int {
	var count int64
	query := r.db.Model(&entity.Book{})

	if title != "" {
		query = query.Where("title ILIKE ?", "%"+title+"%")
	}

	query.Count(&count)
	return int(count)
}

func (r *bookRepository) GetByTitle(title string, partial bool) ([]entity.Book, error) {
	var books []entity.Book
	query := r.db

	cleanTitle := strings.TrimSpace(strings.ToLower(title))

	if partial {
		query = query.Where("LOWER(title) LIKE ?", "%"+cleanTitle+"%")
	} else {
		query = query.Where("LOWER(title) = ?", cleanTitle)
	}

	err := query.Find(&books).Error
	return books, err
}

func (uc *bookRepository) GetByAuthor(author string) ([]entity.Book, error) {
	var books []entity.Book

	query := uc.db.Where("LOWER(author) LIKE ?", "%"+strings.ToLower(strings.TrimSpace(author))+"%")
	err := query.Find(&books).Error

	return books, err
}

func (uc *bookRepository) GetByID(id string) (entity.Book, bool) {
	var book entity.Book
	err := uc.db.Where("id = ?", id).First(&book).Error
	if err != nil {
		return entity.Book{}, false
	}
	return book, true
}

func (uc *bookRepository) ExistsByISBN(isbn string) bool {
	var count int64
	uc.db.Model(&entity.Book{}).Where("isbn = ?", isbn).Count(&count)
	return count > 0
}

func (uc *bookRepository) FindByISBN(isbn string) (entity.Book, bool) {
	var book entity.Book
	err := uc.db.Where("isbn = ?", isbn).First(&book).Error
	if err != nil {
		return entity.Book{}, false
	}
	return book, true
}

func (uc *bookRepository) Update(id string, updatedData entity.BookInput) (entity.Book, bool) {
	var book entity.Book
	if err := uc.db.Where("id = ?", id).First(&book).Error; err != nil {
		return entity.Book{}, false
	}

	book.Title = updatedData.Title
	book.Author = updatedData.Author
	book.ISBN = updatedData.ISBN
	book.Publisher = updatedData.Publisher
	book.YearPublished = updatedData.YearPublished
	book.CountryofOrigin = updatedData.CountryofOrigin
	book.ImageURL = updatedData.ImageURL

	if err := uc.db.Save(&book).Error; err != nil {
		return entity.Book{}, false
	}
	return book, true
}

func (uc *bookRepository) Delete(id string) bool {
	result := uc.db.Where("id = ?", id).Delete(&entity.Book{})
	return result.Error == nil && result.RowsAffected > 0
}
