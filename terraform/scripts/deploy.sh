#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Provision or update the FoundersSync infrastructure
#
# Usage:
#   ./scripts/deploy.sh                    # uses terraform.tfvars
#   ./scripts/deploy.sh --target ec2       # apply only EC2 changes
#   ./scripts/deploy.sh --auto-approve     # skip interactive prompt
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TF_DIR="$(dirname "$SCRIPT_DIR")"

CYAN='\033[0;36m'; GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'

log()  { echo -e "${CYAN}[deploy]${NC} $*"; }
ok()   { echo -e "${GREEN}[deploy]${NC} $*"; }
err()  { echo -e "${RED}[deploy]${NC} $*" >&2; exit 1; }

# ─── Pre-flight checks ────────────────────────────────────────────────────────

command -v terraform >/dev/null 2>&1 || err "terraform is not installed. https://developer.hashicorp.com/terraform/install"
command -v aws       >/dev/null 2>&1 || err "aws CLI is not installed. https://aws.amazon.com/cli/"

aws sts get-caller-identity >/dev/null 2>&1 || err "AWS credentials not configured. Run: aws configure"

# ─── Ensure terraform.tfvars exists ──────────────────────────────────────────

TFVARS="$TF_DIR/terraform.tfvars"
if [ ! -f "$TFVARS" ]; then
  log "terraform.tfvars not found — copying from example..."
  cp "$TF_DIR/terraform.tfvars.example" "$TFVARS"
  err "Please fill in $TFVARS with your values, then re-run."
fi

# ─── Terraform workflow ───────────────────────────────────────────────────────

cd "$TF_DIR"

log "Running terraform init..."
terraform init -upgrade

log "Running terraform validate..."
terraform validate

log "Running terraform plan..."
terraform plan -out=tfplan -var-file="terraform.tfvars" "$@"

echo ""
read -rp "$(echo -e "${CYAN}[deploy]${NC} Apply the plan? [y/N] ")" CONFIRM
[[ "$CONFIRM" =~ ^[Yy]$ ]] || { log "Aborted."; exit 0; }

log "Running terraform apply..."
terraform apply tfplan

ok ""
ok "═══════════════════════════════════════════════"
ok " Deployment complete!"
ok ""
ok " API Gateway : $(terraform output -raw api_gateway_url)"
ok " SSH         : $(terraform output -raw ssh_command)"
ok " Bootstrap log:"
ok "   $(terraform output -raw bootstrap_log_command)"
ok "═══════════════════════════════════════════════"
