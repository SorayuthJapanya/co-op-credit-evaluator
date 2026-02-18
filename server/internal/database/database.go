package database

import (
	"log"
	"os"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
	dsn := os.Getenv("DB_DSN")

	if dsn == "" {
		log.Fatal("DB_DSN is not set")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("failed to connect database", err)
	}

	log.Println("Connect to database successfully")

	DB = db
	db.AutoMigrate(&models.Admin{})
	db.AutoMigrate(&models.CareerCategory{})
	db.AutoMigrate(&models.SubCategory{})
	db.AutoMigrate(&models.Member{})
}
