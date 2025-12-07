# Deployment Strategy & Containerization

## Overview
This document outlines the deployment strategy for the Preflight Checklist application, including containerization with Docker and cloud platform deployment options.

## Containerization with Docker

### Why Docker?
- **Consistency**: Same environment across dev, staging, production
- **Isolation**: Each service runs in its own container
- **Portability**: Run anywhere Docker is installed
- **Easy scaling**: Spin up multiple instances easily

## Docker Architecture

### Multi-Container Setup

The application uses **Docker Compose** to orchestrate three containers:

1. **Backend Container** (Node.js/Express API)
2. **Frontend Container** (React/Vite build)
3. **Database Container** (PostgreSQL)

## Block Diagram: Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUD PLATFORM                            │
│                  (Heroku / AWS / Azure)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Docker Compose                        │    │
│  │                                                    │    │
│  │  ┌──────────────┐    ┌──────────────┐           │    │
│  │  │   Frontend   │    │   Backend    │           │    │
│  │  │   Container  │◄───┤   Container  │           │    │
│  │  │              │    │              │           │    │
│  │  │  React/Vite  │    │ Express API  │           │    │
│  │  │  Port: 5173  │    │  Port: 4000  │           │    │
│  │  └──────────────┘    └──────┬───────┘           │    │
│  │                             │                    │    │
│  │                    ┌────────▼───────┐           │    │
│  │                    │   PostgreSQL   │           │    │
│  │                    │   Container    │           │    │
│  │                    │   Port: 5432    │           │    │
│  │                    └────────────────┘           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Load Balancer / Reverse Proxy          │    │
│  │              (Nginx / Cloud Load Balancer)          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└───────────────────────────┬──────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   Internet    │
                    │   Users       │
                    └───────────────┘
```

## Dockerfile Structure

### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: preflight_checklist
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/preflight_checklist
      PORT: 4000
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## Deployment Platforms

### Option 1: Heroku (Easiest for Beginners)

**Pros:**
- Simple deployment process
- Free tier available
- Built-in PostgreSQL addon
- Automatic SSL certificates

**Steps:**
1. Create Heroku app
2. Add PostgreSQL addon
3. Deploy using Heroku Git or Docker
4. Set environment variables
5. Run migrations

**Commands:**
```bash
heroku create preflight-checklist-app
heroku addons:create heroku-postgresql
git push heroku main
heroku run npx prisma migrate deploy
```

### Option 2: AWS (EC2 + RDS)

**Architecture:**
- EC2 instance for backend/frontend
- RDS PostgreSQL for database
- S3 for static assets (optional)
- CloudFront for CDN (optional)

**Steps:**
1. Launch EC2 instance
2. Create RDS PostgreSQL database
3. Configure security groups
4. Deploy application
5. Set up domain and SSL

### Option 3: Azure (App Service + Database)

**Architecture:**
- Azure App Service for backend
- Azure Static Web Apps for frontend
- Azure Database for PostgreSQL

**Steps:**
1. Create App Service
2. Create PostgreSQL database
3. Deploy via Azure CLI or GitHub Actions
4. Configure connection strings

### Option 4: Netlify + Railway (Hybrid)

**Architecture:**
- Netlify for frontend (static hosting)
- Railway for backend + database

**Steps:**
1. Deploy frontend to Netlify
2. Deploy backend to Railway
3. Connect Railway PostgreSQL
4. Update frontend API URL

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=4000
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com/api
```

## Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] CORS settings updated for production domain
- [ ] SSL certificates configured
- [ ] Health check endpoints working
- [ ] Error logging configured
- [ ] Backup strategy in place
- [ ] Monitoring/alerting set up

## Containerization Benefits

1. **Development**: `docker-compose up` runs entire stack locally
2. **Testing**: Same environment as production
3. **Deployment**: Push container image to registry, deploy anywhere
4. **Scaling**: Easy to scale individual services

## Local Development with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build backend
```

## Production Considerations

1. **Database**: Use managed database service (RDS, Azure Database, etc.)
2. **Secrets**: Use platform secret management (not .env files)
3. **Logging**: Centralized logging (CloudWatch, Azure Monitor)
4. **Monitoring**: Application performance monitoring (APM)
5. **Backups**: Automated database backups
6. **Scaling**: Horizontal scaling for backend, CDN for frontend

## Notes

- **No actual Dockerfile implementation** - This document provides the framework and structure only
- Dockerfiles should be created after application is fully functional
- Test containers locally before deploying to production
- Use multi-stage builds for smaller production images

