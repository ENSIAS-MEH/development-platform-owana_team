# ═══════════════════════════════════════════════════════════════════════════════
# FoundersSync — Terraform Main
#
# Resources defined in dedicated files:
#   network.tf         VPC, subnets, IGW, route tables, RDS subnet group
#   security_groups.tf EC2 and RDS security groups
#   ec2.tf             EC2 instance + Elastic IP
#   rds.tf             RDS PostgreSQL instance + parameter group + SSM params
#   outputs.tf         All output values
#
# This file holds only the locals and data sources used across modules.
# ═══════════════════════════════════════════════════════════════════════════════

locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = {
    Project     = "FoundersSync"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ─── Availability zones available in the chosen region ────────────────────────

data "aws_availability_zones" "available" {
  state = "available"
}
