package models

import (
	"time"

	"github.com/google/uuid"
)

type CareerCategory struct {
	Id           uuid.UUID     `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"id"`
	CategoryName string        `gorm:"uniqueIndex;not null" json:"categoryName"`
	SubCategory  []SubCategory `gorm:"foreignKey:CategoryID" json:"subCategory"`
	CreatedAt    time.Time     `gorm:"type:timestamp;default:now()" json:"createdAt"`
	UpdatedAt    time.Time     `gorm:"type:timestamp;default:now()" json:"updatedAt"`
}

type SubCategory struct {
	Id              uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"id"`
	CategoryID      uuid.UUID `gorm:"not null" json:"categoryId"`
	SubCategoryName string    `gorm:"not null" json:"subCategoryName"`
	SubNetProfit    float64   `gorm:"not null" json:"subNetProfit"`
	CreatedAt       time.Time `gorm:"type:timestamp;default:now()" json:"createdAt"`
	UpdatedAt       time.Time `gorm:"type:timestamp;default:now()" json:"updatedAt"`
}
