package usecase

import (
	"errors"

	"GolangLibrary/internals/entity"
	"GolangLibrary/internals/repository"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"golang.org/x/crypto/bcrypt"
)

type UserUsecase struct {
	repo      repository.UserRepository
	jwtSecret string
}

func NewUserUsecase(repo repository.UserRepository, jwtSecret string) *UserUsecase {
	return &UserUsecase{
		repo:      repo,
		jwtSecret: jwtSecret,
	}
}

func (uc *UserUsecase) Register(user entity.User) (*entity.User, error) {
	log.Println("RAW password before hashing:", user.Password)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Hashing error:", err)
		return nil, err
	}
	user.Password = string(hashedPassword)

	log.Println("REGISTER — Hashed password:", user.Password)

	err = uc.repo.Register(user)
	if err != nil {
		log.Println("Repo.Register() error:", err)
		return nil, err
	}

	createdUser, err := uc.repo.GetByEmail(user.Email)
	if err != nil {
		log.Println("Repo.GetByEmail() error:", err)
		return nil, err
	}

	return createdUser, nil
}

func (uc *UserUsecase) GetByEmail(email string) (*entity.User, error) {
	return uc.repo.GetByEmail(email)
}

func (uc *UserUsecase) Login(email, password string) (string, error) {
	user, err := uc.repo.GetByEmail(email)
	if err != nil {
		log.Println("Login error — user not found:", err)
		return "", err
	}

	log.Println("Stored hashed password:", user.Password)
	log.Println("Stored user:", user.Email)
	log.Println("Entered password:", password)

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		log.Println("Password comparison failed:", err)
		return "", errors.New("invalid credentials")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(72 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(uc.jwtSecret))
	if err != nil {
		log.Println("JWT signing error:", err)
		return "", err
	}

	return tokenString, nil
}

func (uc *UserUsecase) GetByID(id uint) (*entity.User, error) {
	return uc.repo.GetByID(id)
}

func (uc *UserUsecase) UpdateUser(id uint, input entity.User) (*entity.User, error) {
	err := uc.repo.UpdateUser(id, input)
	if err != nil {
		return nil, err
	}

	updatedUser, err := uc.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	return updatedUser, nil
}

func (uc *UserUsecase) JwtSecretString() string {
	return uc.jwtSecret
}
