# ═══════════════════════════════════════════════════════════════════════════════
# Security Group — EC2 Application Server
# ═══════════════════════════════════════════════════════════════════════════════

resource "aws_security_group" "ec2" {
  name        = "${var.project_name}-ec2-sg"
  description = "FoundersSync application server security group"
  vpc_id      = aws_vpc.main.id

  # ── Inbound ─────────────────────────────────────────────────────────────────

  # SSH — restrict to trusted IPs in production
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidrs
  }

  # API Gateway — public entry point for the frontend
  ingress {
    description = "API Gateway"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend (Next.js) — if deployed on the same VM
  ingress {
    description = "Next.js frontend"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP / HTTPS — for Nginx reverse proxy (optional future use)
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Config Server — internal only (accessed by other services via Docker network)
  # Exposed here only if direct external debugging is needed
  ingress {
    description = "Spring Cloud Config Server"
    from_port   = 8888
    to_port     = 8888
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  # Individual microservice ports — VPC-internal only
  ingress {
    description = "Microservices (8081-8086)"
    from_port   = 8081
    to_port     = 8086
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  # RabbitMQ Management UI — accessible from within the VPC
  ingress {
    description = "RabbitMQ Management UI"
    from_port   = 15672
    to_port     = 15672
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  # ── Outbound ────────────────────────────────────────────────────────────────

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-ec2-sg" }
}

# ═══════════════════════════════════════════════════════════════════════════════
# Security Group — RDS PostgreSQL
# ═══════════════════════════════════════════════════════════════════════════════

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow PostgreSQL access only from EC2 application server"
  vpc_id      = aws_vpc.main.id

  # PostgreSQL — only from EC2 SG
  ingress {
    description     = "PostgreSQL from EC2"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-rds-sg" }
}
