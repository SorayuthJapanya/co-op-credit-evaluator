package middlewares

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"github.com/gofiber/fiber/v3"
)

func SuperAdminMiddleware() fiber.Handler {
	return func(c fiber.Ctx) error {
		userIDStr, ok := c.Locals("user_id").(string)
		if !ok || userIDStr == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "กรุณาเข้าสู่ระบบ",
			})
		}

		var admin models.Admin
		if err := database.DB.Where("id = ?", userIDStr).First(&admin).Error; err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "ไม่พบผู้ใช้งาน",
			})
		}

		if admin.Role != "SUPER_ADMIN" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"message": "ไม่มีสิทธิ์ในการเข้าถึงข้อมูลส่วนนี้",
			})
		}

		// Store admin info in context for possible reuse in controllers
		c.Locals("current_admin", admin)

		return c.Next()
	}
}
