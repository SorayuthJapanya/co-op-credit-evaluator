package models

import (
	"time"

	"github.com/google/uuid"
)

type Admin struct {
	Id        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"id"`
	Username  string    `gorm:"uniqueIndex;not null" json:"username"`
	Password  string    `gorm:"not null" json:"-"`
	FullName  string    `gorm:"not null" json:"fullname"`
	CreatedAt time.Time `gorm:"type:timestamp;default:now()" json:"created_at"`
	UpdatedAt time.Time `gorm:"type:timestamp;default:now()" json:"updated_at"`
}

type AdminRegister struct {
	Username  string `json:"username"`
	Password  string `json:"password"`
	FullName  string `json:"fullname"`
}

type AdminLogin struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

