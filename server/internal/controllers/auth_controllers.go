package controllers

import (
	"os"
	"strings"
	"time"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/services"
	"github.com/gofiber/fiber/v3"
)

// Register Admin
func RegisterAdmin(c fiber.Ctx) error {
	var request models.AdminRegister

	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลที่จำเป็น",
		})
	}

	// validate data
	if request.Username == "" || request.Password == "" || request.FullName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลที่จำเป็น",
		})
	}

	if len(request.Username) < 13 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกเลขสหกรณ์ให้ถูกต้อง",
		})
	}

	if len(request.Password) < 5 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกรหัสผ่านอย่างน้อย 5 ตัวอักษร",
		})
	}

	// Exists username
	var existingUser models.Admin
	isUsernameExists := database.DB.Where("username = ?", request.Username).First(&existingUser).Error == nil
	if isUsernameExists {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "ชื่อผู้ใช้ถูกใช้แล้ว",
		})
	}

	// Make clean input
	cleanFullname := strings.ReplaceAll(request.FullName, " ", "")

	var count int64
	database.DB.Model(&models.Admin{}).
		Where("REPLACE(full_name, ' ', '') = ?", cleanFullname).
		Count(&count)

	if count > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "ชื่อ-นามสกุลถูกใช้แล้ว",
		})
	}

	// Hash password
	hashedPassword, err := services.HashPassword(request.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "เกิดข้อผิดพลาดในการเข้ารหัส",
		})
	}

	// Create new admin
	newAdmin := models.Admin{
		Username: request.Username,
		Password: hashedPassword,
		FullName: request.FullName,
	}

	// Append to database
	if err := database.DB.Create(&newAdmin).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "เกิดข้อผิดพลาดในการสร้างผู้ใช้",
		})
	}

	// Generate token
	token, err := services.GenerateToken(newAdmin.Id.String())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "เกิดข้อผิดพลาดในการสร้างโทเคน",
		})
	}

	// Set JWT cookie
	go_env := os.Getenv("ENV")
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   go_env == "production", // Set to true in production with HTTPS
		SameSite: fiber.CookieSameSiteLaxMode,
	})

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "สมัครสมาชิกสำเร็จ",
	})
}

func LoginAdmin(c fiber.Ctx) error {
	var request models.AdminLogin

	// Validate data
	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลที่จำเป็น",
		})
	}

	// Find admin
	var admin models.Admin
	if err := database.DB.Where("username = ?", request.Username).First(&admin).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "ไม่พบผู้ใช้",
		})
	}

	// Check password
	if !services.VerifyPassword(request.Password, admin.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
		})
	}

	// Generate token
	token, err := services.GenerateToken(admin.Id.String())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ระบบเกิดข้อผิดพลาด",
		})
	}

	go_env := os.Getenv("ENV")
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   go_env == "production", // Set to true in production with HTTPS
		SameSite: fiber.CookieSameSiteLaxMode,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "เข้าสู่ระบบสำเร็จ",
	})
}

func Logout(c fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-24 * time.Hour),
		HTTPOnly: true,
		Secure:   os.Getenv("ENV") == "production",
		SameSite: fiber.CookieSameSiteLaxMode,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ออกจากระบบสำเร็จ",
	})
}

func GetMe(c fiber.Ctx) error {
	user_id := c.Locals("user_id").(string)

	var user models.Admin
	database.DB.Where("id = ?", user_id).First(&user)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"user": user,
	})
}
