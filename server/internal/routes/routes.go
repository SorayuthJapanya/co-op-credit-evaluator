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

	app.Get("/healthy", func(c fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "success",
			"message": "This is api for co-op credit evaluator",
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
