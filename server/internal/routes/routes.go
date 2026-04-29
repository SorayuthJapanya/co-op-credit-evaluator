package routes

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/middlewares"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(app fiber.Router) {
	// docs route
	app.Get("/", ServeAPIDocs)
	
	// health routes
	app.Get("/health", func(c fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "success",
			"message": "OK",
		})
	})

	app.Get("/info", func(c fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "success",
			"message": "Co-op Credit Evaluator API v1.0",
			"version": "1.0",
			"uptime":  "72h34m56s", // Example uptime, replace with actual uptime logic if needed
			"build":   "2024-06-01T12:00:00Z", // Example build time, replace with actual build time logic if needed
		})
	})

	// api routes
	api := app.Group("/api/v1")

	// public routes (no auth required)
	setUpPublicRoutes(api)

	// auth routes
	authRoute := api.Group("/auth")
	setUpAuthRoutes(authRoute)

	// protected routes
	protectedRoute := api.Group("/protected", middlewares.AuthMiddleware())
	setUpAuthWithProtectedRoutes(protectedRoute)

	// career routes (protected)
	careerRoute := protectedRoute.Group("/career")
	setUpCareerRoutes(careerRoute)

	// member routes (protected)
	setUpMemberRoutes(protectedRoute)

	// dashboard routes (protected)
	setUpDashboardRoutes(protectedRoute)

	// dropdown routes (protected)
	setUpDropdownRoutes(protectedRoute)

	// evaluate routes (protected)
	setUpEvaluateRoutes(protectedRoute)
}
