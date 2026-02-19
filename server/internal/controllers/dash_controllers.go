package controllers

import (
	"strconv"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/services"
	"github.com/gofiber/fiber/v3"
)

func GetDashboardOverview(c fiber.Ctx) error {
	// Get query parameters
	rawAccountYear := c.Query("accountYear") // ex. 2568
	rawSubdistrict := c.Query("subdistrict")

	num, err := strconv.Atoi(rawAccountYear)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid account year",
		})
	}
	numAccountYear := num - 543
	accountYear := strconv.Itoa(numAccountYear)

	var subdistrict string
	if rawSubdistrict == "all" {
		subdistrict = ""
	} else {
		subdistrict = rawSubdistrict
	}

	// Get KPI data (with filters)
	kpiData, err := services.GetKPIDashboard(accountYear, subdistrict)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get KPI dashboard",
		})
	}

	// Get membership growth data (no filters as per requirements)
	growthData, err := services.GetMembershipGrowthChart()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get membership growth data",
		})
	}

	// Get member count by subdistrict data (with filters)
	subdistrictData, err := services.GetMembershipCountBySubdistrictChart(accountYear)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get subdistrict data",
		})
	}

	// Get shares distribution data (with filters)
	sharesDistributionData, err := services.GetSharesDistributionChart(accountYear, subdistrict)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get shares distribution data",
		})
	}

	return c.JSON(fiber.Map{
		"kpi": fiber.Map{
			"totalMembers":           kpiData.TotalMembers,
			"totalShares":            kpiData.TotalShares,
			"averageSharesPerPerson": kpiData.AverageSharesPerPerson,
			"membersThisYear":        kpiData.MembersThisYear,
		},
		"charts": fiber.Map{
			"membershipGrowth":         growthData,
			"memberCountBySubdistrict": subdistrictData,
			"sharesDistribution":       sharesDistributionData,
		},
	})
}

// For dropdown
func GetSubDistricts(c fiber.Ctx) error {
	data, err := services.GetSubDistricts()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get subdistricts",
		})
	}
	return c.JSON(data)
}
