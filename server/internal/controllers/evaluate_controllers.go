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

// ExportEvaluate returns a rendered HTML representation of the evaluation
// that can be printed or saved as PDF by the browser.
func ExportEvaluate(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid id")
	}

	userIDStr := c.Locals("user_id").(string)
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid user id")
	}

	evaluate, err := services.GetEvaluateByEvaluateID(id, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Cannot fetch evaluate")
	}

	// Build simple HTML output
	html := "<html><head><meta charset=\"utf-8\"/><title>Export Evaluate</title>"
	html += "<style>body{font-family:Arial,Helvetica,sans-serif;color:#111827;padding:20px}h1,h2,h3{color:#0f172a}.metrics{display:flex;gap:12px;margin-bottom:16px}.metric{padding:12px;border:1px solid #e5e7eb;border-radius:8px}.section{margin-bottom:18px}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6}.row:last-child{border-bottom:none}</style>"
	html += "</head><body>"
	html += fmt.Sprintf("<h1>ผลการประเมิน: %s</h1>", evaluate.EvaluateType)
	html += fmt.Sprintf("<h3>เกณฑ์: %s</h3>", evaluate.MarginType)

	html += "<div class=\"metrics\">"
	html += fmt.Sprintf("<div class=\"metric\"><div style=\"font-size:12px;color:#374151;\">DTI</div><div style=\"font-weight:700;font-size:20px;color:#047857;\">%0.2f %%</div></div>", evaluate.Result.Dti)
	html += fmt.Sprintf("<div class=\"metric\"><div style=\"font-size:12px;color:#374151;\">DSCR</div><div style=\"font-weight:700;font-size:20px;color:#0ea5e9;\">%0.2f เท่า</div></div>", evaluate.Result.Dscr)
	html += fmt.Sprintf("<div class=\"metric\"><div style=\"font-size:12px;color:#374151;\">ภาระหนี้รวม</div><div style=\"font-weight:700;font-size:20px;color:#dc2626;\">฿ %0.2f</div></div>", evaluate.Result.DebtDetail.TotalDebt)
	html += "</div>"

	html += "<div class=\"section\"><h2>ผู้กู้</h2>"
	for _, a := range evaluate.Result.Applicants {
		html += "<div style=\"margin-bottom:8px;padding:10px;border:1px solid #e6e7eb;border-radius:8px;\">"
		html += fmt.Sprintf("<div class=\"row\"><div>ชื่อ</div><div>%s</div></div>", a.Name)
		html += fmt.Sprintf("<div class=\"row\"><div>เลขบัตร</div><div>%s</div></div>", a.IDCard)
		html += fmt.Sprintf("<div class=\"row\"><div>รายได้รวม</div><div>฿ %0.2f</div></div>", a.TotalSalary)
		html += fmt.Sprintf("<div class=\"row\"><div>รวมค่าใช้จ่าย</div><div>฿ %0.2f</div></div>", a.TotalExpenses)
		html += "</div>"
	}
	html += "</div>"

	html += "<div style=\"margin-top:24px;font-size:12px;color:#6b7280\">พิมพ์หรือบันทึกเป็น PDF โดยใช้ตัวเลือกของเบราว์เซอร์</div>"
	html += "</body></html>"

	c.Set("Content-Type", "text/html; charset=utf-8")
	return c.SendString(html)
}
