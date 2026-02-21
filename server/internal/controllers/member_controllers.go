package controllers

import (
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/services"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/util"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

// Member Controllers

type CreateMemberRequest struct {
	CooperativeID string  `json:"cooperativeId"`
	IdCard        string  `json:"idCard"`
	AccountYear   string  `json:"accountYear"`
	MemberId      string  `json:"memberId"`
	FullName      string  `json:"fullName"`
	Nationality   string  `json:"nationality"`
	SharesNum     float64 `json:"sharesNum"`
	SharesValue   float64 `json:"sharesValue"`
	JoiningDate   string  `json:"joiningDate"` // Format: YYYY-MM-DD
	MemberType    int64   `json:"memberType"`
	LeavingDate   string  `json:"leavingDate"` // Format: YYYY-MM-DD
	Address       string  `json:"address"`
	Moo           int64   `json:"moo"`
	Subdistrict   string  `json:"subdistrict"`
	District      string  `json:"district"`
	Province      string  `json:"province"`
}

type UpdateMemberRequest struct {
	CooperativeID string  `json:"cooperativeId"`
	IdCard        string  `json:"idCard"`
	AccountYear   string  `json:"accountYear"`
	MemberId      string  `json:"memberId"`
	FullName      string  `json:"fullName"`
	Nationality   string  `json:"nationality"`
	SharesNum     float64 `json:"sharesNum"`
	SharesValue   float64 `json:"sharesValue"`
	JoiningDate   string  `json:"joiningDate"` // Format: YYYY-MM-DD
	MemberType    int64   `json:"memberType"`
	LeavingDate   string  `json:"leavingDate"` // Format: YYYY-MM-DD
	Address       string  `json:"address"`
	Moo           int64   `json:"moo"`
	Subdistrict   string  `json:"subdistrict"`
	District      string  `json:"district"`
	Province      string  `json:"province"`
}

func CreateMember(c fiber.Ctx) error {
	var request CreateMemberRequest

	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	//validate required fields
	if request.IdCard == "" || request.MemberId == "" || request.FullName == "" || request.Nationality == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (เลขบัตรประชาชน, เลขสมาชิก, ชื่อ-นามสกุล, สัญชาติ)",
		})
	}

	// Validate cooperativeId
	if len(request.CooperativeID) != 13 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "เลขทะเบียนสหกรณ์ต้องมี 13 หลัก",
		})
	}

	if len(request.IdCard) != 13 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "เลขบัตรประชาชนไม่ถูกต้อง",
		})
	}

	// Validate accountYear
	if request.AccountYear != "" {
		num, err := strconv.Atoi(request.AccountYear)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "รูปแบบปีบัญชีไม่ถูกต้อง (ต้องเป็น YYYY)",
			})
		}
		numAccountYear := num - 543
		request.AccountYear = strconv.Itoa(numAccountYear)
	}

	// Parse dates
	joiningDate, err := time.Parse("2006-01-02", request.JoiningDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบวันที่เข้าร่วมไม่ถูกต้อง (ต้องเป็น YYYY-MM-DD)",
		})
	}

	leavingDate, err := time.Parse("2006-01-02", request.LeavingDate)
	if err != nil {
		leavingDate = time.Time{} // Use zero time if empty or invalid
	}

	// Create member
	member, err := services.CreateMember(
		request.CooperativeID,
		request.IdCard,
		request.AccountYear,
		request.MemberId,
		request.FullName,
		request.Nationality,
		request.SharesNum,
		request.SharesValue,
		joiningDate,
		request.MemberType,
		leavingDate,
		request.Address,
		request.Moo,
		request.Subdistrict,
		request.District,
		request.Province,
	)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "สร้างข้อมูลสมาชิกสำเร็จ",
		"data":    member,
	})
}

func GetMembers(c fiber.Ctx) error {
	// Get filter parameters from query string
	rawFullName := c.Query("fullName")
	rawSubdistrict := c.Query("subdistrict")
	rawDistrict := c.Query("district")
	rawProvince := c.Query("province")

	// Get pagination parameters
	page := c.Query("page", "1")
	limit := c.Query("limit", "10")

	// Validate filter parameter
	fullName := util.ValidateAllToEmpty(rawFullName)
	subdistrict := util.ValidateAllToEmpty(rawSubdistrict)
	district := util.ValidateAllToEmpty(rawDistrict)
	province := util.ValidateAllToEmpty(rawProvince)

	// Parse pagination parameters
	pageNum, err := strconv.Atoi(page)
	if err != nil || pageNum < 1 {
		pageNum = 1
	}

	limitNum, err := strconv.Atoi(limit)
	if err != nil || limitNum < 1 {
		limitNum = 20
	}

	// If no filters provided, return all members with pagination
	if fullName == "" && subdistrict == "" && district == "" && province == "" {
		members, total, err := services.GetMembersWithPagination(pageNum, limitNum)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "ไม่สามารถดึงข้อมูลสมาชิกได้",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "ดึงข้อมูลสมาชิกสำเร็จ",
			"data":    members,
			"pagination": fiber.Map{
				"page":       pageNum,
				"limit":      limitNum,
				"total":      total,
				"totalPages": (int(total) + limitNum - 1) / limitNum,
			},
		})
	}

	// Apply filters with pagination
	members, total, err := services.GetMembersWithFiltersAndPagination(fullName, subdistrict, district, province, pageNum, limitNum)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถดึงข้อมูลสมาชิกได้",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ดึงข้อมูลสมาชิกสำเร็จ",
		"data":    members,
		"pagination": fiber.Map{
			"page":       pageNum,
			"limit":      limitNum,
			"total":      total,
			"totalPages": (int(total) + limitNum - 1) / limitNum,
		},
	})
}

func GetMember(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ ID ไม่ถูกต้อง",
		})
	}

	member, err := services.GetMemberByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "ไม่พบข้อมูลสมาชิก",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ดึงข้อมูลสมาชิกสำเร็จ",
		"data":    member,
	})
}

func SeedMembers(c fiber.Ctx) error {
	filePath := c.Query("file")
	if filePath == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณาระบุุพธิไฟล์ที่ต้องการ seed (parameter: file)",
		})
	}

	// Validate file path to prevent path traversal attacks
	if !isValidSeedFilePath(filePath) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "พาธไฟล์ไม่ถูกต้องหรือไม่อนุญาตให้เข้าถึง",
		})
	}

	if err := services.SeedMembersFromJSON(filePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถ seed ข้อมูลสมาชิกได้",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "seed ข้อมูลสมาชิกสำเร็จ",
	})
}

func UpdateMember(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ ID ไม่ถูกต้อง",
		})
	}

	var request UpdateMemberRequest
	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// Validate required fields
	if request.IdCard == "" || request.MemberId == "" || request.FullName == "" || request.Nationality == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (เลขบัตรประชาชน, เลขสมาชิก, ชื่อ-นามสกุล, สัญชาติ)",
		})
	}

	// Validate cooperativeId
	if len(request.CooperativeID) != 13 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "เลขทะเบียนสหกรณ์ต้องมี 13 หลัก",
		})
	}

	if len(request.IdCard) != 13 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "เลขบัตรประชาชนไม่ถูกต้อง",
		})
	}

	// Validate accountYear
	if request.AccountYear != "" {
		num, err := strconv.Atoi(request.AccountYear)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "รูปแบบปีบัญชีไม่ถูกต้อง (ต้องเป็น YYYY)",
			})
		}
		numAccountYear := num - 543
		request.AccountYear = strconv.Itoa(numAccountYear)
	}

	// Parse dates
	joiningDate, err := time.Parse("2006-01-02", request.JoiningDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบวันที่เข้าร่วมไม่ถูกต้อง (ต้องเป็น YYYY-MM-DD)",
		})
	}

	leavingDate, err := time.Parse("2006-01-02", request.LeavingDate)
	if err != nil {
		leavingDate = time.Time{} // Use zero time if empty or invalid
	}

	// Update member
	member, err := services.UpdateMember(
		id,
		request.CooperativeID,
		request.IdCard,
		request.AccountYear,
		request.MemberId,
		request.FullName,
		request.Nationality,
		request.SharesNum,
		request.SharesValue,
		joiningDate,
		request.MemberType,
		leavingDate,
		request.Address,
		request.Moo,
		request.Subdistrict,
		request.District,
		request.Province,
	)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "อัพเดทข้อมูลสมาชิกสำเร็จ",
		"data":    member,
	})
}

func DeleteMember(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ ID ไม่ถูกต้อง",
		})
	}

	// Delete member
	err = services.DeleteMember(id)
	if err != nil {
		if err.Error() == "ไม่พบข้อมูลสมาชิก" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": err.Error(),
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ลบข้อมูลสมาชิกสำเร็จ",
	})
}

// isValidSeedFilePath validates the file path to prevent path traversal attacks
func isValidSeedFilePath(filePath string) bool {
	// Clean the path to resolve any relative components
	cleanPath := filepath.Clean(filePath)

	// Check for path traversal attempts
	if strings.Contains(cleanPath, "..") {
		return false
	}

	// Only allow .json files
	if !strings.HasSuffix(strings.ToLower(cleanPath), ".json") {
		return false
	}

	// Define allowed directories (you can customize this)
	allowedDirs := []string{
		"./seed-data",
		"./data",
		"./uploads",
		"./temp",
	}

	// Check if the file is in an allowed directory
	for _, allowedDir := range allowedDirs {
		if strings.HasPrefix(cleanPath, allowedDir) {
			return true
		}
	}

	// If no directories match, only allow files in current directory
	if !strings.Contains(cleanPath, "/") && !strings.Contains(cleanPath, "\\") {
		return true
	}

	return false
}
