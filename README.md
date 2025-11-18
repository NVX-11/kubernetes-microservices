# Kubernetes Microservices Platform on AWS EKS

A production-grade microservices deployment running on Amazon EKS, designed to demonstrate cloud-native architecture and DevOps best practices. This project showcases container orchestration, infrastructure automation, monitoring, and cost optimization techniques.

## Why This Project?

I built this to show hands-on experience with enterprise Kubernetes deployments. Instead of just running containers locally, this demonstrates real-world cloud infrastructure: multi-AZ networking, autoscaling, monitoring, and infrastructure as code. It's the kind of setup you'd see in a production environment, just optimized for cost.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Cloud (us-east-1)                     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    VPC (10.0.0.0/16)                       │ │
│  │                                                             │ │
│  │  ┌──────────────────┐         ┌──────────────────┐        │ │
│  │  │  Public Subnet   │         │  Public Subnet   │        │ │
│  │  │  us-east-1a      │         │  us-east-1b      │        │ │
│  │  │  10.0.0.0/24     │         │  10.0.1.0/24     │        │ │
│  │  │                  │         │                  │        │ │
│  │  │  ┌────────────┐  │         │                  │        │ │
│  │  │  │ NAT Gateway│  │         │                  │        │ │
│  │  │  └────────────┘  │         │                  │        │ │
│  │  └──────────────────┘         └──────────────────┘        │ │
│  │           │                            │                   │ │
│  │           │                            │                   │ │
│  │  ┌──────────────────┐         ┌──────────────────┐        │ │
│  │  │  Private Subnet  │         │  Private Subnet  │        │ │
│  │  │  us-east-1a      │         │  us-east-1b      │        │ │
│  │  │  10.0.10.0/24    │         │  10.0.11.0/24    │        │ │
│  │  │                  │         │                  │        │ │
│  │  │  ┌────────────┐  │         │  ┌────────────┐  │        │ │
│  │  │  │  EKS Node  │  │         │  │  EKS Node  │  │        │ │
│  │  │  │  t3.small  │  │         │  │  t3.small  │  │        │ │
│  │  │  │  (SPOT)    │  │         │  │  (SPOT)    │  │        │ │
│  │  │  └────────────┘  │         │  └────────────┘  │        │ │
│  │  └──────────────────┘         └──────────────────┘        │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              EKS Cluster (microservices-eks)               │ │
│  │                                                             │ │
│  │  ┌──────────────┐    ┌──────────────┐                     │ │
│  │  │   Frontend   │    │   Backend    │                     │ │
│  │  │   (Nginx +   │───▶│  (Node.js    │                     │ │
│  │  │    React)    │    │   Express)   │                     │ │
│  │  │  2 replicas  │    │  2 replicas  │                     │ │
│  │  └──────────────┘    └──────────────┘                     │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────┐             │ │
│  │  │       Horizontal Pod Autoscaler          │             │ │
│  │  │    (Scale 2-5 based on CPU: 70%)         │             │ │
│  │  └──────────────────────────────────────────┘             │ │
│  │                                                             │ │
│  │  ┌──────────────┐    ┌──────────────┐                     │ │
│  │  │  Prometheus  │    │   Grafana    │                     │ │
│  │  │  (Metrics)   │───▶│ (Dashboard)  │                     │ │
│  │  └──────────────┘    └──────────────┘                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            Amazon ECR (Container Registry)                  │ │
│  │   ├─ microservices/frontend:latest                         │ │
│  │   └─ microservices/backend:latest                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## What's Inside

### Infrastructure Layer
- **AWS EKS 1.28** - Managed Kubernetes service running the whole show
- **Multi-AZ Setup** - Spread across 2 availability zones for high availability
- **Private Networking** - Nodes run in private subnets, internet access through NAT
- **SPOT Instances** - Using t3.small SPOT instances to cut compute costs by 70%
- **Cost-Optimized VPC** - Single NAT gateway instead of one per AZ (saves ~$64/month)

### Application Layer
- **Frontend Service** - React app served by Nginx, containerized and deployed with 2 replicas
- **Backend API** - Node.js/Express REST API handling business logic
- **Container Registry** - Amazon ECR storing all Docker images
- **Auto-scaling** - HPA configured to scale from 2 to 5 pods based on CPU usage

### Observability
- **Prometheus** - Collecting metrics from all pods and nodes
- **Grafana** - Pre-configured dashboards showing cluster health and performance
- **Health Probes** - Liveness and readiness checks on every service

### DevOps Tooling
- **Terraform** - All infrastructure defined as code, repeatable deployments
- **Helm** - Package management for Kubernetes applications
- **ArgoCD** - GitOps continuous delivery (declarative deployments)

## Cost Breakdown

This setup was designed to be portfolio-friendly while still being production-ready. Here's what you're looking at monthly:

| Resource | Cost |
|----------|------|
| EKS Control Plane | $73.00 |
| 2x t3.small SPOT Instances | ~$6.00 |
| NAT Gateway | $32.00 |
| Elastic IP | $0.00 |
| EBS Volumes (20GB each) | ~$4.00 |
| **Total Estimate** | **~$115/month** |

Compare this to a traditional On-Demand setup with 3 AZs and 3 NAT gateways: you'd be paying $200+/month easily.

## Prerequisites

Before you start, make sure you have these tools installed:

- **AWS CLI** - Configure with your credentials (`aws configure`)
- **Terraform** >= 1.3 - Infrastructure provisioning
- **kubectl** - Kubernetes command-line tool
- **Helm** - Kubernetes package manager
- **Docker** - For building images (optional, can use pre-built)

## Getting Started

### Step 1: Deploy the Infrastructure

First, let's provision the VPC, EKS cluster, and all the networking:

```bash
cd terraform
terraform init
terraform plan  # Review what will be created
terraform apply
```

This takes about 15 minutes. Terraform is creating:
- VPC with 4 subnets (2 public, 2 private)
- Internet Gateway and NAT Gateway
- EKS cluster with OIDC provider
- Node group with 2 SPOT instances
- IAM roles and security groups

### Step 2: Connect to Your Cluster

Once Terraform finishes, configure kubectl to talk to your new cluster:

```bash
aws eks update-kubeconfig --region us-east-1 --name microservices-eks
kubectl get nodes
```

You should see 2 nodes in Ready status.

### Step 3: Build and Push Docker Images

We need to get our application images into ECR:

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build and push frontend
cd apps/frontend
docker build -t <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/microservices/frontend:latest .
docker push <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/microservices/frontend:latest

# Build and push backend
cd ../backend
docker build -t <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/microservices/backend:latest .
docker push <YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/microservices/backend:latest
```

### Step 4: Deploy Applications

Now deploy the microservices to Kubernetes:

```bash
cd ../../
kubectl apply -f kubernetes/base/
```

This creates:
- Frontend deployment and service
- Backend deployment and service
- Horizontal Pod Autoscalers for both
- Ingress for external access

Check deployment status:
```bash
kubectl get pods
kubectl get svc
kubectl get hpa
```

### Step 5: Install Monitoring (Optional)

Want to see what's happening inside your cluster? Install Prometheus and Grafana:

```bash
# Add Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install the stack
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace \
  -f kubernetes/monitoring/prometheus-values.yaml
```

Access Grafana dashboard:
```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80
```

Open http://localhost:3000 in your browser:
- Username: `admin`
- Password: `prom-operator`

### Step 6: Access Your Applications

Since we're not setting up ALB (to save costs), you can access services via port-forwarding:

```bash
# Frontend
kubectl port-forward svc/frontend-service 8080:80
# Open http://localhost:8080

# Backend API
kubectl port-forward svc/backend-service 3000:3000
# Test: curl http://localhost:3000/api/health
```

## Project Structure

```
kubernetes-microservices/
├── apps/
│   ├── frontend/              # React frontend application
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   └── src/
│   └── backend/               # Node.js Express API
│       ├── Dockerfile
│       └── src/
├── terraform/
│   ├── main.tf               # Main Terraform config
│   ├── variables.tf
│   ├── outputs.tf
│   └── modules/
│       ├── vpc/              # VPC module (subnets, NAT, IGW)
│       └── eks/              # EKS cluster and node group
├── kubernetes/
│   ├── base/                 # Core Kubernetes manifests
│   │   ├── frontend-deployment.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── hpa.yaml
│   │   └── ingress.yaml
│   ├── monitoring/           # Prometheus/Grafana configs
│   └── gitops/              # ArgoCD setup
├── helm/
│   └── microservices/        # Helm chart for apps
└── README.md
```

## Key Features Explained

### Auto-Scaling
The Horizontal Pod Autoscaler watches CPU usage. When average CPU hits 70%, it spins up additional pods (up to 5). When traffic drops, it scales back down to 2 for cost efficiency.

### Health Checks
Each pod has liveness and readiness probes. Kubernetes uses these to:
- Restart pods that are stuck or crashed (liveness)
- Remove pods from service rotation if they're not ready (readiness)

### SPOT Instances
We're using SPOT instances which are spare EC2 capacity AWS sells at a discount. Yeah, they can be reclaimed with 2 minutes notice, but for a demo/portfolio project that's totally fine. In production, you'd mix SPOT with On-Demand for the critical stuff.

### Infrastructure as Code
Everything is defined in Terraform. Want to rebuild from scratch? Just run `terraform apply`. Want to tear it down? Run `terraform destroy`. No clicking around in the AWS console.

## Monitoring Your Cluster

Once Grafana is running, check out these dashboards:
- **Kubernetes / Compute Resources / Cluster** - Overall cluster health
- **Kubernetes / Compute Resources / Namespace (Pods)** - Per-namespace metrics
- **Kubernetes / Networking / Pod** - Network traffic and bandwidth

You can also query Prometheus directly:
```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090
# Open http://localhost:9090
```

Try these queries:
- `kube_pod_status_phase` - See pod states
- `container_cpu_usage_seconds_total` - CPU usage
- `container_memory_usage_bytes` - Memory consumption

## Troubleshooting

**Pods stuck in Pending?**
```bash
kubectl describe pod <pod-name>
```
Usually it's resource constraints or image pull issues.

**Can't access services?**
Make sure port-forward is running and check if pods are actually ready:
```bash
kubectl get pods
kubectl logs <pod-name>
```

**Terraform errors?**
Most common issue is AWS credentials or region mismatch. Check:
```bash
aws sts get-caller-identity
```

**High costs?**
If you're not using the cluster, destroy it:
```bash
terraform destroy
```
The EKS control plane alone is $73/month just sitting idle.

## Cleaning Up

When you're done testing, tear everything down to avoid charges:

```bash
# Delete Kubernetes resources first
kubectl delete -f kubernetes/base/

# Remove monitoring stack
helm uninstall kube-prometheus-stack -n monitoring

# Destroy infrastructure
cd terraform
terraform destroy -auto-approve
```

This removes everything and stops all billing.

## What I Learned

Building this taught me a ton about:
- How EKS actually works under the hood (not just theory)
- Real-world cost optimization (SPOT instances, shared NAT gateways)
- Terraform modules and state management
- Kubernetes networking and service discovery
- Monitoring and observability at scale
- Container security and image optimization

## Future Improvements

If I were to expand this:
- Add Cert-Manager for automatic SSL certificates
- Implement service mesh (Istio or Linkerd) for advanced traffic management
- Set up proper CI/CD pipeline with GitHub Actions
- Add distributed tracing with Jaeger
- Implement centralized logging with ELK stack
- Create disaster recovery and backup strategy

## License

MIT License - feel free to use this for your own learning or portfolio.

---

**Note**: This is a demonstration project for learning and portfolio purposes. In a real production environment, you'd want to add more security layers, implement proper secrets management with AWS Secrets Manager, set up WAF for the ALB, enable VPC Flow Logs, and much more.
