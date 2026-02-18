package routes

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/controllers"
	"github.com/gofiber/fiber/v3"
)

func setUpAuthRoutes(authRoute fiber.Router) {
	authRoute.Post("/register-admin", controllers.RegisterAdmin)
	authRoute.Post("/login-admin", controllers.LoginAdmin)
}

func setUpAuthWithProtectedRoutes(protectedRoute fiber.Router) {
	protectedRoute.Post("/logout", controllers.Logout)
	protectedRoute.Get("/me", controllers.GetMe)
}
