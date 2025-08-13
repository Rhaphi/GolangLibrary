package http

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"GolangLibrary/internals/entity"
	"GolangLibrary/internals/usecase"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const userIDKey contextKey = "userID"

type Handler struct {
	UserUsecase *usecase.UserUsecase
}

func NewUserHandler(uc *usecase.UserUsecase) *Handler {
	return &Handler{UserUsecase: uc}
}

func writeJSONError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{
		"error": message,
	})
}

func (h *Handler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	var input entity.RegisterInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSONError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Println("Received registration input:", input)

	user := entity.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: input.Password,
	}

	createdUser, err := h.UserUsecase.Register(user)
	if err != nil {
		writeJSONError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	token, err := h.UserUsecase.Login(createdUser.Email, input.Password)
	if err != nil {
		writeJSONError(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"user":  createdUser,
		"token": token,
	}

	createdUser.Password = ""

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) LoginUser(w http.ResponseWriter, r *http.Request) {
	var credentials entity.LoginInput
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		writeJSONError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	token, err := h.UserUsecase.Login(credentials.Email, credentials.Password)
	if err != nil {
		writeJSONError(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	user, err := h.UserUsecase.GetByEmail(credentials.Email)
	if err != nil {
		writeJSONError(w, "Failed to get user data", http.StatusInternalServerError)
		return
	}

	user.Password = ""

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user":  user,
		"token": token,
	})
}

func (h *Handler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(userIDKey)
	if userID == nil {
		writeJSONError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	user, err := h.UserUsecase.GetByID(userID.(uint))
	if err != nil {
		writeJSONError(w, "User not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func (h *Handler) UpdateUserProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(userIDKey)
	if userID == nil {
		writeJSONError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var input entity.User
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSONError(w, "Invalid input", http.StatusBadRequest)
		return
	}

	updatedUser, err := h.UserUsecase.UpdateUser(userID.(uint), input)
	if err != nil {
		writeJSONError(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(updatedUser)
}

func AuthMiddleware(secret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				writeJSONError(w, "Unauthorized — missing or malformed token", http.StatusUnauthorized)
				return
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")

			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method")
				}
				return []byte(secret), nil
			})
			if err != nil || !token.Valid {
				writeJSONError(w, "Unauthorized — invalid token", http.StatusUnauthorized)
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				writeJSONError(w, "Unauthorized — invalid claims", http.StatusUnauthorized)
				return
			}

			userIDFloat, ok := claims["user_id"].(float64)
			if !ok {
				writeJSONError(w, "Unauthorized — invalid user ID", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), userIDKey, uint(userIDFloat))
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
