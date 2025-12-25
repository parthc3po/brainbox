# BrainBox Deployment Guide (Raspberry Pi)

## Infrastructure Overview
- **App Port**: `3001` (Host) -> `3000` (Container)
- **Database Port**: `5433` (Host) -> `5432` (Container)
- **Container Network**: `brainbox-network` (Internal bridge)

## Prerequisites
- Docker & Docker Compose installed on Raspberry Pi.
- Tailscale active.

## Steps to Deploy

### 1. Clone & Setup
Clone the repository to your Raspberry Pi:
```bash
git clone https://github.com/yourusername/brainbox.git
cd brainbox
```

### 2. Launch
Run the application in detached mode:
```bash
docker compose up -d --build
```

### 3. Verify
Check if containers are running:
```bash
docker compose ps
```
You should see `brainbox-app` (Port 3001) and `brainbox-db` (Port 5433).

### 4. Database Setup
The database will be empty initially. You need to push the Prisma schema:

```bash
# Execute schema push inside the running container
docker exec -it brainbox-app npx prisma db push

# (Optional) Seed data if you have a seed script
docker exec -it brainbox-app npx prisma db seed
```

## Accessing via Tailscale
1. **Direct Access**: Open `http://<tailscale-ip>:3001` in your browser.
2. **Nginx Proxy Manager**:
   - Create a specific Proxy Host in NPM.
   - **Domain**: `brainbox.local` (or your preferred domain).
   - **Forward Hostname / IP**: `<tailscale-ip>` or `localhost` (if NPM is on the same Pi).
   - **Forward Port**: `3001`.
   - **Websockets Support**: Enable.

## Troubleshooting
- **Logs**: `docker compose logs -f app`
- **Rebuild**: `docker compose up -d --build --force-recreate`
