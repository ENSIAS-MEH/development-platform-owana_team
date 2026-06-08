# ═══════════════════════════════════════════════════════════════════════════════
# RDS — PostgreSQL (single instance, all 6 databases)
# ═══════════════════════════════════════════════════════════════════════════════

resource "aws_db_instance" "postgres" {
  identifier = "${var.project_name}-postgres"

  # Engine
  engine         = "postgres"
  engine_version = "16"
  instance_class = var.rds_instance_class

  # Storage
  allocated_storage     = var.rds_allocated_storage_gb
  max_allocated_storage = 100 # Auto-scaling up to 100 GB
  storage_type          = "gp2"
  storage_encrypted     = true

  # Initial database (others created via init script)
  db_name  = "auth_db"
  username = var.db_username
  password = var.db_password
  port     = 5432

  # Networking — private, only reachable from the EC2 SG
  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = false # Single-AZ to minimise cost; set true for HA

  # Maintenance
  backup_retention_period = 0
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"
  deletion_protection     = false # Set true before going to real production
  skip_final_snapshot     = true  # Set false and add final_snapshot_identifier in prod

  # Parameter group — default postgres16 parameters
  parameter_group_name = aws_db_parameter_group.postgres16.name

  tags = { Name = "${var.project_name}-postgres" }
}

# ─── Parameter group ──────────────────────────────────────────────────────────

resource "aws_db_parameter_group" "postgres16" {
  name        = "${var.project_name}-postgres16"
  family      = "postgres16"
  description = "FoundersSync PostgreSQL 16 parameters"

  # Allow connections from all services (default is already permissive)
  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  tags = { Name = "${var.project_name}-postgres16-params" }
}

# ─── SSM Parameters — store RDS endpoint for reference ───────────────────────

resource "aws_ssm_parameter" "rds_endpoint" {
  name  = "/${var.project_name}/${var.environment}/rds/endpoint"
  type  = "String"
  value = aws_db_instance.postgres.address

  tags = { Name = "${var.project_name}-rds-endpoint-param" }
}

resource "aws_ssm_parameter" "rds_port" {
  name  = "/${var.project_name}/${var.environment}/rds/port"
  type  = "String"
  value = tostring(aws_db_instance.postgres.port)

  tags = { Name = "${var.project_name}-rds-port-param" }
}
