package database

import (
	"log"
	"os"
)

// CreateIndexes creates performance indexes for the database
func CreateIndexes() {
	env := os.Getenv("ENV")
	if env == "production" {
		log.Println("Creating database indexes for production...")

		// Member indexes
		if err := DB.Exec("CREATE INDEX IF NOT EXISTS idx_members_full_name ON members (full_name)").Error; err != nil {
			log.Printf("Failed to create idx_members_full_name: %v", err)
		}

		if err := DB.Exec("CREATE INDEX IF NOT EXISTS idx_members_subdistrict ON members (subdistrict)").Error; err != nil {
			log.Printf("Failed to create idx_members_subdistrict: %v", err)
		}

		if err := DB.Exec("CREATE INDEX IF NOT EXISTS idx_members_district ON members (district)").Error; err != nil {
			log.Printf("Failed to create idx_members_district: %v", err)
		}

		if err := DB.Exec("CREATE INDEX IF NOT EXISTS idx_members_province ON members (province)").Error; err != nil {
			log.Printf("Failed to create idx_members_province: %v", err)
		}

		if err := DB.Exec("CREATE INDEX IF NOT EXISTS idx_members_cooperative_id ON members (cooperative_id)").Error; err != nil {
			log.Printf("Failed to create idx_members_cooperative_id: %v", err)
		}

		// Composite index for member_id sorting
		if err := DB.Exec("CREATE INDEX IF NOT EXISTS idx_members_member_id ON members (member_id)").Error; err != nil {
			log.Printf("Failed to create idx_members_member_id: %v", err)
		}

		// Evaluate indexes
		if err := DB.Exec("CREATE INDEX IF NOT EXISTS idx_evaluates_user_id ON evaluates (user_id)").Error; err != nil {
			log.Printf("Failed to create idx_evaluates_user_id: %v", err)
		}

		if err := DB.Exec("CREATE INDEX IF NOT EXISTS idx_evaluates_created_at ON evaluates (created_at)").Error; err != nil {
			log.Printf("Failed to create idx_evaluates_created_at: %v", err)
		}

		// Applicant indexes
		if err := DB.Exec("CREATE INDEX IF NOT EXISTS idx_applicants_evaluate_id ON applicants (evaluate_id)").Error; err != nil {
			log.Printf("Failed to create idx_applicants_evaluate_id: %v", err)
		}

		log.Println("Database indexes created successfully")
	}
}
