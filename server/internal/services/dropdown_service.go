package services

import (
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
)

// Dropdown Services
func GetFullDropdown() (*models.FullDropdown, error) {
	var subdistricts []string
	if err := database.DB.Model(&models.Member{}).Distinct("subdistrict").Pluck("subdistrict", &subdistricts).Error; err != nil {
		return nil, err
	}
	var districts []string
	if err := database.DB.Model(&models.Member{}).Distinct("district").Pluck("district", &districts).Error; err != nil {
		return nil, err
	}
	var provinces []string
	if err := database.DB.Model(&models.Member{}).Distinct("province").Pluck("province", &provinces).Error; err != nil {
		return nil, err
	}
	return &models.FullDropdown{
		SubDistricts: subdistricts,
		Districts:    districts,
		Provinces:    provinces,
	}, nil
}

func GetSubDistricts() ([]string, error) {
	var subdistricts []string
	if err := database.DB.Model(&models.Member{}).Distinct("subdistrict").Pluck("subdistrict", &subdistricts).Error; err != nil {
		return nil, err
	}
	return subdistricts, nil
}

func GetDistricts() ([]string, error) {
	var districts []string
	if err := database.DB.Model(&models.Member{}).Distinct("district").Pluck("district", &districts).Error; err != nil {
		return nil, err
	}
	return districts, nil
}

func GetProvinces() ([]string, error) {
	var provinces []string
	if err := database.DB.Model(&models.Member{}).Distinct("province").Pluck("province", &provinces).Error; err != nil {
		return nil, err
	}
	return provinces, nil
}