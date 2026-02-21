package routes

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/controllers"
	"github.com/gofiber/fiber/v3"
)

func setUpDropdownRoutes(protectedRoute fiber.Router) {
	// Dropdown routes
	dropdownGroup := protectedRoute.Group("/dropdown")

	// Dropdown data
	dropdownGroup.Get("/full", controllers.GetFullDropdown) // Get full dropdown
	dropdownGroup.Get("/subdistricts", controllers.GetSubDistricts)  // Get subdistricts for dropdown
	dropdownGroup.Get("/districts", controllers.GetDistricts)    // Get districts for dropdown
	dropdownGroup.Get("/provinces", controllers.GetProvinces)    // Get provinces for dropdown
}