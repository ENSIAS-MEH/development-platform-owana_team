#!/usr/bin/env bash
# =============================================================================
# destroy.sh — Tear down the FoundersSync infrastructure
#
# WARNING: This destroys the EC2 instance, Elastic IP, and RDS instance.
#          All data on RDS will be lost unless a snapshot was taken.
#
# Usage:
#   ./scripts/destroy.sh
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TF_DIR="$(dirname "$SCRIPT_DIR")"

RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

log()  { echo -e "${YELLOW}[destroy]${NC} $*"; }
err()  { echo -e "${RED}[destroy]${NC} $*" >&2; exit 1; }

command -v terraform >/dev/null 2>&1 || err "terraform is not installed."
aws sts get-caller-identity >/dev/null 2>&1 || err "AWS credentials not configured."

cd "$TF_DIR"

echo -e "${RED}"
echo "  ██████╗  █████╗ ███╗   ██╗ ██████╗ ███████╗██████╗ "
echo "  ██╔══██╗██╔══██╗████╗  ██║██╔════╝ ██╔════╝██╔══██╗"
echo "  ██║  ██║███████║██╔██╗ ██║██║  ███╗█████╗  ██████╔╝"
echo "  ██║  ██║██╔══██║██║╚██╗██║██║   ██║██╔══╝  ██╔══██╗"
echo "  ██████╔╝██║  ██║██║ ╚████║╚██████╔╝███████╗██║  ██║"
echo "  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝"
echo -e "${NC}"
echo ""
log "This will DESTROY all FoundersSync infrastructure:"
echo "  - EC2 application server + Elastic IP"
echo "  - RDS PostgreSQL instance (ALL DATA LOST)"
echo "  - VPC, subnets, security groups"
echo "  - SSM parameters"
echo ""
read -rp "$(echo -e "${RED}[destroy]${NC} Type 'destroy' to confirm: ")" CONFIRM

[[ "$CONFIRM" == "destroy" ]] || { log "Aborted — nothing was destroyed."; exit 0; }

log "Creating final RDS snapshot before destroy..."
SNAPSHOT_ID="founderssync-final-snapshot-$(date +%Y%m%d-%H%M%S)"
RDS_ID=$(terraform output -raw rds_endpoint 2>/dev/null | cut -d. -f1 || true)
if [ -n "$RDS_ID" ]; then
  aws rds create-db-snapshot \
    --db-instance-identifier "founderssync-postgres" \
    --db-snapshot-identifier "$SNAPSHOT_ID" \
    --region "$(terraform output -raw ec2_public_ip 2>/dev/null | xargs -I{} echo eu-west-3 || echo eu-west-3)" \
    2>/dev/null && log "Snapshot requested: $SNAPSHOT_ID" || log "Snapshot skipped (instance may already be gone)"
fi

log "Running terraform destroy..."
terraform destroy -var-file="terraform.tfvars" -auto-approve

log "Infrastructure destroyed."
