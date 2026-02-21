package models

type FullDropdown struct {
	SubDistricts []string `json:"subdistricts"`
	Districts   []string `json:"districts"`
	Provinces   []string `json:"provinces"`
}