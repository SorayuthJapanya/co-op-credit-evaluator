package main

import (
	"fmt"
	"log"
	"os"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/routes"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No file .env found, relying on system environment variables")
	}

	// Validate required environment variables
	if err := validateEnvironmentVariables(); err != nil {
		log.Fatal("Environment validation failed:", err)
	}

	// Connect to database
	database.Connect()

	// Create app
	app := fiber.New()

	// Middlewares
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", os.Getenv("FRONTEND_URL")},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length", "Content-Type", "X-Frame-Options", "X-XSS-Protection", "X-Content-Type-Options", "X-Permitted-Cross-Domain-Policies"},
	}))

	// Setup routes
	routes.SetupRoutes(app)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

// validateEnvironmentVariables validates all required environment variables
func validateEnvironmentVariables() error {
	requiredVars := map[string]string{
		"JWT_SECRET": "JWT secret for token authentication",
		"DB_DSN":     "Database connection string",
	}

	for varName, description := range requiredVars {
		if value := os.Getenv(varName); value == "" {
			return fmt.Errorf("required environment variable %s is not set (%s)", varName, description)
		}
	}

	// Validate JWT secret length
	jwtSecret := os.Getenv("JWT_SECRET")
	if len(jwtSecret) < 32 {
		return fmt.Errorf("JWT_SECRET must be at least 32 characters long for security")
	}

	return nil
}
