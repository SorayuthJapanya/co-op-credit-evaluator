package routes

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/controllers"
	"github.com/gofiber/fiber/v3"
)

func setUpCareerRoutes(careerRoute fiber.Router) {
	// Career Category routes
	careerRoute.Post("/categories", controllers.CreateCareerCategory)
	careerRoute.Get("/categories", controllers.GetCareerCategories)
	careerRoute.Get("/categories/:id", controllers.GetCareerCategory)
	careerRoute.Put("/categories/:id", controllers.UpdateCareerCategory)
	careerRoute.Delete("/categories/:id", controllers.DeleteCareerCategory)

	// Sub Category routes
	careerRoute.Post("/subcategories", controllers.CreateSubCategory)
	careerRoute.Get("/subcategories", controllers.GetSubCategories)
	careerRoute.Get("/subcategories/:id", controllers.GetSubCategory)
	careerRoute.Get("/categories/:categoryId/subcategories", controllers.GetSubCategoriesByCategory)
	careerRoute.Put("/subcategories/:id", controllers.UpdateSubCategory)
	careerRoute.Delete("/subcategories/:id", controllers.DeleteSubCategory)
}