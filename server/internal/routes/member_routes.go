package routes

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/controllers"
	"github.com/gofiber/fiber/v3"
)

func setUpMemberRoutes(protectedRoute fiber.Router) {
	// Member management routes
	memberGroup := protectedRoute.Group("/members")

	// Basic CRUD operations
	memberGroup.Post("/", controllers.CreateMember)      // Create new member
	memberGroup.Get("/", controllers.GetMembers)         // Get all members with optional filters
	memberGroup.Get("/:id", controllers.GetMember)       // Get member by ID
	memberGroup.Put("/:id", controllers.UpdateMember)    // Update member by ID
	memberGroup.Delete("/:id", controllers.DeleteMember) // Delete member by ID

	// Seed operation
	memberGroup.Post("/seed", controllers.SeedMembers) // Seed members from JSON file
}
