package database

import (
	"GolangLibrary/internals/entity"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=muhammad.aditya password=Rafif51512525 dbname=muhammad.aditya port=5432 sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		log.Fatal("Failed to connect:", err)
	}
	DB = db

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get SQL DB", err)
	}

	sqlDB.SetMaxIdleConns(25)
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)

	err = DB.AutoMigrate(&entity.Book{}, &entity.User{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	err = DB.Exec(`CREATE INDEX IF NOT EXISTS idx_book_title ON books (title)`).Error
	if err != nil {
		log.Fatal("Failed to create index on books:", err)
	}
	err = DB.Exec(`CREATE INDEX IF NOT EXISTS idx_book_author_lower ON books (LOWER(title))`).Error
	if err != nil {
		log.Fatal("Failed to create title lower", err)
	}
	err = DB.Exec(`CREATE INDEX IF NOT EXISTS idx_book_title_author ON books (title, author)`).Error
	if err != nil {
		log.Fatal("Failed to create title author index:", err)

	}

}
