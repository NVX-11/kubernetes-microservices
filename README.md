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

Infrastructure:
- Multi-AZ EKS cluster (2 AZs)
- SPOT instances (cost optimization)
- Private node subnets
- NAT Gateway for outbound traffic
- OIDC provider for IRSA
- Production-ready networking

Applications:
- Frontend (React)
- Backend API (Node.js + Express)
- PostgreSQL database
- Horizontal Pod Autoscaling
- Health probes (liveness + readiness)

DevOps & GitOps:
- Helm charts for deployment
- ArgoCD for GitOps
- GitHub Actions CI/CD
- Prometheus + Grafana monitoring
- Automated image builds and deployments

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

### 3. Install Monitoring

```bash
cd kubernetes/monitoring
./install-monitoring.sh
```

Access Grafana:
```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80
```
Open http://localhost:3000 (Username: admin, Password: admin)

### 4. Install ArgoCD

```bash
cd kubernetes/gitops
./install-argocd.sh
```

Access ArgoCD:
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
Open https://localhost:8080

Get admin password:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d
```

### 5. Deploy Applications

Option A: Using kubectl:
```bash
kubectl apply -f kubernetes/base/
```

Option B: Using Helm:
```bash
helm install microservices helm/microservices/
```

Option C: Using ArgoCD (GitOps):
```bash
kubectl apply -f kubernetes/gitops/application.yaml
```

### 6. Get Load Balancer URL

```bash
kubectl get ingress main-ingress
```

Open the ADDRESS in your browser.

## CI/CD Pipeline

This project uses GitHub Actions for automated builds and deployments.

Required GitHub Secrets:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

The pipeline automatically:
1. Builds Docker images for frontend and backend
2. Pushes images to Amazon ECR
3. Deploys to EKS cluster on every push to main branch

## Monitoring

Prometheus metrics available at:
```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090
```

Grafana dashboards:
- Kubernetes cluster monitoring
- Pod resource usage
- Application metrics

## Cleanup

```bash
kubectl delete -f kubernetes/base/
helm uninstall kube-prometheus-stack -n monitoring
helm uninstall microservices
cd terraform
terraform destroy -auto-approve
```
