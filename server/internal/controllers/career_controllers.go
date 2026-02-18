package controllers

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/services"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

// CareerCategory Controllers

type CreateCareerCategoryRequest struct {
	CategoryName string `json:"categoryName"`
}

type UpdateCareerCategoryRequest struct {
	CategoryName string `json:"categoryName"`
}

func CreateCareerCategory(c fiber.Ctx) error {
	var request CreateCareerCategoryRequest

	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// Validate data
	if request.CategoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณาระบุชื่อหมวดหมู่อาชีพ",
		})
	}

	// Create category
	category, err := services.CreateCareerCategory(request.CategoryName)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "สร้างหมวดหมู่อาชีพสำเร็จ",
		"data":    category,
	})
}

func GetCareerCategories(c fiber.Ctx) error {
	categoryName := c.Query("categoryName")
	searchQuery := c.Query("search")

	categories, err := services.GetCareerCategories(categoryName, searchQuery)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถดึงข้อมูลหมวดหมู่อาชีพได้",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ดึงข้อมูลหมวดหมู่อาชีพสำเร็จ",
		"data":    categories,
	})
}

func GetCareerCategory(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ ID ไม่ถูกต้อง",
		})
	}

	category, err := services.GetCareerCategoryByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "ไม่พบหมวดหมู่อาชีพ",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ดึงข้อมูลหมวดหมู่อาชีพสำเร็จ",
		"data":    category,
	})
}

func UpdateCareerCategory(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ ID ไม่ถูกต้อง",
		})
	}

	var request UpdateCareerCategoryRequest
	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// Validate data
	if request.CategoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณาระบุชื่อหมวดหมู่อาชีพ",
		})
	}

	// Update category
	category, err := services.UpdateCareerCategory(id, request.CategoryName)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "อัพเดทหมวดหมู่อาชีพสำเร็จ",
		"data":    category,
	})
}

func DeleteCareerCategory(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ ID ไม่ถูกต้อง",
		})
	}

	// Delete category
	err = services.DeleteCareerCategory(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ลบหมวดหมู่อาชีพสำเร็จ",
	})
}

// SubCategory Controllers

type CreateSubCategoryRequest struct {
	CategoryID      uuid.UUID `json:"categoryId"`
	SubCategoryName string    `json:"subCategoryName"`
	SubNetProfit    float64   `json:"subNetProfit"`
}

type UpdateSubCategoryRequest struct {
	CategoryID      uuid.UUID `json:"categoryId"`
	SubCategoryName string    `json:"subCategoryName"`
	SubNetProfit    float64   `json:"subNetProfit"`
}

func CreateSubCategory(c fiber.Ctx) error {
	var request CreateSubCategoryRequest

	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// Validate data
	if request.CategoryID == uuid.Nil || request.SubCategoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// Create subcategory
	subCategory, err := services.CreateSubCategory(request.CategoryID, request.SubCategoryName, request.SubNetProfit)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "สร้างหมวดหมู่ย่อยอาชีพสำเร็จ",
		"data":    subCategory,
	})
}

func GetSubCategories(c fiber.Ctx) error {
	subCategories, err := services.GetSubCategories()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถดึงข้อมูลหมวดหมู่ย่อยอาชีพได้",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ดึงข้อมูลหมวดหมู่ย่อยอาชีพสำเร็จ",
		"data":    subCategories,
	})
}

func GetSubCategoriesByCategory(c fiber.Ctx) error {
	categoryIDParam := c.Params("categoryId")
	categoryID, err := uuid.Parse(categoryIDParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ Category ID ไม่ถูกต้อง",
		})
	}

	subCategories, err := services.GetSubCategoriesByCategoryID(categoryID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "ไม่สามารถดึงข้อมูลหมวดหมู่ย่อยอาชีพได้",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ดึงข้อมูลหมวดหมู่ย่อยอาชีพสำเร็จ",
		"data":    subCategories,
	})
}

func GetSubCategory(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ ID ไม่ถูกต้อง",
		})
	}

	subCategory, err := services.GetSubCategoryByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "ไม่พบหมวดหมู่ย่อยอาชีพ",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ดึงข้อมูลหมวดหมู่ย่อยอาชีพสำเร็จ",
		"data":    subCategory,
	})
}

func UpdateSubCategory(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ ID ไม่ถูกต้อง",
		})
	}

	var request UpdateSubCategoryRequest
	if err := c.Bind().Body(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// Validate data
	if request.CategoryID == uuid.Nil || request.SubCategoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "กรุณากรอกข้อมูลให้ครบถ้วน",
		})
	}

	// Update subcategory
	subCategory, err := services.UpdateSubCategory(id, request.CategoryID, request.SubCategoryName, request.SubNetProfit)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "อัพเดทหมวดหมู่ย่อยอาชีพสำเร็จ",
		"data":    subCategory,
	})
}

func DeleteSubCategory(c fiber.Ctx) error {
	idParam := c.Params("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "รูปแบบ ID ไม่ถูกต้อง",
		})
	}

	// Delete subcategory
	err = services.DeleteSubCategory(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "ลบหมวดหมู่ย่อยอาชีพสำเร็จ",
	})
}
