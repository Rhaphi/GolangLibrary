package http

import (
	"net/http"

	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
)

func NewRouter(bookHandler *BookHandler, userHandler *Handler) http.Handler {
	myRouter := mux.NewRouter().StrictSlash(true)

	myRouter.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	myRouter.HandleFunc("/api/books", bookHandler.GetBooks).Methods("GET")
	myRouter.HandleFunc("/api/books/title/{title}", bookHandler.GetBook).Methods("GET")
	myRouter.HandleFunc("/api/books/author", bookHandler.GetBooksByAuthor).Methods("GET")
	myRouter.HandleFunc("/api/books", bookHandler.CreateBook).Methods("POST")
	myRouter.HandleFunc("/api/books/{id}", bookHandler.UpdateBook).Methods("PUT")
	myRouter.HandleFunc("/api/books/{id}", bookHandler.DeleteBook).Methods("DELETE")

	myRouter.HandleFunc("/api/register", userHandler.RegisterUser).Methods("POST")
	myRouter.HandleFunc("/api/login", userHandler.LoginUser).Methods("POST")

	protected := myRouter.PathPrefix("/api").Subrouter()
	protected.Use(AuthMiddleware(userHandler.UserUsecase.JwtSecretString()))

	protected.HandleFunc("/user", userHandler.GetUserProfile).Methods("GET")
	protected.HandleFunc("/user", userHandler.UpdateUserProfile).Methods("PUT")

	return myRouter
}
