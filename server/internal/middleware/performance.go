package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v3"
)

// PerformanceMiddleware logs slow requests
func PerformanceMiddleware() fiber.Handler {
	return func(c fiber.Ctx) error {
		start := time.Now()
		
		// Process request
		err := c.Next()
		
		// Calculate duration
		duration := time.Since(start)
		
		// Log slow requests (> 1 second)
		if duration > time.Second {
			log.Printf("SLOW REQUEST: %s %s took %v", 
				c.Method(), c.Path(), duration)
		}
		
		// Add performance headers
		c.Set("X-Response-Time", duration.String())
		
		return err
	}
}
