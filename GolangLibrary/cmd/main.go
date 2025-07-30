package main

import (
	"GolangLibrary/internals/database"
	"GolangLibrary/internals/repository"
	"GolangLibrary/internals/usecase"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	_ "GolangLibrary/docs"
	httphandler "GolangLibrary/internals/delivery/http"

	"github.com/rs/cors"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET not set in .env")
	}

	database.ConnectDB()
	db := database.DB

	bookRepo := repository.NewBookRepository(db)
	userRepo := repository.NewUserRepository(db)

	bookUC := usecase.NewBookUsecase(bookRepo)
	userUC := usecase.NewUserUsecase(userRepo, jwtSecret)

	bookHandler := httphandler.NewBookHandler(bookUC)
	userHandler := httphandler.NewUserHandler(userUC)

	router := httphandler.NewRouter(bookHandler, userHandler)

	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handlerWithCORS := corsMiddleware.Handler(router)

	log.Println("Server Running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handlerWithCORS))
}
