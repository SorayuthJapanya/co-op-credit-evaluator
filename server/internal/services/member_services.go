package services

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"github.com/google/uuid"
)

// Member CRUD Services

func CreateMember(cooperativeID string, idCard string, accountYear string, memberId string, fullName string, nationality string, sharesNum float64, sharesValue float64, joiningDate time.Time, memberType int64, leavingDate time.Time, address string, moo int64, subdistrict string, district string, province string) (*models.Member, error) {
	// Check if ID Card already exists
	var existingMemberByIDCard models.Member
	if err := database.DB.Where("id_card = ?", idCard).First(&existingMemberByIDCard).Error; err == nil {
		return nil, errors.New("เลขบัตรประชาชนนี้มีอยู่แล้ว")
	}

	var existingFullname models.Member
	cleanFullName := strings.ReplaceAll(fullName, " ", "")
	if err := database.DB.Where("REPLACE(full_name, ' ', '') = ?", cleanFullName).First(&existingFullname).Error; err == nil {
		return nil, errors.New("ชื่อ-นามสกลุลนี้มีอยู่แล้ว")
	}

	// Check if Member ID already exists
	var existingMemberByMemberID models.Member
	if err := database.DB.Where("member_id = ?", memberId).First(&existingMemberByMemberID).Error; err == nil {
		return nil, errors.New("เลขสมาชิกนี้มีอยู่แล้ว")
	}

	// Create new member
	member := models.Member{
		CooperativeID: cooperativeID,
		IdCard:        idCard,
		AccountYear:   accountYear,
		MemberId:      memberId,
		FullName:      fullName,
		Nationality:   nationality,
		SharesNum:     sharesNum,
		SharesValue:   sharesValue,
		JoiningDate:   joiningDate,
		MemberType:    memberType,
		LeavingDate:   leavingDate,
		Address:       address,
		Moo:           moo,
		Subdistrict:   subdistrict,
		District:      district,
		Province:      province,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := database.DB.Create(&member).Error; err != nil {
		return nil, err
	}

	return &member, nil
}

func GetMembersWithPagination(page int, limit int) ([]models.Member, int64, error) {
	var members []models.Member
	var total int64

	// Get total count
	if err := database.DB.Model(&models.Member{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated data
	offset := (page - 1) * limit
	if err := database.DB.Model(&models.Member{}).Order("LENGTH(member_id) ASC, member_id ASC").Offset(offset).Limit(limit).Find(&members).Error; err != nil {
		return nil, 0, err
	}

	return members, total, nil
}

func GetMembersWithFiltersAndPagination(fullName string, subdistrict string, district string, province string, page int, limit int) ([]models.Member, int64, error) {
	var members []models.Member
	var total int64
	query := database.DB.Model(&models.Member{})

	// Apply filters if provided
	if fullName != "" {
		query = query.Where("full_name ILIKE ?", "%"+fullName+"%")
	}
	if subdistrict != "" {
		query = query.Where("subdistrict ILIKE ?", "%"+subdistrict+"%")
	}
	if district != "" {
		query = query.Where("district ILIKE ?", "%"+district+"%")
	}
	if province != "" {
		query = query.Where("province ILIKE ?", "%"+province+"%")
	}

	// Get total count with filters
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated data with filters
	offset := (page - 1) * limit
	if err := query.Order("LENGTH(member_id) ASC, member_id ASC").Offset(offset).Limit(limit).Find(&members).Error; err != nil {
		return nil, 0, err
	}

	return members, total, nil
}

func GetMemberByID(id uuid.UUID) (*models.Member, error) {
	var member models.Member
	if err := database.DB.First(&member, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &member, nil
}

func GetMemberByIDCard(idCard string) (*models.Member, error) {
	var member models.Member
	if err := database.DB.Where("id_card = ?", idCard).First(&member).Error; err != nil {
		return nil, err
	}
	return &member, nil
}

func GetMemberByMemberID(memberId string) (*models.Member, error) {
	var member models.Member
	if err := database.DB.Where("member_id = ?", memberId).First(&member).Error; err != nil {
		return nil, err
	}
	return &member, nil
}

func GetMembersByCooperativeID(cooperativeID string) ([]models.Member, error) {
	var members []models.Member
	if err := database.DB.Where("cooperative_id = ?", cooperativeID).Find(&members).Error; err != nil {
		return nil, err
	}
	return members, nil
}

func UpdateMember(id uuid.UUID, cooperativeID string, idCard string, accountYear string, memberId string, fullName string, nationality string, sharesNum float64, sharesValue float64, joiningDate time.Time, memberType int64, leavingDate time.Time, address string, moo int64, subdistrict string, district string, province string) (*models.Member, error) {
	var member models.Member
	if err := database.DB.First(&member, "id = ?", id).Error; err != nil {
		return nil, errors.New("ไม่พบข้อมูลสมาชิก")
	}

	// Check if ID Card already exists (excluding current member)
	var existingMemberByIDCard models.Member
	if err := database.DB.Where("id_card = ? AND id != ?", idCard, id).First(&existingMemberByIDCard).Error; err == nil {
		return nil, errors.New("เลขบัตรประชาชนนี้มีอยู่แล้ว")
	}

	// Check if Member ID already exists (excluding current member)
	var existingMemberByMemberID models.Member
	if err := database.DB.Where("member_id = ? AND id != ?", memberId, id).First(&existingMemberByMemberID).Error; err == nil {
		return nil, errors.New("เลขสมาชิกนี้มีอยู่แล้ว")
	}

	// Check if full name already exists (excluding current member)
	var existingFullname models.Member
	cleanFullName := strings.ReplaceAll(fullName, " ", "")
	if err := database.DB.Where("REPLACE(full_name, ' ', '') = ? AND id != ?", cleanFullName, id).First(&existingFullname).Error; err == nil {
		return nil, errors.New("ชื่อ-นามสกลุลนี้มีอยู่แล้ว")
	}

	// Update member
	member.CooperativeID = cooperativeID
	member.IdCard = idCard
	member.AccountYear = accountYear
	member.MemberId = memberId
	member.FullName = fullName
	member.Nationality = nationality
	member.SharesNum = sharesNum
	member.SharesValue = sharesValue
	member.JoiningDate = joiningDate
	member.MemberType = memberType
	member.LeavingDate = leavingDate
	member.Address = address
	member.Moo = moo
	member.Subdistrict = subdistrict
	member.District = district
	member.Province = province
	member.UpdatedAt = time.Now()

	if err := database.DB.Save(&member).Error; err != nil {
		return nil, err
	}

	return &member, nil
}

func DeleteMember(id uuid.UUID) error {
	// Check if member exists
	var member models.Member
	if err := database.DB.First(&member, "id = ?", id).Error; err != nil {
		return errors.New("ไม่พบข้อมูลสมาชิก")
	}

	// Delete member
	if err := database.DB.Delete(&models.Member{}, "id = ?", id).Error; err != nil {
		return err
	}

	return nil
}

func MemberExists(id uuid.UUID) bool {
	var member models.Member
	return database.DB.First(&member, "id = ?", id).Error == nil
}

func MemberExistsByIDCard(idCard string) bool {
	var member models.Member
	return database.DB.Where("id_card = ?", idCard).First(&member).Error == nil
}

func MemberExistsByMemberID(memberId string) bool {
	var member models.Member
	return database.DB.Where("member_id = ?", memberId).First(&member).Error == nil
}

// Search members by full name
func SearchMembersByName(fullName string) ([]models.Member, error) {
	var members []models.Member
	searchPattern := fmt.Sprintf("%%%s%%", fullName)

	if err := database.DB.Where("full_name ILIKE ?", searchPattern).Find(&members).Error; err != nil {
		return nil, err
	}
	return members, nil
}

// Get members by province
func GetMembersByProvince(province string) ([]models.Member, error) {
	var members []models.Member
	if err := database.DB.Where("province = ?", province).Find(&members).Error; err != nil {
		return nil, err
	}
	return members, nil
}

// Get members by member type
func GetMembersByType(memberType int64) ([]models.Member, error) {
	var members []models.Member
	if err := database.DB.Where("member_type = ?", memberType).Find(&members).Error; err != nil {
		return nil, err
	}
	return members, nil
}
