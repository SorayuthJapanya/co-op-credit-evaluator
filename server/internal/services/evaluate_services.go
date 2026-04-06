package services

import (
	"fmt"
	"log"
	"time"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
	"github.com/google/uuid"
)

func CreateEvaluate(userID uuid.UUID, request *models.EvaluateRequest) (*models.Evaluate, error) {
	// Start transaction
	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Query Admin for logging
	var admin models.Admin
	if err := tx.Where("id = ?", userID).First(&admin).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	mainBorrowerName := ""
	if len(request.Applicants) > 0 {
		mainBorrowerName = request.Applicants[0].Name
	}

	evaluateLog := models.EvaluateLog{
		Action:    fmt.Sprintf("สร้างแบบประเมินของ %s", mainBorrowerName),
		Username:  admin.Username,
		FullName:  admin.FullName,
		Role:      admin.Role,
		Timestamp: time.Now(),
	}
	if err := tx.Create(&evaluateLog).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create new evaluate first (without associations for now)
	evaluate := models.Evaluate{
		UserID:       userID,
		EvaluateType: request.EvaluateType,
		MarginType:   request.MarginType,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	// Create the main evaluate record first to get the ID
	if err := tx.Create(&evaluate).Error; err != nil {
		log.Printf("Error creating evaluate: %v", err)
		tx.Rollback()
		return nil, err
	}

	// Now create applicants with the evaluate ID
	for _, applicantReq := range request.Applicants {
		applicant := models.Applicant{
			EvaluateID:  evaluate.Id,
			Id:          uuid.New(), // Generate new ID for the applicant
			ApplicantID: uuid.New(), // Generate new ApplicantID
			// Copy all borrower data fields
			CareerCategory:       applicantReq.CareerCategory,
			Career:               applicantReq.Career,
			OtherCareer:          applicantReq.OtherCareer,
			Name:                 applicantReq.Name,
			IDCard:               applicantReq.IDCard,
			BusinessActivity:     applicantReq.BusinessActivity,
			ExpenseItem:          applicantReq.ExpenseItem,
			ProfileLost:          applicantReq.ProfileLost,
			ShareHolder:          applicantReq.ShareHolder,
			OptionalOtherExpense: applicantReq.OptionalOtherExpense,
			Salary:               applicantReq.Salary,
			OtherSalary:          applicantReq.OtherSalary,
			OptionsSalary:        applicantReq.OptionsSalary,
			CreatedAt:            time.Now(),
			UpdatedAt:            time.Now(),
		}

		log.Printf("Creating applicant: %+v", applicant)
		if err := tx.Create(&applicant).Error; err != nil {
			log.Printf("Error creating applicant: %v", err)
			tx.Rollback()
			return nil, err
		}
	}

	// Create result with evaluate ID
	result := models.EvaluateResult{
		EvaluateID:   evaluate.Id,
		EvaluateType: request.EvaluateType,
		DebtDetail:   request.Result.DebtDetail,
		Dti:          request.Result.Dti,
		Dscr:         request.Result.Dscr,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := tx.Create(&result).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create result applicants
	for _, resultApplicantReq := range request.Result.Applicants {
		resultApplicant := models.ResultApplicant{
			EvaluateID:             result.EvaluateID,
			ResultID:               result.Id,
			Name:                   resultApplicantReq.Name,
			IDCard:                 resultApplicantReq.IDCard,
			Salary:                 resultApplicantReq.Salary,
			Expenses:               resultApplicantReq.Expenses,
			OtherSalary:            resultApplicantReq.OtherSalary,
			OptionsSalary:          resultApplicantReq.OptionsSalary,
			ResultShareValue:       resultApplicantReq.ResultShareValue,
			TotalSalary:            resultApplicantReq.TotalSalary,
			ResultIncome:           resultApplicantReq.ResultIncome,
			CustomerExpenses:       resultApplicantReq.CustomerExpenses,
			ResultCustomerExpenses: resultApplicantReq.ResultCustomerExpenses,
			LivingExpenses:         resultApplicantReq.LivingExpenses,
			OtherExpenses:          resultApplicantReq.OtherExpenses,
			TotalExpenses:          resultApplicantReq.TotalExpenses,
			CreatedAt:              time.Now(),
			UpdatedAt:              time.Now(),
		}

		if err := tx.Create(&resultApplicant).Error; err != nil {
			log.Printf("Error creating result applicant: %v", err)
			tx.Rollback()
			return nil, err
		}
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	// Reload the evaluate with all associations
	if err := database.DB.Preload("Applicants").Preload("Result").Preload("Result.Applicants").
		Where("id = ?", evaluate.Id).First(&evaluate).Error; err != nil {
		return nil, err
	}

	return &evaluate, nil
}

func GetEvaluates(search string, userID uuid.UUID, page int, limit int) ([]models.Evaluate, int64, error) {
	var evaluates []models.Evaluate
	var total int64
	query := database.DB.Model(&models.Evaluate{}).Preload("Applicants").Preload("Result").Preload("Result.Applicants")

	// Apply user filter if provided
	if userID != uuid.Nil {
		query = query.Where("user_id = ?", userID)
	}

	// Apply search filter if provided
	if search != "" {
		searchPattern := "%" + search + "%"
		query = query.Joins("LEFT JOIN applicants ON applicants.evaluate_id = evaluates.id").
			Joins("LEFT JOIN result_applicants ON result_applicants.evaluate_id = evaluates.id").
			Where(`evaluates.evaluate_type ILIKE ? OR 
				evaluates.margin_type ILIKE ? OR
				applicants.name ILIKE ? OR
				applicants.id_card ILIKE ? OR
				applicants.career ILIKE ? OR
				applicants.career_category ILIKE ? OR
				applicants.other_career ILIKE ? OR
				result_applicants.name ILIKE ? OR
				result_applicants.id_card ILIKE ?`,
				searchPattern, searchPattern, searchPattern, searchPattern,
				searchPattern, searchPattern, searchPattern, searchPattern, searchPattern).
			Group("evaluates.id")
	}

	// Get total count with filters
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated data with filters
	offset := (page - 1) * limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&evaluates).Error; err != nil {
		return nil, 0, err
	}

	return evaluates, total, nil
}

func GetEvaluateByEvaluateID(evaluateID uuid.UUID, userID uuid.UUID) (*models.Evaluate, error) {
	var evaluate models.Evaluate
	if err := database.DB.Preload("Applicants").Preload("Result").Preload("Result.Applicants").
		Where("id = ? AND user_id = ?", evaluateID, userID).First(&evaluate).Error; err != nil {
		return nil, err
	}
	return &evaluate, nil
}

func UpdateEvaluate(evaluateID uuid.UUID, userID uuid.UUID, request *models.EvaluateRequest) (*models.Evaluate, error) {
	// Start transaction
	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Check if evaluate exists and belongs to user
	var evaluate models.Evaluate
	if err := tx.Where("id = ? AND user_id = ?", evaluateID, userID).First(&evaluate).Error; err != nil {
		return nil, err
	}

	// Update evaluate fields
	evaluate.EvaluateType = request.EvaluateType
	evaluate.MarginType = request.MarginType
	evaluate.UpdatedAt = time.Now()

	// Query Admin for logging
	var admin models.Admin
	if err := tx.Where("id = ?", userID).First(&admin).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	mainBorrowerName := ""
	if len(request.Applicants) > 0 {
		mainBorrowerName = request.Applicants[0].Name
	}

	evaluateLog := models.EvaluateLog{
		Action:    fmt.Sprintf("แก้ไขแบบประเมินของ %s", mainBorrowerName),
		Username:  admin.Username,
		FullName:  admin.FullName,
		Role:      admin.Role,
		Timestamp: time.Now(),
	}
	if err := tx.Create(&evaluateLog).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Save updated evaluate
	if err := tx.Save(&evaluate).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Delete existing applicants
	if err := tx.Where("evaluate_id = ?", evaluateID).Delete(&models.Applicant{}).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create new applicants
	for _, applicantReq := range request.Applicants {
		applicant := models.Applicant{
			EvaluateID:  evaluate.Id,
			Id:          uuid.New(), // Generate new ID for the applicant
			ApplicantID: uuid.New(), // Generate new ApplicantID
			// Copy all borrower data fields
			CareerCategory:       applicantReq.CareerCategory,
			Career:               applicantReq.Career,
			OtherCareer:          applicantReq.OtherCareer,
			Name:                 applicantReq.Name,
			IDCard:               applicantReq.IDCard,
			BusinessActivity:     applicantReq.BusinessActivity,
			ExpenseItem:          applicantReq.ExpenseItem,
			ProfileLost:          applicantReq.ProfileLost,
			ShareHolder:          applicantReq.ShareHolder,
			OptionalOtherExpense: applicantReq.OptionalOtherExpense,
			Salary:               applicantReq.Salary,
			OtherSalary:          applicantReq.OtherSalary,
			OptionsSalary:        applicantReq.OptionsSalary,
			CreatedAt:            time.Now(),
			UpdatedAt:            time.Now(),
		}

		if err := tx.Create(&applicant).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	// Delete existing result applicants first (must be done before evaluate_results due to foreign key constraint)
	errDeleteApplicants := tx.Where("result_id IN (SELECT id FROM evaluate_results WHERE evaluate_id = ?)", evaluateID).
		Delete(&models.ResultApplicant{}).Error
	if errDeleteApplicants != nil {
		tx.Rollback()
		return nil, errDeleteApplicants
	}

	// Delete existing result (after result_applicants are deleted)
	if err := tx.Where("evaluate_id = ?", evaluateID).Delete(&models.EvaluateResult{}).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create new result
	result := models.EvaluateResult{
		EvaluateID:   evaluate.Id,
		EvaluateType: request.EvaluateType,
		DebtDetail:   request.Result.DebtDetail,
		Dti:          request.Result.Dti,
		Dscr:         request.Result.Dscr,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := tx.Create(&result).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create result applicants
	for _, resultApplicantReq := range request.Result.Applicants {
		resultApplicant := models.ResultApplicant{
			EvaluateID:             result.EvaluateID,
			ResultID:               result.Id,
			Name:                   resultApplicantReq.Name,
			IDCard:                 resultApplicantReq.IDCard,
			Salary:                 resultApplicantReq.Salary,
			Expenses:               resultApplicantReq.Expenses,
			OtherSalary:            resultApplicantReq.OtherSalary,
			OptionsSalary:          resultApplicantReq.OptionsSalary,
			ResultShareValue:       resultApplicantReq.ResultShareValue,
			TotalSalary:            resultApplicantReq.TotalSalary,
			ResultIncome:           resultApplicantReq.ResultIncome,
			CustomerExpenses:       resultApplicantReq.CustomerExpenses,
			ResultCustomerExpenses: resultApplicantReq.ResultCustomerExpenses,
			LivingExpenses:         resultApplicantReq.LivingExpenses,
			OtherExpenses:          resultApplicantReq.OtherExpenses,
			TotalExpenses:          resultApplicantReq.TotalExpenses,
			CreatedAt:              time.Now(),
			UpdatedAt:              time.Now(),
		}

		if err := tx.Create(&resultApplicant).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	// Reload the evaluate with all associations
	if err := database.DB.Preload("Applicants").Preload("Result").Preload("Result.Applicants").
		Where("id = ?", evaluate.Id).First(&evaluate).Error; err != nil {
		return nil, err
	}

	return &evaluate, nil
}

func DeleteEvaluate(evaluateID uuid.UUID, userID uuid.UUID) error {
	// Check if evaluate exists and belongs to user
	var evaluate models.Evaluate
	if err := database.DB.Preload("Applicants").Where("id = ? AND user_id = ?", evaluateID, userID).First(&evaluate).Error; err != nil {
		return err
	}

	// Start transaction
	tx := database.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Query Admin for logging
	var admin models.Admin
	if err := tx.Where("id = ?", userID).First(&admin).Error; err != nil {
		tx.Rollback()
		return err
	}

	mainBorrowerName := ""
	if len(evaluate.Applicants) > 0 {
		mainBorrowerName = evaluate.Applicants[0].Name
	}

	evaluateLog := models.EvaluateLog{
		Action:    fmt.Sprintf("ลบแบบประเมินของ %s", mainBorrowerName),
		Username:  admin.Username,
		FullName:  admin.FullName,
		Role:      admin.Role,
		Timestamp: time.Now(),
	}
	if err := tx.Create(&evaluateLog).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Delete associated applicants first
	if err := tx.Where("evaluate_id = ?", evaluateID).Delete(&models.Applicant{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Delete associated result applicants first (before evaluate_results)
	errDeleteApplicants := tx.Where("result_id IN (SELECT id FROM evaluate_results WHERE evaluate_id = ?)", evaluateID).
		Delete(&models.ResultApplicant{}).Error
	if errDeleteApplicants != nil {
		tx.Rollback()
		return errDeleteApplicants
	}

	// Delete associated result
	if err := tx.Where("evaluate_id = ?", evaluateID).Delete(&models.EvaluateResult{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Delete the main evaluate record
	if err := tx.Delete(&evaluate).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}
