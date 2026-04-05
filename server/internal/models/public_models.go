package models

// PublicKPIResponse is the response model for the public (no-auth) KPI endpoint
type PublicKPIResponse struct {
	TotalMembers     int64 `json:"totalMembers"`
	TotalEvaluations int64 `json:"totalEvaluations"`
	TotalShares      int64 `json:"totalShares"`
}
