# Technical Documentation - Junior Hacker Dashboard

## 1. Architecture Overview
**Stack**:
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4.
- **Backend**: Next.js API Routes (Serverless functions).
- **Database**: PostgreSQL (managed via Prisma ORM).
- **Security**: Client-side encryption for Vault; standard HTTPS for transport.

## 2. Project Structure
```
/app
  /api          # Backend API endpoints
  /feed         # Global Comms page
  /inventory    # Inventory module
  /missions     # Mission Log & management
  /vault        # Encrypted storage
  globals.css   # Global styles (Tailwind v4)
  layout.js     # Root layout & Navbar
  page.js       # Launchpad (Home)
/components
  /features     # Feature-specific components (MissionCard, SystemStatus)
  /layout       # Layout components (AppNavbar)
/lib
  prisma.ts     # Prisma singleton
  crypto.ts     # Vigenère Cipher utility
/prisma
  schema.prisma # Database definitions
```

## 3. Database Schema
### `Mission`
- Core learning task.
- Fields: `id`, `title`, `description`, `category`, `status`, `xpReward`, `tools`.
### `UserStats`
- Gamification tracker.
- Fields: `totalXp`, `level`, `missionsDone`.
### `FeedSource`
- RSS configuration.
- Fields: `url`, `title`, `category`.
### `Secret`
- Encrypted user notes.
- Fields: `title`, `encryptedContent` (Ciphertext).
### `Item`
- Inventory hardware.
- Fields: `name`, `category`, `quantity`, `notes`.

## 4. Feature Modules (Games/Tools)
- **Cyber Canvas**: Client-side HTML5 Canvas drawing tool. Local file export.
- **Mind Match**: React state-based Memory game.
- **Cyber Duel**: Tic-Tac-Toe with simple Minimax-lite AI.

## 5. API Endpoints
- `GET /api/missions`: List all missions.
- `POST /api/missions`: Create new mission.
- `PATCH /api/missions/[id]`: Update status (Complete).
- `GET /api/feed`: Fetch aggregated RSS items.
- `GET /api/vault`: List secrets.
- `POST /api/vault`: Save encrypted secret.
- `GET /api/inventory`: List hardware.
- `POST /api/inventory`: Log new item.

## 5. Security Model
- **The Vault**: Uses a `SimpleCrypto` utility (Vigenère/XOR). Keys are **NOT** stored on the server. Loss of key = Loss of data (Educational feature).
