package services

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"github.com/google/uuid"
)

// SeedMemberData represents the structure from your JSON file
type SeedMemberData struct {
	CooperativeID int64   `json:"cooperativeId"`
	IdCard        int64   `json:"idCard"`
	AccountYear   int64   `json:"accountYear"`
	MemberId      int64   `json:"memberId"` // This will be converted to string
	FullName      string  `json:"fullName"`
	Nationality   string  `json:"nationality"`
	SharesNum     float64 `json:"sharesNum"`
	SharesValue   float64 `json:"sharesValue"`
	JoiningDate   string  `json:"joiningDate"`
	MemberType    int64   `json:"memberType"`
	LeavingDate   string  `json:"leavingDate"`
	Address       string  `json:"address"`
	Moo           int64   `json:"moo"`
	Subdistrict   string  `json:"subdistrict"`
	District      string  `json:"district"`
	Province      string  `json:"province"`
}

// SeedMembersFromJSON loads member data from JSON file and seeds the database
func SeedMembersFromJSON(filePath string) error {
	// Read JSON file
	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read file: %v", err)
	}

	// Parse JSON
	var seedData []SeedMemberData
	if err := json.Unmarshal(data, &seedData); err != nil {
		return fmt.Errorf("failed to parse JSON: %v", err)
	}

	// Convert and insert each member
	for _, seed := range seedData {
		// Parse dates
		joiningDate, err := time.Parse("2006-01-02", seed.JoiningDate)
		if err != nil {
			joiningDate = time.Time{} // Use zero time if parsing fails
		}

		leavingDate, err := time.Parse("2006-01-02", seed.LeavingDate)
		if err != nil {
			leavingDate = time.Time{} // Use zero time if parsing fails
		}

		// Convert to string
		cooperativeIDStr := fmt.Sprintf("%d", seed.CooperativeID)
		idCardStr := fmt.Sprintf("%d", seed.IdCard)
		accountYearStr := fmt.Sprintf("%d", seed.AccountYear)
		memberIdStr := fmt.Sprintf("%d", seed.MemberId)

		// Create member
		member := models.Member{
			Id:            uuid.New(),
			CooperativeID: cooperativeIDStr, // Convert to string
			IdCard:        idCardStr,        // Convert to string
			AccountYear:   accountYearStr,   // Convert to string
			MemberId:      memberIdStr,      // Convert to string
			FullName:      seed.FullName,
			Nationality:   seed.Nationality,
			SharesNum:     seed.SharesNum,
			SharesValue:   seed.SharesValue,
			JoiningDate:   joiningDate,
			MemberType:    seed.MemberType,
			LeavingDate:   leavingDate,
			Address:       seed.Address,
			Moo:           seed.Moo,
			Subdistrict:   seed.Subdistrict,
			District:      seed.District,
			Province:      seed.Province,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}

		// Check if member already exists (by ID card or member ID)
		var existingMember models.Member
		if err := database.DB.Where("id_card = ? OR member_id = ?", idCardStr, memberIdStr).First(&existingMember).Error; err == nil {
			fmt.Printf("Member already exists: ID Card=%s, Member ID=%s\n", idCardStr, memberIdStr)
			continue // Skip existing member
		}

		// Insert member
		if err := database.DB.Create(&member).Error; err != nil {
			return fmt.Errorf("failed to create member %s: %v", seed.FullName, err)
		}

		fmt.Printf("Created member: %s (ID: %s)\n", seed.FullName, memberIdStr)
	}

	fmt.Printf("Successfully seeded %d members\n", len(seedData))
	return nil
}

// SeedSingleMember creates a single member from the seed data structure
func SeedSingleMember(seed SeedMemberData) error {
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
		Subdistrict:   seed.Subdistrict,
		District:      seed.District,
		Province:      seed.Province,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	// Check if member already exists
	var existingMember models.Member
	if err := database.DB.Where("id_card = ? OR member_id = ?", idCardStr, memberIdStr).First(&existingMember).Error; err == nil {
		return fmt.Errorf("member already exists: ID Card=%s, Member ID=%s", idCardStr, memberIdStr)
	}

	// Insert member
	if err := database.DB.Create(&member).Error; err != nil {
		return fmt.Errorf("failed to create member %s: %v", seed.FullName, err)
	}

	return nil
}
