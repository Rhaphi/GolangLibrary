package http

import (
	"GolangLibrary/internals/entity"
	"GolangLibrary/internals/usecase"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

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

	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Could not parse multipart form", http.StatusBadRequest)
		return
	}

	title := strings.TrimSpace(r.FormValue("title"))
	author := strings.TrimSpace(r.FormValue("author"))
	isbn := strings.TrimSpace(r.FormValue("isbn"))
	publisher := r.FormValue("publisher")
	yearStr := r.FormValue("year_published")
	country := r.FormValue("country_of_origin")

	if title == "" || len(title) > 255 {
		http.Error(w, "Invalid or missing title", http.StatusBadRequest)
		return
	}
	if author == "" || len(author) > 255 {
		http.Error(w, "Invalid or missing author", http.StatusBadRequest)
		return
	}
	if isbn == "" || len(isbn) != 13 {
		http.Error(w, "Invalid or missing ISBN (must be 13 characters)", http.StatusBadRequest)
		return
	}
	if h.Usecase.Exists(title, author) {
		http.Error(w, "Book with same title and author already exists", http.StatusBadRequest)
		return
	}
	if h.Usecase.ExistsByISBN(isbn) {
		http.Error(w, "Book with this ISBN already exists", http.StatusBadRequest)
		return
	}

	// Parse year
	year, err := strconv.Atoi(yearStr)
	if err != nil {
		http.Error(w, "Invalid year_published", http.StatusBadRequest)
		return
	}

	// Handle image
	var imageURL string
	file, handler, err := r.FormFile("image")
	if err == nil {
		defer file.Close()

		filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), handler.Filename)
		filePath := "./uploads/" + filename

		dst, err := os.Create(filePath)
		if err != nil {
			http.Error(w, "Failed to save image", http.StatusInternalServerError)
			return
		}
		defer dst.Close()
		io.Copy(dst, file)

		imageURL = "/uploads/" + filename // This URL will be stored in DB
	} else {
		imageURL = "" // Optional image
	}

	// Create book
	newBook := entity.Book{
		Title:           title,
		Author:          author,
		ISBN:            isbn,
		Publisher:       publisher,
		YearPublished:   year,
		CountryofOrigin: country,
		ImageURL:        imageURL,
	}

	created, err := h.Usecase.Create(newBook)
	if err != nil {
		http.Error(w, "Failed to create book", http.StatusInternalServerError)
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

	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Could not parse multipart form", http.StatusBadRequest)
		return
	}

	title := strings.TrimSpace(r.FormValue("title"))
	author := strings.TrimSpace(r.FormValue("author"))
	publisher := r.FormValue("publisher")
	yearStr := r.FormValue("year_published")
	country := r.FormValue("country_of_origin")

	if title == "" || len(title) > 255 {
		http.Error(w, "Invalid or missing title", http.StatusBadRequest)
		return
	}
	if author == "" || len(author) > 255 {
		http.Error(w, "Invalid or missing author", http.StatusBadRequest)
		return
	}

	var year int
	if yearStr != "" {
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			http.Error(w, "Invalid year_published", http.StatusBadRequest)
			return
		}
	}

	var imageURL string
	file, handler, err := r.FormFile("image")
	if err == nil {
		defer file.Close()
		filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), handler.Filename)
		filePath := "./uploads/" + filename

		dst, err := os.Create(filePath)
		if err != nil {
			http.Error(w, "Failed to save image", http.StatusInternalServerError)
			return
		}
		defer dst.Close()
		io.Copy(dst, file)

		imageURL = "/uploads/" + filename
	} else {
		imageURL = ""
	}

	updatedBook := entity.BookInput{
		Title:           title,
		Author:          author,
		Publisher:       publisher,
		YearPublished:   year,
		CountryofOrigin: country,
		ImageURL:        imageURL,
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
