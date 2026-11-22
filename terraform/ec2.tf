# ─── Latest Amazon Linux 2023 AMI (auto-resolved per region) ──────────────────

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ═══════════════════════════════════════════════════════════════════════════════
# EC2 — FoundersSync Application Server
# ═══════════════════════════════════════════════════════════════════════════════

resource "aws_instance" "app_server" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type 	 = var.ec2_instance_type
  key_name               = var.ec2_key_pair_name
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2.id]

  root_block_device {
    volume_size           = var.ec2_root_volume_size_gb
    volume_type           = "gp3"
    delete_on_termination = true
    encrypted             = true
  }

  # ── Bootstrap script ────────────────────────────────────────────────────────
  # Runs once on first boot as root.
  # Installs: Docker, Docker Compose v2, Git, Java 21 (for local builds if needed)
  # Clones the backend repo and writes the .env file from Terraform variables.
  user_data = templatefile("${path.module}/templates/user_data.sh.tpl", {
    project_name         = var.project_name
    db_username          = var.db_username
    db_password          = var.db_password
    jwt_secret           = var.jwt_secret
    mail_username        = var.mail_username
    mail_password        = var.mail_password
    admin_email          = var.admin_email
    admin_password       = var.admin_password
    aws_access_key_app   = var.aws_access_key_app
    aws_secret_key_app   = var.aws_secret_key_app
    aws_s3_bucket_name   = var.aws_s3_bucket_name
    aws_region           = var.aws_region
    frontend_url         = var.frontend_url
    cors_allowed_origins = var.cors_allowed_origins
    # RDS endpoints injected after they are created
    rds_endpoint = aws_db_instance.postgres.address
  })

  user_data_replace_on_change = false # Don't destroy instance on env-var changes

  tags = { Name = "${var.project_name}-app-server" }
}

# ─── Elastic IP — stable public address survives stop/start ───────────────────

resource "aws_eip" "app_server" {
  instance = aws_instance.app_server.id
  domain   = "vpc"

  tags = { Name = "${var.project_name}-eip" }

  depends_on = [aws_internet_gateway.igw]
}
