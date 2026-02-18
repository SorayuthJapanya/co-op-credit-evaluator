-- Create members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cooperative_id VARCHAR(50) NOT NULL,
    id_card VARCHAR(20) NOT NULL UNIQUE,
    account_year VARCHAR(10) NOT NULL,
    member_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    shares_num DECIMAL(10,2) NOT NULL,
    shares_value DECIMAL(10,2) NOT NULL,
    joining_date TIMESTAMP,
    member_type BIGINT NOT NULL,
    leaving_date TIMESTAMP,
    address VARCHAR(255) NOT NULL,
    moo BIGINT NOT NULL,
    subdistrict VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);