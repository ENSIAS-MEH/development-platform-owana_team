# FoundersSync — Terraform Infrastructure (Person N)

This directory contains all Terraform code to provision the FoundersSync
production infrastructure on **AWS eu-west-3 (Paris)**.

---

## Architecture overview

```
Internet
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  VPC  10.0.0.0/16                                       │
│                                                         │
│  ┌─────────────────────────────────────┐                │
│  │  Public Subnet  10.0.1.0/24  (AZ a) │                │
│  │                                     │                │
│  │  ┌──────────────────────────────┐   │                │
│  │  │  EC2  t3.large               │   │                │
│  │  │  Elastic IP (static)         │   │                │
│  │  │                              │   │                │
│  │  │  Docker Compose:             │   │                │
│  │  │  ├─ config-server   :8888    │   │                │
│  │  │  ├─ api-gateway     :8080 ◄──┼───┼── public       │
│  │  │  ├─ auth-service    :8081    │   │                │
│  │  │  ├─ user-service    :8082    │   │                │
│  │  │  ├─ startup-service :8083    │   │                │
│  │  │  ├─ post-service    :8084    │   │                │
│  │  │  ├─ chat-service    :8085    │   │                │
│  │  │  ├─ notification    :8086    │   │                │
│  │  │  └─ rabbitmq        :5672    │   │                │
│  │  └──────────────────────────────┘   │                │
│  └─────────────────────────────────────┘                │
│                                                         │
│  ┌───────────────────────────┐  ┌──────────────────┐   │
│  │ Private Subnet A (AZ a)   │  │ Private Subnet B  │   │
│  │ 10.0.10.0/24              │  │ (AZ b) 10.0.11/24 │   │
│  │                           │  │                   │   │
│  │  ┌─────────────────────┐  │  │  (RDS standby)    │   │
│  │  │  RDS PostgreSQL 16  │  │  │                   │   │
│  │  │  db.t3.micro        │  │  │                   │   │
│  │  │  Databases:         │  │  │                   │   │
│  │  │  auth_db            │  │  │                   │   │
│  │  │  users_db           │  │  │                   │   │
│  │  │  startup_db         │  │  │                   │   │
│  │  │  posts_db           │  │  │                   │   │
│  │  │  chat_db            │  │  │                   │   │
│  │  │  notification_db    │  │  │                   │   │
│  │  └─────────────────────┘  │  │                   │   │
│  └───────────────────────────┘  └──────────────────-┘   │
└─────────────────────────────────────────────────────────┘
```

---

## File structure

```
terraform/
├── main.tf                   # Locals + data sources
├── versions.tf               # Terraform + provider versions, S3 backend
├── variables.tf              # All input variables with descriptions
├── network.tf                # VPC, subnets, IGW, route tables
├── security_groups.tf        # EC2 and RDS security groups
├── ec2.tf                    # EC2 instance + Elastic IP
├── rds.tf                    # RDS PostgreSQL + parameter group + SSM
├── outputs.tf                # All output values
├── terraform.tfvars.example  # Template — copy to terraform.tfvars
├── .gitignore                # Excludes state, tfvars, .terraform/
├── templates/
│   └── user_data.sh.tpl      # EC2 bootstrap (Docker install + app start)
├── scripts/
│   ├── deploy.sh             # terraform init + plan + apply wrapper
│   ├── destroy.sh            # Safe destroy with confirmation + snapshot
│   ├── init_databases.sh     # Create missing PostgreSQL databases on RDS
│   └── update_app.sh         # SSH into EC2 and pull + restart containers
└── README.md                 # This file
```

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Terraform | ≥ 1.6.0 | https://developer.hashicorp.com/terraform/install |
| AWS CLI | ≥ 2.x | https://aws.amazon.com/cli/ |
| AWS credentials | configured | `aws configure` |
| EC2 key pair | existing | AWS Console → EC2 → Key Pairs |

---

## Step-by-step deployment

### 1 — Configure credentials

```bash
aws configure
# AWS Access Key ID: YOUR_KEY
# AWS Secret Access Key: YOUR_SECRET
# Default region: eu-west-3
# Default output format: json
```

Verify:
```bash
aws sts get-caller-identity
```

### 2 — Create an EC2 key pair (if you don't have one)

```bash
aws ec2 create-key-pair \
  --key-name founderssync-key \
  --region eu-west-3 \
  --query 'KeyMaterial' \
  --output text > ~/.ssh/founderssync-key.pem

chmod 400 ~/.ssh/founderssync-key.pem
```

### 3 — Create your tfvars file

```bash
cd terraform/
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — fill in all values
```

### 4 — Initialize Terraform

```bash
terraform init
```

### 5 — Preview the plan

```bash
terraform plan
```

Review the output. You should see approximately **17 resources** to be created.

### 6 — Apply

```bash
terraform apply
```

Or use the helper script:
```bash
./scripts/deploy.sh
```

Type `yes` when prompted. Terraform will:
1. Create the VPC, subnets, security groups
2. Launch the RDS PostgreSQL instance (~5 min)
3. Launch the EC2 instance — the bootstrap script runs automatically

### 7 — Wait for bootstrap to complete (~5-10 min)

```bash
# Watch the bootstrap log live
$(terraform output -raw bootstrap_log_command)
```

When you see `Bootstrap complete`, the application is running.

### 8 — Create the missing databases on RDS

RDS auto-creates `auth_db` only. Run the init script to create the other 5:

```bash
./scripts/init_databases.sh
```

### 9 — Verify everything is up

```bash
# Check API Gateway health
curl $(terraform output -raw api_gateway_url)/actuator/health

# SSH into the server
$(terraform output -raw ssh_command)

# On the server: check all containers
docker compose -f /opt/founderssync/backend/docker-compose.yml ps
```

---

## Enable remote state (recommended for team work)

Before running `terraform init`, create the S3 bucket and DynamoDB table:

```bash
aws s3 mb s3://founderssync-terraform-state --region eu-west-3

aws dynamodb create-table \
  --table-name founderssync-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-west-3
```

Then uncomment the `backend "s3"` block in `versions.tf` and run:

```bash
terraform init -migrate-state
```

---

## Updating the application

After Person A (Docker) and Person O (Docker Compose) finish their work and
push to the repo:

```bash
./scripts/update_app.sh
```

This SSH-es into EC2, pulls the latest code, and restarts Docker Compose.

---

## Destroying the infrastructure

```bash
./scripts/destroy.sh
```

The script will:
1. Prompt you to type `destroy` to confirm
2. Take a final RDS snapshot
3. Run `terraform destroy`

---

## Cost estimate (eu-west-3 Paris)

### AWS Free Tier (default configuration — school/demo use)

The defaults in this repo are tuned for the **AWS Free Tier**, which every new AWS account receives for 12 months.

| Resource | Type | Free Tier allowance | Monthly cost |
|---|---|---|---|
| EC2 | t2.micro | 750 hrs/month (1 instance) | **$0** |
| Elastic IP | attached to running instance | free while attached | **$0** |
| RDS PostgreSQL | db.t3.micro | 750 hrs/month | **$0** |
| EBS root volume | 30 GB gp2/gp3 | 30 GB included | **$0** |
| Data transfer out | first 100 GB | first 1 GB free, ~$0.09/GB after | ~$1 |
| **Total** | | | **~$0–1/month** |

> **Note:** Free Tier limits are per-account, not per-service. If you already have other resources running, you may consume part of your allowance.

### Production configuration (upgrade path)

When the school project becomes a real product, change one variable in `terraform.tfvars`:

```hcl
ec2_instance_type       = "t3.large"   # 2 vCPU / 8 GB — handles all 8 JVMs comfortably
ec2_root_volume_size_gb = 40
```

| Resource | Type | $/month |
|---|---|---|
| EC2 | t3.large | ~$60 |
| Elastic IP | attached | $0 |
| RDS PostgreSQL | db.t3.micro 20 GB | ~$18 |
| EBS root volume | 40 GB gp3 | ~$3 |
| Data transfer | ~10 GB | ~$1 |
| **Total** | | **~$82/month** |

### ⚠️ t2.micro memory note

A t2.micro has **1 GB of RAM**. Running 8 Spring Boot JVMs + RabbitMQ on 1 GB is tight. Each JVM defaults to consuming 200–400 MB. To make it work, Person O's `docker-compose.yml` should add JVM heap limits to every service, for example:

```yaml
environment:
  JAVA_OPTS: "-Xms64m -Xmx128m"
```

This is enough for a demo. For normal usage, upgrade to t3.large.

---

## S3 note (optional)

Two services use AWS S3 for file uploads: `user-service` (profile pictures) and `startup-service` (attachments). S3 itself is **not required** to run the application — the services start and function normally without it; only the file upload endpoints will fail.

AWS Free Tier includes 5 GB of S3 storage, which is more than enough for a school demo.

To skip S3 entirely, leave these blank in `terraform.tfvars`:

```hcl
aws_access_key_app = ""
aws_secret_key_app = ""
```

The services will start, but `POST /api/users/me/picture` and startup file uploads will return an error.

---

## Troubleshooting

### Bootstrap didn't run / containers not starting

```bash
# Connect to EC2
$(terraform output -raw ssh_command)

# Check bootstrap log
sudo cat /var/log/founderssync-bootstrap.log

# Check Docker Compose log
cat /var/log/founderssync-compose.log

# Check container status
cd /opt/founderssync/backend
docker compose ps
docker compose logs --tail=50 api-gateway
```

### terraform apply fails on RDS

RDS creation takes 5-10 minutes. If you get a timeout, run:
```bash
terraform apply  # Terraform is idempotent — safe to re-run
```

### Cannot SSH into EC2

1. Check `allowed_ssh_cidrs` in `terraform.tfvars` — must include your IP
2. Verify the key pair name matches exactly what's in AWS
3. Confirm the instance is in `running` state:
   ```bash
   aws ec2 describe-instances --region eu-west-3 --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]' --output table
   ```
