package controllers

import (
	"fmt"
	"strconv"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/services"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

func CreateEvaluate(c fiber.Ctx) error {
	idParam := c.Locals("user_id").(string)
	user_id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ user_id ไม่ถูกต้อง",
		})
	}

	var request models.EvaluateRequest
	fmt.Println("Hello1")
	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// validate required fields
	if request.EvaluateType == "" || request.MarginType == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// validate name and IcCard
	for _, applicant := range request.Applicants {
		if applicant.Name == "" || applicant.IDCard == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
			})
		}

		if len(applicant.IDCard) != 13 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "เลขบัตรประชาชนไม่ถูกต้อง",
			})
		}
	}

	// Create evaluate
	evaluate, err := services.CreateEvaluate(user_id, &request)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "เกิดข้อผิดพลาดในการสร้างการประเมิน",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "สร้างการประเมินสำเร็จ",
		"data":    evaluate,
	})
}

func GetEvaluates(c fiber.Ctx) error {
	userIDStr := c.Locals("user_id").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ user ID ไม่ถูกต้อง",
		})
	}

	// Get query parameters
	search := c.Query("search", "")
	pageStr := c.Query("page", "1")
	limitStr := c.Query("limit", "10")

	// Parse pagination parameters
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	// Call service
	evaluates, total, err := services.GetEvaluates(search, userID, page, limit)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถดึงข้อมูลการประเมินได้",
		})
	}

	// Calculate pagination info
	totalPages := (total + int64(limit) - 1) / int64(limit)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ดึงข้อมูลการประเมินสำเร็จ",
		"data":    evaluates,
		"pagination": fiber.Map{
			"page":       page,
			"limit":      limit,
			"total":      total,
			"totalPages": totalPages,
		},
	})
}

func GetEvaluate(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ id ไม่ถูกต้อง",
		})
	}

	userIDStr := c.Locals("user_id").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ user ID ไม่ถูกต้อง",
		})
	}

	evaluate, err := services.GetEvaluateByEvaluateID(id, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถดึงข้อมูลการประเมินได้",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ดึงข้อมูลการประเมินสำเร็จ",
		"data":    evaluate,
	})
}

func UpdateEvaluate(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ id ไม่ถูกต้อง",
		})
	}

	userIDStr := c.Locals("user_id").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ user ID ไม่ถูกต้อง",
		})
	}

	var request models.EvaluateRequest
	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// validate required fields
	if request.EvaluateType == "" || request.MarginType == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// validate name and IDCard
	for _, applicant := range request.Applicants {
		if applicant.Name == "" || applicant.IDCard == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
			})
		}

		if len(applicant.IDCard) != 13 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "เลขบัตรประชาชนไม่ถูกต้อง",
			})
		}
	}

	evaluate, err := services.UpdateEvaluate(id, userID, &request)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถอัปเดตข้อมูลการประเมินได้",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "อัปเดตข้อมูลการประเมินสำเร็จ",
		"data":    evaluate,
	})
}

func DeleteEvaluate(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ id ไม่ถูกต้อง",
		})
	}

	userIDStr := c.Locals("user_id").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ user ID ไม่ถูกต้อง",
		})
	}

	err = services.DeleteEvaluate(id, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถลบข้อมูลการประเมินได้",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ลบข้อมูลการประเมินสำเร็จ",
	})
}
