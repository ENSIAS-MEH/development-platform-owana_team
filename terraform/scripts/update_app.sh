#!/usr/bin/env bash
# =============================================================================
# Usage (from local machine):
#   KEY_PATH=~/.ssh/my-key.pem EC2_IP=1.2.3.4 ./scripts/update_app.sh
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TF_DIR="$(dirname "$SCRIPT_DIR")"

EC2_IP="${EC2_IP:-$(cd "$TF_DIR" && terraform output -raw ec2_public_ip 2>/dev/null)}"
KEY_NAME="${KEY_NAME:-$(cd "$TF_DIR" && terraform output -raw ec2_instance_id 2>/dev/null | xargs -I{} echo "founderssync-key")}"
KEY_PATH="${KEY_PATH:-~/.ssh/${KEY_NAME}.pem}"

[ -z "$EC2_IP" ] && { echo "EC2_IP not set and terraform output failed."; exit 1; }

echo "Deploying to EC2: $EC2_IP"

ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no "ec2-user@$EC2_IP" '
  set -euo pipefail
  APP_DIR="/opt/founderssync/backend"

  echo "==> Pulling latest code..."
  git -C "$APP_DIR" pull --ff-only

  echo "==> Rebuilding and restarting containers..."
  cd "$APP_DIR"
  docker compose pull 2>/dev/null || true
  docker compose up -d --build

  echo "==> Container status:"
  docker compose ps
'

echo ""
echo "Update complete. API Gateway: http://$EC2_IP:8080"
