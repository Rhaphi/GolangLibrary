package usecase

import (
	"GolangLibrary/internals/entity"
	"GolangLibrary/internals/repository"
)

type BookUsecase struct {
	bookRepo repository.BookRepository
}

func NewBookUsecase(bookRepo repository.BookRepository) *BookUsecase {
	return &BookUsecase{bookRepo: bookRepo}
}

func (uc *BookUsecase) GetAll(page, pageSize int, title string) ([]entity.Book, error) {
	return uc.bookRepo.GetAll(page, pageSize, title)
}

func (uc *BookUsecase) CountBooks(title string) int {
	return uc.bookRepo.CountBooks(title)
}

func (uc *BookUsecase) Create(book entity.Book) (entity.Book, error) {
	return uc.bookRepo.Create(book)
}

func (uc *BookUsecase) Exists(title, author string) bool {
	return uc.bookRepo.Exists(title, author)
}

func (uc *BookUsecase) GetByTitle(title string, partial bool) ([]entity.Book, error) {
	return uc.bookRepo.GetByTitle(title, partial)
}

func (uc *BookUsecase) GetByAuthor(author string) ([]entity.Book, error) {
	return uc.bookRepo.GetByAuthor(author)
}

func (uc *BookUsecase) GetByID(id string) (entity.Book, bool) {
	return uc.bookRepo.GetByID(id)
}

func (uc *BookUsecase) ExistsByISBN(isbn string) bool {
	return uc.bookRepo.ExistsByISBN(isbn)
}

func (uc *BookUsecase) FindByISBN(isbn string) (entity.Book, bool) {
	return uc.bookRepo.FindByISBN(isbn)
}

func (uc *BookUsecase) Update(id string, updatedData entity.BookInput) (entity.Book, bool) {
	return uc.bookRepo.Update(id, updatedData)
}

func (uc *BookUsecase) Delete(id string) bool {
	return uc.bookRepo.Delete(id)
}
