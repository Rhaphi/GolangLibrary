package repository

import (
	"GolangLibrary/internals/entity"

	"gorm.io/gorm"
)

type UserRepository interface {
	Register(user entity.User) error
	GetByEmail(email string) (*entity.User, error)
	GetByID(id uint) (*entity.User, error)
	UpdateUser(id uint, user entity.User) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Register(user entity.User) error {
	return r.db.Create(&user).Error
}

func (r *userRepository) GetByEmail(email string) (*entity.User, error) {
	var user entity.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *userRepository) GetByID(id uint) (*entity.User, error) {
	var user entity.User
	err := r.db.First(&user, id).Error
	return &user, err
}

func (r *userRepository) UpdateUser(id uint, user entity.User) error {
	return r.db.Model(&entity.User{}).Where("id = ?", id).Updates(user).Error
}
