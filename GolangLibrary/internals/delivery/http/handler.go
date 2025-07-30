package http

import (
	"GolangLibrary/internals/entity"
	"GolangLibrary/internals/usecase"
	"encoding/json"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type BookHandler struct {
	Usecase *usecase.BookUsecase
}

func NewBookHandler(uc *usecase.BookUsecase) *BookHandler {
	return &BookHandler{Usecase: uc}
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type SuccessResponse struct {
	Message string `json:"message"`
}

func (h *BookHandler) CreateBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input entity.BookInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid input"})
		return
	}

	input.Title = strings.TrimSpace(input.Title)
	input.Author = strings.TrimSpace(input.Author)

	if input.Title == "" || len(input.Title) > 255 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid or missing title"})
		return
	}

	if input.Author == "" || len(input.Author) > 255 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid or missing author"})
		return
	}

	if h.Usecase.Exists(input.Title, input.Author) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Book already exists"})
		return
	}

	newBook := entity.Book{
		Title:           input.Title,
		Author:          input.Author,
		YearPublished:   input.YearPublished,
		Publisher:       input.Publisher,
		ISBN:            input.ISBN,
		CountryofOrigin: input.CountryofOrigin,
	}

	created, err := h.Usecase.Create(newBook)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to create book"})
		return
	}

	input.ISBN = strings.TrimSpace(input.ISBN)

	if input.ISBN == "" || len(input.ISBN) != 13 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid or missing ISBN (must be 13 characters)"})
		return
	}

	if h.Usecase.ExistsByISBN(input.ISBN) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Book with this ISBN already exists"})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

func (h *BookHandler) GetBooks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	title := strings.TrimSpace(r.URL.Query().Get("title"))
	pageStr := r.URL.Query().Get("page")
	pageSizeStr := r.URL.Query().Get("page_size")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}
	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	books, err := h.Usecase.GetAll(page, pageSize, title)
	if err != nil {
		if err == gorm.ErrInvalidData {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(ErrorResponse{Error: "Title too long"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to fetch books"})
		return
	}

	totalCount := h.Usecase.CountBooks(title)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"books":       books,
		"total_count": totalCount,
	})
}

func (h *BookHandler) GetBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	title := strings.TrimSpace(params["title"])

	if title == "" || len(title) > 255 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid or missing title"})
		return
	}

	books, err := h.Usecase.GetByTitle(title, true)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to fetch books"})
		return
	}

	if len(books) == 0 {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode([]entity.Book{})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(books)
}

func (h *BookHandler) GetBooksByAuthor(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rawAuthor := r.URL.RawQuery

	if matched, _ := regexp.MatchString(`[^\w\s.\-=&]`, rawAuthor); matched {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Author name contains invalid characters"})
		return
	}

	author := strings.TrimSpace(r.URL.Query().Get("author"))
	if author == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Author name is required"})
		return
	}

	validAuthor := regexp.MustCompile(`^[a-zA-Z.\- ]+$`)
	if !validAuthor.MatchString(author) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Author name must contains invalid characters"})
		return
	}

	books, err := h.Usecase.GetByAuthor(author)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Failed to fetch books by author"})
		return
	}

	if len(books) == 0 {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "No books found for the specified author"})
		return
	}

	json.NewEncoder(w).Encode(books)
}

func (h *BookHandler) UpdateBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	var updatedBook entity.BookInput
	if err := json.NewDecoder(r.Body).Decode(&updatedBook); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid input"})
		return
	}

	updatedBook.Title = strings.TrimSpace(updatedBook.Title)
	updatedBook.Author = strings.TrimSpace(updatedBook.Author)
	if updatedBook.Title == "" || len(updatedBook.Title) > 255 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid or missing title"})
		return
	}
	if updatedBook.Author == "" || len(updatedBook.Author) > 255 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid or missing author"})
		return
	}

	updated, ok := h.Usecase.Update(id, updatedBook)
	if !ok {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Book not found"})
		return
	}

	json.NewEncoder(w).Encode(updated)
}

func (h *BookHandler) DeleteBook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id := params["id"]

	if ok := h.Usecase.Delete(id); !ok {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Book not found"})
		return
	}

	json.NewEncoder(w).Encode(SuccessResponse{Message: "Book deleted successfully"})
}
