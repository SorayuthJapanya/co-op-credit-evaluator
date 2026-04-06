package models

import (
	"time"

	"github.com/google/uuid"
)

type EvaluateLog struct {
	Id        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primarykey" json:"logs_id"`
	Timestamp time.Time `gorm:"type:timestamp;default:now()" json:"timestamp"`
	Username  string    `gorm:"not null" json:"username"`
	FullName  string    `gorm:"not null" json:"fullname"`
	Role      string    `gorm:"not null" json:"role"`
	Action    string    `gorm:"not null" json:"action"`
}
