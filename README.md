## Features of boilerplate

1. Modular Structure (Done)
2. Conventional Commits setup with husky
3. Environment variables setup using Nestjs config (Done)
4. Integration with MongoDB (Done)
5. Login, Signup, Refresh tokens (Done)
6. Change Password, Reset Password, Forgot Password
7. Audit Trails
8. Repository patteren (Done)
9. Prometheus setup (Done)
10. Loging
11. Swagger-setup (Done)
12. Pagination Setup (Done)
13. Authentication (Done) and Authorization
14. Kubernetes Setup (Done)
    a) Mongodb (Deployment, Service, Volume, Volume Claim) (Done)
    b) API (Deployment, Service) (Done)
    c) ConfigMap (done)

# External Resources

## Generate secure Encryption Keys for JWT_ACCESS_TOKEN_SECRET

Go to [Random Key Gen](https://randomkeygen.com/) and user CodeIgniter Encryption Keys

# Start The App in development

1. Run `npm run start:dev`
2. Run `docker-compose  up -d`

<!-- Kubbernetes Stuff -->

# Deployment

## Run Project using Docker and Kubernetes + Minikube

```
kubectl apply -f api-configMap.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f nest-boilerplate-deployment.yaml
minikube service nestjs-api-service
```

# ERRORS

1. Fix duplicate email address issue which result in crash of app handle this on repository level and send a graceful message on frontend
