package models

import (
	"time"

	"github.com/google/uuid"
)

type Member struct {
	Id            uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"id"`
	CooperativeID string    `gorm:"not null" json:"cooperativeId"`
	IdCard        string    `gorm:"uniqueIndex;not null" json:"idCard"`
	AccountYear   string    `gorm:"not null" json:"accountYear"`
	MemberId      string    `gorm:"uniqueIndex;not null" json:"memberId"`
	FullName      string    `gorm:"not null" json:"fullName"`
	Nationality   string    `gorm:"not null" json:"nationality"`
	SharesNum     float64   `gorm:"not null" json:"sharesNum"`
	SharesValue   float64   `gorm:"not null" json:"sharesValue"`
	JoiningDate   time.Time `json:"joiningDate"`
	MemberType    int64     `gorm:"not null" json:"memberType"`
	LeavingDate   time.Time `json:"leavingDate"`
	Address       string    `gorm:"not null" json:"address"`
	Moo           int64     `gorm:"not null" json:"moo"`
	Subdistrict   string    `gorm:"not null" json:"subdistrict"`
	District      string    `gorm:"not null" json:"district"`
	Province      string    `gorm:"not null" json:"province"`
	CreatedAt     time.Time `gorm:"not null" json:"createdAt"`
	UpdatedAt     time.Time `gorm:"not null" json:"updatedAt"`
}
