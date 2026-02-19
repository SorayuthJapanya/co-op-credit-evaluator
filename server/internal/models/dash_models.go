package models

// KPI Response Models
type KPIDashboardResponse struct {
	TotalMembers           int64                `json:"totalMembers"`
	TotalShares            float64              `json:"totalShares"`
	AverageSharesPerPerson float64              `json:"averageSharesPerPerson"`
	MembersThisYear        MembersThisYearStats `json:"membersThisYear"`
}

type MembersThisYearStats struct {
	CurrentCount  int64 `json:"currentCount"`
	LastYearCount int64 `json:"lastYearCount"`
	MemberChange  int64 `json:"memberChange"`
}

// Chart Data Models
type MembershipGrowthData struct {
	Year  int `json:"year"`
	Count int `json:"count"`
}

// Chart Membership Growth Response
type MembershipGrowthDataResponse struct {
	Data []MembershipGrowthData `json:"data"`
}

// Chart MembershipCount by Subdistrict
type MembershipCountBySubdistrictData struct {
	Subdistrict string  `json:"subdistrict"`
	Count       int64   `json:"count"`
	Percent     float64 `json:"percent"`
}

// Chart MembershipCount by Subdistrict Response
type MembershipCountBySubdistrictDataResponse struct {
	Data []MembershipCountBySubdistrictData `json:"data"`
}

// Shares Distribution Models
type SharesDistributionData struct {
	Bucket      string  `json:"bucket"`
	MemberCount int64   `json:"memberCount"`
	Percentage  float64 `json:"percentage"`
}

type SharesDistributionResponse struct {
	Data []SharesDistributionData `json:"data"`
}