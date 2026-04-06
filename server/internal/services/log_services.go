package services

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
)

func GetEvaluateLogs(search string, page int, limit int) ([]models.EvaluateLog, int64, error) {
	var logs []models.EvaluateLog
	var total int64
	query := database.DB.Model(&models.EvaluateLog{})

	if search != "" {
		searchPattern := "%" + search + "%"
		query = query.Where("username ILIKE ? OR full_name ILIKE ? OR action ILIKE ?", searchPattern, searchPattern, searchPattern)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := query.Order("timestamp DESC").Offset(offset).Limit(limit).Find(&logs).Error; err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}
