package services

import (
	"errors"
	"strings"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CareerCategory Services

func CreateCareerCategory(categoryName string) (*models.CareerCategory, error) {
	cleanCategoryName := strings.ReplaceAll(categoryName, " ", "")

	// Check if category name already exists
	var existingCategory models.CareerCategory
	if err := database.DB.Where("REPLACE(category_name, ' ', '') = ?", cleanCategoryName).First(&existingCategory).Error; err == nil {
		return nil, errors.New("ชื่อหมวดหมู่อาชีพนี้มีอยู่แล้ว")
	}

	// Create new category
	category := models.CareerCategory{
		CategoryName: categoryName,
	}

	if err := database.DB.Create(&category).Error; err != nil {
		return nil, err
	}

	return &category, nil
}

func GetCareerCategories(categoryNameFilter string, searchQuery string) ([]models.CareerCategory, error) {
	var categories []models.CareerCategory

	query := database.DB.Model(&models.CareerCategory{})

	if categoryNameFilter != "" {
		cleanFilter := strings.ReplaceAll(categoryNameFilter, " ", "")
		query = query.Where("REPLACE(category_name, ' ', '') LIKE ?", "%"+cleanFilter+"%")
	}

	if searchQuery != "" {
		cleanSearch := strings.ReplaceAll(searchQuery, " ", "")

		var matchingCategoryIDs []uuid.UUID

		subQuery := database.DB.Model(&models.SubCategory{}).
			Select("DISTINCT category_id").
			Where("REPLACE(sub_category_name, ' ', '') LIKE ?", "%"+cleanSearch+"%")

		if err := subQuery.Pluck("category_id", &matchingCategoryIDs).Error; err != nil {
			return nil, err
		}

		if len(matchingCategoryIDs) == 0 {
			return []models.CareerCategory{}, nil
		}

		query = query.Where("id IN ?", matchingCategoryIDs)

		query = query.Preload("SubCategory", func(db *gorm.DB) *gorm.DB {
			return db.Where("REPLACE(sub_category_name, ' ', '') LIKE ?", "%"+cleanSearch+"%")
		})

	} else {
		query = query.Preload("SubCategory")
	}

	if err := query.Order("category_name ASC").Find(&categories).Error; err != nil {
		return nil, err
	}

	return categories, nil
}

func UpdateCareerCategory(id uuid.UUID, categoryName string) (*models.CareerCategory, error) {
	var category models.CareerCategory
	if err := database.DB.First(&category, "id = ?", id).Error; err != nil {
		return nil, errors.New("ไม่พบหมวดหมู่อาชีพ")
	}

	cleanCategoryName := strings.ReplaceAll(categoryName, " ", "")

	// Check if new category name already exists (excluding current category)
	var existingCategory models.CareerCategory
	if err := database.DB.Where("REPLACE(category_name, ' ', '') = ? AND id != ?", cleanCategoryName, id).First(&existingCategory).Error; err == nil {
		return nil, errors.New("ชื่อหมวดหมู่อาชีพนี้มีอยู่แล้ว")
	}

	// Update category
	category.CategoryName = categoryName
	if err := database.DB.Save(&category).Error; err != nil {
		return nil, err
	}

	return &category, nil
}

func DeleteCareerCategory(id uuid.UUID) error {
	// Delete subcategories
	if err := database.DB.Delete(&models.SubCategory{}, "category_id = ?", id).Error; err != nil {
		return err
	}

	// Delete category
	if err := database.DB.Delete(&models.CareerCategory{}, "id = ?", id).Error; err != nil {
		return err
	}

	return nil
}

func CareerCategoryExists(id uuid.UUID) bool {
	var category models.CareerCategory
	return database.DB.First(&category, "id = ?", id).Error == nil
}

// SubCategory Services

func CreateSubCategory(categoryID uuid.UUID, subCategoryName string, subNetProfit float64) (*models.SubCategory, error) {
	// Check if category exists
	if !CareerCategoryExists(categoryID) {
		return nil, errors.New("ไม่พบหมวดหมู่อาชีพ")
	}

	// Create new subcategory
	subCategory := models.SubCategory{
		CategoryID:      categoryID,
		SubCategoryName: subCategoryName,
		SubNetProfit:    subNetProfit,
	}

	if err := database.DB.Create(&subCategory).Error; err != nil {
		return nil, err
	}

	return &subCategory, nil
}

func GetSubCategoriesByCategoryID(categoryID uuid.UUID, page, limit int, search string) ([]models.SubCategory, int64, error) {
	var subCategories []models.SubCategory
	var total int64

	offset := (page - 1) * limit

	query := database.DB.Model(&models.SubCategory{}).Where("category_id = ?", categoryID)

	if search != "" {
		cleanSearch := strings.ReplaceAll(search, " ", "")
		query = query.Where("REPLACE(sub_category_name, ' ', '') LIKE ?", "%"+cleanSearch+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Offset(offset).Limit(limit).Find(&subCategories).Error; err != nil {
		return nil, 0, err
	}

	return subCategories, total, nil
}

func UpdateSubCategory(id uuid.UUID, categoryID uuid.UUID, subCategoryName string, subNetProfit float64) (*models.SubCategory, error) {
	var subCategory models.SubCategory
	if err := database.DB.First(&subCategory, "id = ?", id).Error; err != nil {
		return nil, errors.New("ไม่พบหมวดหมู่ย่อยอาชีพ")
	}

	// Check if category exists
	if !CareerCategoryExists(categoryID) {
		return nil, errors.New("ไม่พบหมวดหมู่อาชีพ")
	}

	cleanSubCategoryName := strings.ReplaceAll(subCategoryName, " ", "")

	// Check if new subcategory name already exists (excluding current subcategory)
	var existingSubCategory models.SubCategory
	if err := database.DB.Where("REPLACE(sub_category_name, ' ', '') = ? AND id != ?", cleanSubCategoryName, id).First(&existingSubCategory).Error; err == nil {
		return nil, errors.New("ชื่อหมวดหมู่ย่อยอาชีพนี้มีอยู่แล้ว")
	}

	// Update subcategory
	subCategory.CategoryID = categoryID
	subCategory.SubCategoryName = subCategoryName
	subCategory.SubNetProfit = subNetProfit
	if err := database.DB.Save(&subCategory).Error; err != nil {
		return nil, err
	}

	return &subCategory, nil
}

func DeleteSubCategory(id uuid.UUID) error {
	// Delete subcategory
	if err := database.DB.Delete(&models.SubCategory{}, "id = ?", id).Error; err != nil {
		return err
	}

	return nil
}

func SubCategoryExists(id uuid.UUID) bool {
	var subCategory models.SubCategory
	return database.DB.First(&subCategory, "id = ?", id).Error == nil
}
