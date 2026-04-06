package middlewares

import (
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() fiber.Handler {
	return func(c fiber.Ctx) error {
		// Prefer cookie-based JWT, but also accept Authorization: Bearer <token>
		tokenString := c.Cookies("jwt")
		if tokenString == "" {
			// try Authorization header
			authHeader := c.Get("Authorization")
			const prefix = "Bearer "
			if len(authHeader) > len(prefix) && authHeader[:len(prefix)] == prefix {
				tokenString = authHeader[len(prefix):]
			}
		}

		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "กรุณาเข้าสู่ระบบ",
			})
		}

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "กรุณาเข้าสู่ระบบ",
			})
		}

		claims := token.Claims.(jwt.MapClaims)
		c.Locals("user_id", claims["user_id"])
		return c.Next()
	}
}
