package routes

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/controllers"
	"github.com/gofiber/fiber/v3"
)

func setUpDashboardRoutes(protectedRoute fiber.Router) {
	// Dashboard routes
	dashboardGroup := protectedRoute.Group("/dashboard")

	// Dashboard data
	dashboardGroup.Get("/overview", controllers.GetDashboardOverview) // Get dashboard data
}
