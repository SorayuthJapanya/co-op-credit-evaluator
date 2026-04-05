package services

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
)

// GetPublicKPI returns summary KPI data without requiring authentication.
func GetPublicKPI() (*models.PublicKPIResponse, error) {
	var totalMembers int64
	if err := database.DB.Model(&models.Member{}).Count(&totalMembers).Error; err != nil {
		return nil, err
	}

	var totalEvaluations int64
	if err := database.DB.Model(&models.Evaluate{}).Count(&totalEvaluations).Error; err != nil {
		return nil, err
	}

	var totalSharesRaw float64
	if err := database.DB.Model(&models.Member{}).
		Select("COALESCE(SUM(shares_value), 0)").
		Scan(&totalSharesRaw).Error; err != nil {
		return nil, err
	}

	return &models.PublicKPIResponse{
		TotalMembers:     totalMembers,
		TotalEvaluations: totalEvaluations,
		TotalShares:      int64(totalSharesRaw),
	}, nil
}
