package services

import (
	"fmt"
	"math"
	"time"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"gorm.io/gorm"
)

// KPI Dashboard Services

func GetKPIDashboard(accountYear, subdistrict string) (*models.KPIDashboardResponse, error) {

	// TODO: Implement KPI dashboard logic
	// 1. Get total members
	totalMembers, err := GetTotalMembers(accountYear, subdistrict)
	if err != nil {
		return nil, fmt.Errorf("failed to get total members: %w", err)
	}

	// 2. Get total shares amount
	totalShares, err := GetTotalShares(accountYear, subdistrict)
	if err != nil {
		return nil, fmt.Errorf("failed to get total shares: %w", err)
	}

	// 3. Get average shares per member
	averageShares := GetAverageSharesPerPerson(totalShares, totalMembers)

	// 4. Members of this year
	membersOfThisYear, err := GetMembersOfThisYear()
	if err != nil {
		return nil, fmt.Errorf("failed to get members of this year: %w", err)
	}

	return &models.KPIDashboardResponse{
		TotalMembers:           totalMembers,
		TotalShares:            totalShares,
		AverageSharesPerPerson: averageShares,
		MembersThisYear:        membersOfThisYear,
	}, nil
}

func GetTotalMembers(accountYear, subdistrict string) (int64, error) {
	// TODO: Implement logic to get total members
	query := database.DB.Model(&models.Member{})

	// Apply filters
	if accountYear != "" {
		query = query.Where("account_year = ?", accountYear)
	}
	if subdistrict != "" {
		query = query.Where("subdistrict ILIKE ?", "%"+subdistrict+"%")
	}

	var count int64
	if err := query.Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func GetTotalShares(accountYear, subdistrict string) (float64, error) {
	// TODO: Implement logic to get total shares
	query := database.DB.Model(&models.Member{})

	// Apply filters
	if accountYear != "" {
		query = query.Where("account_year = ?", accountYear)
	}
	if subdistrict != "" {
		query = query.Where("subdistrict ILIKE ?", "%"+subdistrict+"%")
	}

	var totalShares float64
	if err := query.Select("COALESCE(SUM(shares_value), 0)").Scan(&totalShares).Error; err != nil {
		return 0, err
	}
	return totalShares, nil
}

func GetAverageSharesPerPerson(totalShares float64, totalMembers int64) float64 {
	// TODO: Implement logic to get average shares per person
	if totalMembers == 0 {
		return 0
	}
	avg := totalShares / float64(totalMembers)
	return math.Round(avg*100) / 100
}

func GetMembersOfThisYear() (models.MembersThisYearStats, error) {
	// TODO: Implement logic to get members of this year
	now := time.Now()
	currentYear := now.Format("2006")
	lastYear := now.AddDate(-1, 0, 0).Format("2006")

	var currentCount, lastCount int64

	// 1. Get Current Year Count
	if err := database.DB.Model(&models.Member{}).
		Where("EXTRACT(YEAR FROM joining_date) = ?", currentYear).
		Count(&currentCount).Error; err != nil {
		return models.MembersThisYearStats{}, err
	}

	// 2. Get Last Year Count
	if err := database.DB.Model(&models.Member{}).
		Where("EXTRACT(YEAR FROM joining_date) = ?", lastYear).
		Count(&lastCount).Error; err != nil {
		return models.MembersThisYearStats{}, err
	}

	return models.MembersThisYearStats{
		CurrentCount:  currentCount,
		LastYearCount: lastCount,
		MemberChange:  currentCount - lastCount,
	}, nil
}

// Chart Dashboard Services

func GetMembershipGrowthChart() (*models.MembershipGrowthDataResponse, error) {
	// TODO: Implement logic to get membership growth chart
	data, err := GetMembershipGrowth()
	if err != nil {
		return nil, err
	}
	return &models.MembershipGrowthDataResponse{
		Data: data,
	}, nil
}

func GetMembershipGrowth() ([]models.MembershipGrowthData, error) {
	// TODO: Implement logic to get membership growth
	var growthData []models.MembershipGrowthData

	query := `
		SELECT 
			EXTRACT(YEAR FROM m.joining_date)::int + 543 as year, 
			COUNT(*) as count
		FROM members m 
		WHERE m.joining_date IS NOT NULL
		GROUP BY EXTRACT(YEAR FROM m.joining_date)
		ORDER BY year ASC
	`

	if err := database.DB.Raw(query).Scan(&growthData).Error; err != nil {
		return nil, err
	}

	return growthData, nil
}

func GetMembershipCountBySubdistrictChart(accountYear string) (*models.MembershipCountBySubdistrictDataResponse, error) {
	// TODO: Implement logic to get membership count by subdistrict chart
	data, err := GetMembershipCountBySubdistrict(accountYear)
	if err != nil {
		return nil, err
	}
	return &models.MembershipCountBySubdistrictDataResponse{
		Data: data,
	}, nil
}

func GetMembershipCountBySubdistrict(accountYear string) ([]models.MembershipCountBySubdistrictData, error) {
	// TODO: Implement logic to get membership count by subdistrict
	query := database.DB.Model(&models.Member{})

	// Apply filters
	if accountYear != "" {
		query = query.Where("account_year = ?", accountYear)
	}

	// Get count by subdistrict
	var result []struct {
		Subdistrict string
		Count       int64
	}

	if err := query.Select("subdistrict", "COUNT(*) as count").
		Group("subdistrict").
		Scan(&result).Error; err != nil {
		return nil, fmt.Errorf("error getting membership count by subdistrict: %w", err)
	}

	// Calculate total for percentage
	var total int64
	if accountYear != "" {
		total, _ = GetTotalMembers(accountYear, "")
	} else {
		total, _ = GetTotalMembers("", "")
	}
	// Convert to response format with percentage
	var subdistrictData []models.MembershipCountBySubdistrictData
	for _, result := range result {
		percentage := float64(0)
		if total > 0 {
			rawPercentage := (float64(result.Count) / float64(total)) * 100
			percentage = math.Round(rawPercentage*100) / 100
		}

		subdistrictData = append(subdistrictData, models.MembershipCountBySubdistrictData{
			Subdistrict: result.Subdistrict,
			Count:       result.Count,
			Percent:     percentage,
		})
	}

	return subdistrictData, nil
}

// Shares Distribution Services

func GetSharesDistributionChart(accountYear, subdistrict string) (*models.SharesDistributionResponse, error) {
	// TODO: Implement logic to get shares distribution chart
	data, err := GetSharesDistribution(accountYear, subdistrict)
	if err != nil {
		return nil, err
	}
	return &models.SharesDistributionResponse{
		Data: data,
	}, nil
}

func GetSharesDistribution(accountYear, subdistrict string) ([]models.SharesDistributionData, error) {
	// TODO: Implement logic to get shares distribution
	query := database.DB.Model(&models.Member{})

	// Apply filters
	if accountYear != "" {
		query = query.Where("account_year = ?", accountYear)
	}
	if subdistrict != "" {
		query = query.Where("subdistrict ILIKE ?", "%"+subdistrict+"%")
	}

	// Define buckets
	buckets := []struct {
		Name      string
		MinShares float64
		MaxShares float64
	}{
		{"< 1หมื่น", 0, 10000},
		{"1หมื่น-5หมื่น", 10000, 50000},
		{"5หมื่น-1แสน", 50000, 100000},
		{"> 1แสน", 100000, 999999999},
	}

	var distributionData []models.SharesDistributionData
	var total int64

	// Get total count for percentage calculation
	if err := query.Count(&total).Error; err != nil {
		return nil, fmt.Errorf("error getting total members for distribution: %w", err)
	}

	// Count members in each bucket
	for _, bucket := range buckets {
		var count int64
		bucketQuery := query.Session(&gorm.Session{})

		if bucket.MinShares == 0 {
			bucketQuery = bucketQuery.Where("shares_value <= ?", bucket.MaxShares)
		} else if bucket.MaxShares >= 999999999 {
			bucketQuery = bucketQuery.Where("shares_value > ?", bucket.MinShares)
		} else {
			bucketQuery = bucketQuery.Where("shares_value > ? AND shares_value <= ?", bucket.MinShares, bucket.MaxShares)
		}

		if err := bucketQuery.Count(&count).Error; err != nil {
			return nil, fmt.Errorf("error getting count for bucket %s: %w", bucket.Name, err)
		}

		percentage := float64(0)
		if total > 0 {
			percentage = math.Round((float64(count) / float64(total)) * 100)
		}

		distributionData = append(distributionData, models.SharesDistributionData{
			Bucket:      bucket.Name,
			MemberCount: count,
			Percentage:  percentage,
		})
	}

	return distributionData, nil
}
