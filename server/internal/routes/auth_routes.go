package routes

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/controllers"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/middlewares"
	"github.com/gofiber/fiber/v3"
)

func setUpAuthRoutes(authRoute fiber.Router) {
	authRoute.Post("/register-admin", controllers.RegisterAdmin)
	authRoute.Post("/login-admin", controllers.LoginAdmin)
}

func setUpAuthWithProtectedRoutes(protectedRoute fiber.Router) {
	protectedRoute.Post("/logout", controllers.Logout)
	protectedRoute.Get("/me", controllers.GetMe)

	// Super Admin endpoints
	protectedRoute.Get("/admins", controllers.GetAdmins, middlewares.SuperAdminMiddleware())
	protectedRoute.Patch("/admins/:id/role", controllers.UpdateAdminRole, middlewares.SuperAdminMiddleware())
	protectedRoute.Get("/evaluate-logs", controllers.GetEvaluateLogs, middlewares.SuperAdminMiddleware())
	protectedRoute.Post("/admins", controllers.CreateAdmin, middlewares.SuperAdminMiddleware())
	protectedRoute.Delete("/admins/:id", controllers.DeleteAdmin, middlewares.SuperAdminMiddleware())
	protectedRoute.Get("/all-evaluates", controllers.GetAllEvaluates, middlewares.SuperAdminMiddleware())
}
