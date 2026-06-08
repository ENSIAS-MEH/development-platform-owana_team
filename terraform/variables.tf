# ─── General ──────────────────────────────────────────────────────────────────

variable "aws_region" {
  description = "AWS region where all resources are deployed"
  type        = string
  default     = "eu-west-3"
}

variable "environment" {
  description = "Deployment environment (prod | staging | dev)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Short project identifier used in resource names"
  type        = string
  default     = "founderssync"
}

# ─── Networking ───────────────────────────────────────────────────────────────

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR for the public subnet (EC2 lives here)"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_a_cidr" {
  description = "CIDR for private subnet A (RDS — AZ a)"
  type        = string
  default     = "10.0.10.0/24"
}

variable "private_subnet_b_cidr" {
  description = "CIDR for private subnet B (RDS — AZ b, required by RDS subnet group)"
  type        = string
  default     = "10.0.11.0/24"
}

# ─── EC2 ──────────────────────────────────────────────────────────────────────

variable "ec2_instance_type" {
  description = "EC2 instance type for the application server. Use t2.micro for AWS Free Tier (1 vCPU / 1 GB RAM). Upgrade to t3.large (2 vCPU / 8 GB) for a real production deployment."
  type        = string
  default     = "t3.micro" # AWS Free Tier eligible (12 months)
}

variable "ec2_key_pair_name" {
  description = "Name of an existing EC2 key pair for SSH access"
  type        = string
  # Set via -var or terraform.tfvars — no default to force explicit supply
}

variable "ec2_root_volume_size_gb" {
  description = "Root EBS volume size in GB for the EC2 instance. AWS Free Tier includes 30 GB of gp2/gp3 EBS storage."
  type        = number
  default     = 30 # AWS Free Tier limit — do not exceed 30 GB on Free Tier
}

variable "allowed_ssh_cidrs" {
  description = "List of CIDR blocks allowed to SSH into the EC2 instance. MUST be set to your own IP: [\"YOUR_IP/32\"]. Leaving this open to the internet (0.0.0.0/0) is a security risk."
  type        = list(string)
  # No default — Terraform will error if not set, forcing you to supply your IP.
  # Example in terraform.tfvars:
  #   allowed_ssh_cidrs = ["203.0.113.42/32"]
  # Find your IP: curl https://checkip.amazonaws.com
}

# ─── RDS ──────────────────────────────────────────────────────────────────────

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "rds_allocated_storage_gb" {
  description = "Allocated storage for each RDS instance in GB"
  type        = number
  default     = 20
}

variable "db_username" {
  description = "Master PostgreSQL username (used for all RDS instances)"
  type        = string
  default     = "founderssync"
  sensitive   = true
}

variable "db_password" {
  description = "Master PostgreSQL password (used for all RDS instances)"
  type        = string
  sensitive   = true
  # No default — must be supplied via TF_VAR_db_password or terraform.tfvars
}

# ─── Application secrets ──────────────────────────────────────────────────────

variable "jwt_secret" {
  description = "JWT signing secret (≥ 32 characters)"
  type        = string
  sensitive   = true
  default     = "founderssync_jwt_secret_minimum_32_characters_ok"
}

variable "mail_username" {
  description = "SMTP username (Gmail address)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "mail_password" {
  description = "SMTP app password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "admin_email" {
  description = "Seed admin account email"
  type        = string
  default     = "admin@founderssync.com"
}

variable "admin_password" {
  description = "Seed admin account password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "aws_access_key_app" {
  description = "AWS Access Key used by user-service / startup-service for S3"
  type        = string
  sensitive   = true
  default     = ""
}

variable "aws_secret_key_app" {
  description = "AWS Secret Key used by user-service / startup-service for S3"
  type        = string
  sensitive   = true
  default     = ""
}

variable "aws_s3_bucket_name" {
  description = "S3 bucket name for profile pictures and startup uploads"
  type        = string
  default     = "founderssync-uploads"
}

variable "frontend_url" {
  description = "Frontend origin URL (used for CORS and email links)"
  type        = string
  default     = "http://localhost:3000"
}

variable "cors_allowed_origins" {
  description = "Comma-separated list of origins allowed by the API Gateway"
  type        = string
  default     = "http://localhost:3000"
}
