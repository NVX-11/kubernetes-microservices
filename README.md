# Microservices Platform on AWS EKS

Production-ready Kubernetes microservices platform with GitOps, monitoring, and CI/CD.

## Architecture

```
Internet → ALB → EKS Cluster
                  ├─ Frontend (React)
                  ├─ Backend API (Node.js)
                  ├─ Database (PostgreSQL)
                  └─ Monitoring (Prometheus + Grafana)
```

## Cost Optimization

- **2 AZs** instead of 3 (reduce NAT Gateway costs)
- **1 NAT Gateway** instead of 3 ($32/month saved)
- **SPOT instances** (70% cheaper than On-Demand)
- **t3.small nodes** (minimum for EKS)
- **2 nodes minimum** (HA while cost-effective)

**Estimated Cost**: ~$80/month

## Prerequisites

- AWS CLI configured
- Terraform >= 1.13
- kubectl
- helm

## Quick Start

```bash
cd terraform
terraform init
terraform plan
terraform apply

aws eks update-kubeconfig --region us-east-1 --name microservices-eks
kubectl get nodes
```

## Project Structure

```
kubernetes-microservices/
├── terraform/           # Infrastructure as Code
│   ├── modules/
│   │   ├── vpc/        # VPC with public/private subnets
│   │   └── eks/        # EKS cluster and node groups
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── kubernetes/          # K8s manifests
├── apps/               # Microservices source code
└── docs/               # Documentation
```

## Features

✅ Multi-AZ EKS cluster (2 AZs)
✅ SPOT instances (cost optimization)
✅ Private node subnets
✅ NAT Gateway for outbound traffic
✅ OIDC provider for IRSA
✅ Production-ready networking

## Deployment Steps

### 1. Deploy Infrastructure

```bash
cd terraform
terraform init
terraform apply -auto-approve
```

Wait 15 minutes for EKS cluster creation.

### 2. Configure kubectl

```bash
aws eks update-kubeconfig --region us-east-1 --name microservices-eks
kubectl get nodes
```

### 3. Deploy Applications

```bash
kubectl apply -f kubernetes/base/postgres-deployment.yaml
kubectl apply -f kubernetes/base/backend-deployment.yaml
kubectl apply -f kubernetes/base/frontend-deployment.yaml
kubectl apply -f kubernetes/base/ingress.yaml
```

### 4. Get Load Balancer URL

```bash
kubectl get ingress main-ingress
```

Open the ADDRESS in your browser.

## Cleanup

```bash
kubectl delete -f kubernetes/base/
cd terraform
terraform destroy -auto-approve
```
