package services

import (
	"errors"
	"os"
	"time"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"github.com/google/uuid"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}

func VerifyPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GenerateToken(user_id string) (string, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", errors.New("JWT_SECRET environment variable not set")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user_id,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
		"iat":     time.Now().Unix(),
	})

	return token.SignedString([]byte(jwtSecret))
}

func GetAdmins(search string, page int, limit int) ([]models.Admin, int64, error) {
	var admins []models.Admin
	var total int64
	query := database.DB.Model(&models.Admin{})

	if search != "" {
		searchPattern := "%" + search + "%"
		query = query.Where("username ILIKE ? OR full_name ILIKE ?", searchPattern, searchPattern)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&admins).Error; err != nil {
		return nil, 0, err
	}

	return admins, total, nil
}

func UpdateAdminRole(adminID uuid.UUID, role string) (*models.Admin, error) {
	var admin models.Admin
	if err := database.DB.Where("id = ?", adminID).First(&admin).Error; err != nil {
		return nil, err
	}

	admin.Role = role
	admin.UpdatedAt = time.Now()

	if err := database.DB.Save(&admin).Error; err != nil {
		return nil, err
	}

	return &admin, nil
}

func DeleteAdmin(adminID uuid.UUID) error {
	if err := database.DB.Where("id = ?", adminID).Delete(&models.Admin{}).Error; err != nil {
		return err
	}
	return nil
}
