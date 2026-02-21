package util

import "strings"

func ValidateAllToEmpty(filter string) string {
	if strings.ToLower(filter) == "all" || filter == "" {
		return ""
	}
	return filter
}