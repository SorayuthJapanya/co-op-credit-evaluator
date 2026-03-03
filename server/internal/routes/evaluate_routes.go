package routes

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/controllers"
	"github.com/gofiber/fiber/v3"
)

func setUpEvaluateRoutes(protectedRoute fiber.Router) {
	// Evaluate management routes
	evaluateGroup := protectedRoute.Group("/evaluates")

	// Basic CRUD operations
	evaluateGroup.Post("/", controllers.CreateEvaluate) // Create new evaluate
	evaluateGroup.Get("/", controllers.GetEvaluates)    // Get all evaluates
	evaluateGroup.Get("/:id", controllers.GetEvaluate)  // Get evaluate by ID
	evaluateGroup.Put("/:id", controllers.UpdateEvaluate) // Update evaluate by ID
	evaluateGroup.Delete("/:id", controllers.DeleteEvaluate) // Delete evaluate by ID
}
