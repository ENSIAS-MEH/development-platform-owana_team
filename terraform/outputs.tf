# ═══════════════════════════════════════════════════════════════════════════════
# Outputs
# ═══════════════════════════════════════════════════════════════════════════════

# ─── Networking ───────────────────────────────────────────────────────────────

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}

# ─── EC2 ──────────────────────────────────────────────────────────────────────

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.app_server.id
}

output "ec2_public_ip" {
  description = "Elastic IP address of the application server"
  value       = aws_eip.app_server.public_ip
}

output "ec2_private_ip" {
  description = "Private IP of the EC2 instance (for internal VPC routing)"
  value       = aws_instance.app_server.private_ip
}

output "ssh_command" {
  description = "Ready-to-run SSH command"
  value       = "ssh -i ~/.ssh/${var.ec2_key_pair_name}.pem ec2-user@${aws_eip.app_server.public_ip}"
}

output "api_gateway_url" {
  description = "Public URL of the FoundersSync API Gateway"
  value       = "http://${aws_eip.app_server.public_ip}:8080"
}

# ─── RDS ──────────────────────────────────────────────────────────────────────

output "rds_endpoint" {
  description = "RDS PostgreSQL hostname (private, only reachable from EC2)"
  value       = aws_db_instance.postgres.address
}

output "rds_port" {
  description = "RDS PostgreSQL port"
  value       = aws_db_instance.postgres.port
}

output "rds_databases" {
  description = "List of databases that should exist on this RDS instance"
  value       = ["auth_db", "users_db", "startup_db", "posts_db", "chat_db", "notification_db"]
}

output "rds_jdbc_base_url" {
  description = "JDBC base URL (append database name)"
  value       = "jdbc:postgresql://${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/"
  sensitive   = false
}

# ─── Service endpoints ────────────────────────────────────────────────────────

output "service_endpoints" {
  description = "Map of all FoundersSync service endpoints (via API Gateway)"
  value = {
    api_gateway   = "http://${aws_eip.app_server.public_ip}:8080"
    auth_api      = "http://${aws_eip.app_server.public_ip}:8080/api/auth"
    users_api     = "http://${aws_eip.app_server.public_ip}:8080/api/users"
    startups_api  = "http://${aws_eip.app_server.public_ip}:8080/api/startups"
    posts_api     = "http://${aws_eip.app_server.public_ip}:8080/api/posts"
    chat_api      = "http://${aws_eip.app_server.public_ip}:8080/api/conversations"
    notifications = "http://${aws_eip.app_server.public_ip}:8080/api/notifications"
  }
}

# ─── Bootstrap log location ───────────────────────────────────────────────────

output "bootstrap_log_command" {
  description = "Command to tail the bootstrap log on the EC2 instance"
  value       = "ssh -i ~/.ssh/${var.ec2_key_pair_name}.pem ec2-user@${aws_eip.app_server.public_ip} 'sudo tail -f /var/log/founderssync-bootstrap.log'"
}
