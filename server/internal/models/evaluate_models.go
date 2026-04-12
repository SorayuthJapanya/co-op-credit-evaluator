package models

import (
	"time"

	"github.com/google/uuid"
)

type Evaluate struct {
	Id           uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"id"`
	UserID       uuid.UUID      `gorm:"not null" json:"userID"`
	User         *Admin         `gorm:"foreignKey:UserID" json:"user,omitempty"`
	EvaluateType string         `gorm:"not null" json:"evaluateType"`
	MarginType   string         `gorm:"not null" json:"marginType"`
	Status       string         `gorm:"not null;default:'รอการอนุมัติ'" json:"status"`
	Feedback     string         `gorm:"default:''" json:"feedback"`
	Applicants   []Applicant    `gorm:"foreignKey:EvaluateID" json:"applicants"`
	Result       EvaluateResult `gorm:"foreignKey:EvaluateID" json:"result"`
	CreatedAt    time.Time      `gorm:"not null" json:"createdAt"`
	UpdatedAt    time.Time      `gorm:"not null" json:"updatedAt"`
}

type EvaluateRequest struct {
	EvaluateType string                `json:"evaluateType"`
	MarginType   string                `json:"marginType"`
	Applicants   []ApplicantRequest    `json:"applicants"`
	Result       EvaluateResultRequest `json:"result"`
}

type Applicant struct {
	Id                   uuid.UUID        `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"id"`
	EvaluateID           uuid.UUID        `gorm:"type:uuid;not null" json:"evaluateId"`
	ApplicantID          uuid.UUID        `gorm:"type:uuid;not null" json:"applicantId"`
	CareerCategory       string           `gorm:"not null" json:"careerCategory"`
	Career               string           `gorm:"not null" json:"career"`
	OtherCareer          string           `gorm:"" json:"otherCareer"`
	Name                 string           `gorm:"not null" json:"name"`
	IDCard               string           `gorm:"not null;index" json:"idCard"`
	BusinessActivity     BusinessActivity `gorm:"embedded" json:"businessActivity"`
	ExpenseItem          ExpenseItem      `gorm:"embedded" json:"expenseItem"`
	ProfileLost          ProfileLost      `gorm:"embedded" json:"profileLost"`
	ShareHolder          ShareHolder      `gorm:"embedded" json:"shareHolder"`
	OptionalOtherExpense float64          `gorm:"default:0" json:"optionalOtherExpense"`
	Salary               Salary           `gorm:"embedded" json:"salary"`
	OtherSalary          OtherSalary      `gorm:"embedded" json:"otherSalary"`
	OptionsSalary        OptionsSalary    `gorm:"embedded" json:"optionsSalary"`
	CreatedAt            time.Time        `gorm:"not null" json:"createdAt"`
	UpdatedAt            time.Time        `gorm:"not null" json:"updatedAt"`
}

type ApplicantRequest struct {
	CareerCategory       string           `json:"careerCategory"`
	Career               string           `json:"career"`
	OtherCareer          string           `json:"otherCareer"`
	Name                 string           `json:"name"`
	IDCard               string           `json:"idCard"`
	BusinessActivity     BusinessActivity `json:"businessActivity"`
	ExpenseItem          ExpenseItem      `json:"expenseItem"`
	ProfileLost          ProfileLost      `json:"profileLost"`
	ShareHolder          ShareHolder      `json:"shareHolder"`
	OptionalOtherExpense float64          `json:"optionalOtherExpense"`
	Salary               Salary           `json:"salary"`
	OtherSalary          OtherSalary      `json:"otherSalary"`
	OptionsSalary        OptionsSalary    `json:"optionsSalary"`
}

type BusinessActivity struct {
	Salary      float64 `gorm:"not null;default:0" json:"salary"`
	OtherSalary float64 `gorm:"not null;default:0" json:"otherSalary"`
	TotalIncome float64 `gorm:"not null;default:0" json:"totalIncome"`
}

type ExpenseItem struct {
	CostPercentage  float64 `gorm:"not null;default:0" json:"costPercentage"`
	CostAndService  float64 `gorm:"not null;default:0" json:"costAndService"`
	EmpSalary       float64 `gorm:"not null;default:0" json:"empSalary"`
	RentExpenses    float64 `gorm:"not null;default:0" json:"rentExpenses"`
	UtilityExpenses float64 `gorm:"not null;default:0" json:"utilityExpenses"`
	OtherExpenses   float64 `gorm:"not null;default:0" json:"otherExpenses"`
	TotalExpense    float64 `gorm:"not null;default:0" json:"totalExpense"`
}

type ProfileLost struct {
	GrossProfit     float64 `gorm:"not null;default:0" json:"grossProfit"`
	InterestExpense float64 `gorm:"not null;default:0" json:"interestExpense"`
	ProfitBeforeTax float64 `gorm:"not null;default:0" json:"profitBeforeTax"`
	TaxExpense      float64 `gorm:"not null;default:0" json:"taxExpense"`
	NetProfit       float64 `gorm:"not null;default:0" json:"netProfit"`
}

type ShareHolder struct {
	ShareOfNetProfit float64 `gorm:"not null;default:0" json:"shareOfNetProfit"`
	BankNetProfit    float64 `gorm:"not null;default:0" json:"bankNetProfit"`
}

type Salary struct {
	Base               float64 `gorm:"not null;default:0" json:"base"`
	FreelanceIncome    float64 `gorm:"not null;default:0" json:"freelanceIncome"`
	Tax                float64 `gorm:"not null;default:0" json:"tax"`
	SocialSecurityFund float64 `gorm:"not null;default:0" json:"socialSecurityFund"`
	ProvidentFund      float64 `gorm:"not null;default:0" json:"providentFund"`
	ShareFund          float64 `gorm:"not null;default:0" json:"shareFund"`
	AssociationFund    float64 `gorm:"not null;default:0" json:"associationFund"`
	OtherFund          float64 `gorm:"not null;default:0" json:"otherFund"`
	Total              float64 `gorm:"not null;default:0" json:"total"`
}

type OtherSalary struct {
	EntertainmentSalary   float64 `gorm:"not null;default:0" json:"entertainmentSalary"`
	LivingSalary          float64 `gorm:"not null;default:0" json:"livingSalary"`
	CertificationSalary   float64 `gorm:"not null;default:0" json:"certificationSalary"`
	ProfessionalAllowance float64 `gorm:"not null;default:0" json:"professionalAllowance"`
	TransportationSalary  float64 `gorm:"not null;default:0" json:"transportationSalary"`
	AcademicSalary        float64 `gorm:"not null;default:0" json:"academicSalary"`
	OtherRegularSalary    float64 `gorm:"not null;default:0" json:"otherRegularSalary"`
	Total                 float64 `gorm:"not null;default:0" json:"total"`
}

type OptionsSalary struct {
	Commission             float64 `gorm:"not null;default:0" json:"commission"`
	Overtime               float64 `gorm:"not null;default:0" json:"overtime"`
	Bonus                  float64 `gorm:"not null;default:0" json:"bonus"`
	DividendsInterest      float64 `gorm:"not null;default:0" json:"dividendsInterest"`
	NetSupplementaryIncome float64 `gorm:"not null;default:0" json:"netSupplementaryIncome"`
	Other                  float64 `gorm:"not null;default:0" json:"other"`
	OtherDocumentedIncome  float64 `gorm:"not null;default:0" json:"otherDocumentedIncome"`
	Total                  float64 `gorm:"not null;default:0" json:"total"`
}

type EvaluateResult struct {
	Id           uuid.UUID         `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"id"`
	EvaluateID   uuid.UUID         `gorm:"type:uuid;not null" json:"evaluateId"`
	EvaluateType string            `gorm:"not null" json:"evaluateType"`
	Applicants   []ResultApplicant `gorm:"foreignKey:ResultID" json:"applicants"`
	DebtDetail   DebtDetail        `gorm:"embedded" json:"debtDetail"`
	Dti          float64           `gorm:"not null;default:0" json:"dti"`
	Dscr         float64           `gorm:"not null;default:0" json:"dscr"`
	CreatedAt    time.Time         `gorm:"not null" json:"createdAt"`
	UpdatedAt    time.Time         `gorm:"not null" json:"updatedAt"`
}

type EvaluateResultRequest struct {
	EvaluateType string                   `json:"evaluateType"`
	Applicants   []ResultApplicantRequest `json:"applicants"`
	DebtDetail   DebtDetail               `json:"debtDetail"`
	Dti          float64                  `json:"dti"`
	Dscr         float64                  `json:"dscr"`
}

type ResultApplicant struct {
	Id                     uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"id"`
	EvaluateID             uuid.UUID `gorm:"type:uuid;not null" json:"evaluateId"`
	ResultID               uuid.UUID `gorm:"type:uuid;not null" json:"resultId"`
	Name                   string    `gorm:"not null" json:"name"`
	IDCard                 string    `gorm:"not null;index" json:"idCard"`
	Salary                 float64   `gorm:"not null;default:0" json:"salary"`
	Expenses               float64   `gorm:"not null;default:0" json:"expenses"`
	OtherSalary            float64   `gorm:"not null;default:0" json:"otherSalary"`
	OptionsSalary          float64   `gorm:"not null;default:0" json:"optionsSalary"`
	ResultShareValue       float64   `gorm:"not null;default:0" json:"resultShareValue"`
	TotalSalary            float64   `gorm:"not null;default:0" json:"totalSalary"`
	ResultIncome           float64   `gorm:"not null;default:0" json:"resultIncome"`
	CustomerExpenses       float64   `gorm:"not null;default:0" json:"customerExpenses"`
	ResultCustomerExpenses float64   `gorm:"not null;default:0" json:"resultCustomerExpenses"`
	LivingExpenses         float64   `gorm:"not null;default:0" json:"livingExpenses"`
	OtherExpenses          float64   `gorm:"not null;default:0" json:"otherExpenses"`
	TotalExpenses          float64   `gorm:"not null;default:0" json:"totalExpenses"`
	CreatedAt              time.Time `gorm:"not null" json:"createdAt"`
	UpdatedAt              time.Time `gorm:"not null" json:"updatedAt"`
}

type ResultApplicantRequest struct {
	Name                   string  `json:"name"`
	IDCard                 string  `json:"idCard"`
	Salary                 float64 `json:"salary"`
	Expenses               float64 `json:"expenses"`
	OtherSalary            float64 `json:"otherSalary"`
	OptionsSalary          float64 `json:"optionsSalary"`
	ResultShareValue       float64 `json:"resultShareValue"`
	TotalSalary            float64 `json:"totalSalary"`
	ResultIncome           float64 `json:"resultIncome"`
	CustomerExpenses       float64 `json:"customerExpenses"`
	ResultCustomerExpenses float64 `json:"resultCustomerExpenses"`
	LivingExpenses         float64 `json:"livingExpenses"`
	OtherExpenses          float64 `json:"otherExpenses"`
	TotalExpenses          float64 `json:"totalExpenses"`
}

type DebtDetail struct {
	DebtAmount      float64 `gorm:"not null;default:0" json:"debtAmount"`
	LastDebt        float64 `gorm:"not null;default:0" json:"lastDebt"`
	DebtReported    float64 `gorm:"not null;default:0" json:"debtReported"`
	DebtNotReported float64 `gorm:"not null;default:0" json:"debtNotReported"`
	LastDeduction   float64 `gorm:"not null;default:0" json:"lastDeduction"`
	TotalDebt       float64 `gorm:"not null;default:0" json:"totalDebt"`
}
