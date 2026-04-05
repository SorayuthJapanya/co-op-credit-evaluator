package controllers

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/services"
	"github.com/gofiber/fiber/v3"
)

// GetPublicKPI returns summary stats for the public landing page (no auth).
func GetPublicKPI(c fiber.Ctx) error {
	data, err := services.GetPublicKPI()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get public KPI data",
		})
	}
	return c.JSON(data)
}
