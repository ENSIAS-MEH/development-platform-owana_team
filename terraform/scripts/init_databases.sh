#!/usr/bin/env bash
# =============================================================================
# init_databases.sh — Create all FoundersSync databases on RDS
#
# Prerequisites: psql installed locally AND an SSH tunnel or bastion,
# OR run directly from the EC2 instance.
#
# Usage (from your local machine via SSH tunnel):
#   ssh -L 5433:<RDS_ENDPOINT>:5432 ec2-user@<EC2_IP> -N &
#   RDS_HOST=localhost RDS_PORT=5433 ./scripts/init_databases.sh
#
# Usage (from EC2 instance directly):
#   ./scripts/init_databases.sh
# =============================================================================
set -euo pipefail

RDS_HOST="${RDS_HOST:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && terraform output -raw rds_endpoint 2>/dev/null)}"
RDS_PORT="${RDS_PORT:-5432}"
DB_USER="${DB_USERNAME:-founderssync}"

command -v psql >/dev/null 2>&1 || { echo "psql not found. Install postgresql-client."; exit 1; }

echo "Connecting to PostgreSQL at $RDS_HOST:$RDS_PORT as $DB_USER..."
echo "Enter the master DB password when prompted."
echo ""

DATABASES=(users_db startup_db posts_db chat_db notification_db)

for DB in "${DATABASES[@]}"; do
  echo "Creating database: $DB"
  psql -h "$RDS_HOST" -p "$RDS_PORT" -U "$DB_USER" -d auth_db \
    -c "SELECT 1 FROM pg_database WHERE datname='$DB'" | grep -q 1 && \
    echo "  $DB already exists — skipping" || \
    psql -h "$RDS_HOST" -p "$RDS_PORT" -U "$DB_USER" -d auth_db \
      -c "CREATE DATABASE $DB OWNER $DB_USER;"
done

echo ""
echo "All databases ready:"
psql -h "$RDS_HOST" -p "$RDS_PORT" -U "$DB_USER" -d auth_db \
  -c "\l" | grep -E "auth_db|users_db|startup_db|posts_db|chat_db|notification_db"
