package controllers

import (
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/google/uuid"
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
			"message": "กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง",
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
			"message": "เลขบัตรประชาชนนี้ถูกใช้แล้ว",
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

	// is production
	isProd := os.Getenv("ENV") == "production"

	// cookie settings
	sameSite := fiber.CookieSameSiteNoneMode
	secure := isProd

	// development settings
	if !isProd {
		sameSite = fiber.CookieSameSiteLaxMode
		secure = false
	}

	// Set cookie
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		Path:     "/",
		Secure:   secure,
		HTTPOnly: true,
		SameSite: sameSite,
	})

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "สมัครสมาชิกสำเร็จ",
		"data":    newAdmin,
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
			"message": "เลขบัตรประชาชนหรือรหัสผ่านไม่ถูกต้อง",
		})
	}

	// Check password
	if !services.VerifyPassword(request.Password, admin.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "เลขบัตรประชาชนหรือรหัสผ่านไม่ถูกต้อง",
		})
	}

	// Generate token
	token, err := services.GenerateToken(admin.Id.String())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ระบบเกิดข้อผิดพลาด",
		})
	}

	// is production
	isProd := os.Getenv("ENV") == "production"

	// cookie settings
	sameSite := fiber.CookieSameSiteNoneMode
	secure := isProd

	// development settings
	if !isProd {
		sameSite = fiber.CookieSameSiteLaxMode
		secure = false
	}

	// Set cookie
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		Path:     "/",
		Secure:   secure,
		HTTPOnly: true,
		SameSite: sameSite,
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "เข้าสู่ระบบสำเร็จ",
		"data":    admin,
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

func GetAdmins(c fiber.Ctx) error {
	search := c.Query("search", "")
	pageStr := c.Query("page", "1")
	limitStr := c.Query("limit", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	admins, total, err := services.GetAdmins(search, page, limit)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถดึงข้อมูลแอดมินได้",
		})
	}

	totalPages := (total + int64(limit) - 1) / int64(limit)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ดึงข้อมูลแอดมินสำเร็จ",
		"data":    admins,
		"pagination": fiber.Map{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": totalPages,
		},
	})
}

func UpdateAdminRole(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ id ไม่ถูกต้อง",
		})
	}

	var request models.AdminUpdateRoleRequest
	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลที่จำเป็น",
		})
	}

	if request.Role != "ADMIN" && request.Role != "SUPER_ADMIN" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "สิทธิ์ไม่ถูกต้อง",
		})
	}

	admin, err := services.UpdateAdminRole(id, request.Role)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถอัปเดตสิทธิ์ได้",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "อัปเดตสิทธิ์สำเร็จ",
		"data":    admin,
	})
}

func CreateAdmin(c fiber.Ctx) error {
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
			"message": "กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง",
		})
	}

	if len(request.Password) < 5 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกรหัสผ่านอย่างน้อย 5 ตัวอักษร",
		})
	}

	// Exists username
	var existingUser models.Admin
	if err := database.DB.Where("username = ?", request.Username).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "เลขบัตรประชาชนนี้ถูกใช้แล้ว",
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
		Role:     "ADMIN",
	}

	// Append to database
	if err := database.DB.Create(&newAdmin).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "เกิดข้อผิดพลาดในการสร้างผู้ใช้",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "เพิ่มผู้ใช้งานสำเร็จ",
		"data":    newAdmin,
	})
}


func DeleteAdmin(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ id ไม่ถูกต้อง",
		})
	}

	if err := services.DeleteAdmin(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถลบผู้ใช้งานได้",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ลบผู้ใช้งานสำเร็จ",
	})
}
