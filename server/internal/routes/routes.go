package routes

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/middlewares"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(app fiber.Router) {
	// health routes
	app.Get("/health", func(c fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  "success",
			"message": "OK",
		})
	})

	// api routes
	api := app.Group("/api/v1")

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
}
