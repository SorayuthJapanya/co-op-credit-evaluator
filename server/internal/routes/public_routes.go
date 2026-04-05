package routes

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/controllers"
	"github.com/gofiber/fiber/v3"
)

func setUpPublicRoutes(api fiber.Router) {
	public := api.Group("/public")

	// Public KPI for the landing page (no auth required)
	public.Get("/kpi", controllers.GetPublicKPI)
}
