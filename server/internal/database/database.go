package database

import (
	"log"
	"os"
	_ "time/tzdata"

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

	// Configure connection pool for better performance
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent), // Change to Silent in production
	})

	if err != nil {
		log.Fatal("failed to connect database", err)
	}

	log.Println("Connect to database successfully")

	DB = db

	// Configure connection pool
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("failed to get underlying sql.DB", err)
	}

	// Set connection pool settings
	sqlDB.SetMaxOpenConns(25)               // Maximum number of open connections
	sqlDB.SetMaxIdleConns(5)                // Maximum number of idle connections
	sqlDB.SetConnMaxLifetime(5 * 60 * 1000) // Maximum lifetime of a connection in milliseconds

	// Only run migrations in development or when explicitly requested
	env := os.Getenv("ENV")
	if env != "production" {
		log.Println("Running database migrations...")
		db.AutoMigrate(&models.Admin{})
		db.AutoMigrate(&models.CareerCategory{})
		db.AutoMigrate(&models.SubCategory{})
		db.AutoMigrate(&models.Member{})
		db.AutoMigrate(&models.Evaluate{})
		db.AutoMigrate(&models.Applicant{})
		db.AutoMigrate(&models.EvaluateResult{})
		db.AutoMigrate(&models.ResultApplicant{})
		log.Println("Database migrations completed")
	} else {
		log.Println("Production mode: Skipping auto-migrations")
	}

	// Create performance indexes for production
	CreateIndexes()
}
