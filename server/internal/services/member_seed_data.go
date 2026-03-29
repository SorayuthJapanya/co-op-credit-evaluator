package services

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"github.com/google/uuid"
)

// go:embed seed/members_seed.json
var membersSeedJSON []byte

// SeedMembersData seeds the embedded member data into the database (no file path needed)
func SeedMembersData() error {
	// Parse embedded JSON
	var seedData []SeedMemberData
	if err := json.Unmarshal(membersSeedJSON, &seedData); err != nil {
		return fmt.Errorf("failed to parse embedded member JSON: %v", err)
	}

	createdCount := 0
	skippedCount := 0

	for _, seed := range seedData {
		// Parse dates
		joiningDate, err := time.Parse("2006-01-02", seed.JoiningDate)
		if err != nil {
			joiningDate = time.Time{}
		}

		leavingDate, err := time.Parse("2006-01-02", seed.LeavingDate)
		if err != nil {
			leavingDate = time.Time{}
		}

		// Convert to string
		cooperativeIDStr := fmt.Sprintf("%d", seed.CooperativeID)
		idCardStr := fmt.Sprintf("%d", seed.IdCard)
		accountYearStr := fmt.Sprintf("%d", seed.AccountYear)
		memberIdStr := fmt.Sprintf("%d", seed.MemberId)

		// Check if member already exists (by ID card or member ID)
		var existingMember models.Member
		if err := database.DB.Where("id_card = ? OR member_id = ?", idCardStr, memberIdStr).First(&existingMember).Error; err == nil {
			skippedCount++
			continue // Skip existing member
		}

		// Create member
		member := models.Member{
			Id:            uuid.New(),
			CooperativeID: cooperativeIDStr,
			IdCard:        idCardStr,
			AccountYear:   accountYearStr,
			MemberId:      memberIdStr,
			FullName:      seed.FullName,
			Nationality:   seed.Nationality,
			SharesNum:     seed.SharesNum,
			SharesValue:   seed.SharesValue,
			JoiningDate:   joiningDate,
			MemberType:    seed.MemberType,
			LeavingDate:   leavingDate,
			Address:       seed.Address,
			Moo:           seed.Moo,
			Subdistrict:   strings.Trim(seed.Subdistrict, "."),
			District:      seed.District,
			Province:      seed.Province,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}

		// Insert member
		if err := database.DB.Create(&member).Error; err != nil {
			return fmt.Errorf("failed to create member %s: %v", seed.FullName, err)
		}

		createdCount++
		fmt.Printf("Created member: %s (ID: %s)\n", seed.FullName, memberIdStr)
	}

	fmt.Printf("Successfully seeded members: %d created, %d skipped (already existed)\n", createdCount, skippedCount)
	return nil
}
