# Beev Project Setup Guide

## Prerequisites

- Docker
- Docker Compose
- Node.js 20+
- pnpm

## Service Ports Overview

| Service        | Internal Port | External Port | Access URL                    | Description                     |
|---------------|--------------|--------------|-------------------------------|--------------------------------|
| Frontend      | 8080         | 8000         | http://localhost:8000         | React Frontend Application     |
| Backend       | 3000         | 3000         | http://localhost:3000         | NestJS Backend API             |
| Postgres      | 5432         | 5432         | localhost:5432                | Database Service               |
| PgAdmin       | 80           | 8001         | http://localhost:8001         | Postgres Management Interface  |
| Redis         | 6379         | 6379         | localhost:6379                | Key-Value Store                |
| Redis Insight | 5540         | 8002         | http://localhost:8002         | Redis Management Interface     |

> Note: for redis insight the connection string is `redis://default@redis:6379`

## Docker Commands

### Build and Start All Services
```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Service Management
```bash
# Build specific service
docker-compose build backend

# Start specific service
docker-compose up -d backend

# View logs for a service
docker-compose logs -f backend
```

## Development Workflow

### Install Dependencies
```bash
# Install all workspace dependencies
pnpm install

# How to run a command in a specific workspace
pnpm --filter backend YOUR_COMMAND
# Or
pnpm --filter frontend YOUR_COMMAND
```


1. Ensure Docker is running
2. Verify pnpm and Docker versions
3. Use `docker-compose logs` to inspect service startup issues

## Notes

- Default credentials are set for development. 
- ALWAYS change credentials in production