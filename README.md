# CryptoGive — Crypto Donation Platform

Donate cryptocurrency to charitable organizations and receive PDF tax receipts.

## Quick Start (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set DATABASE_URL if needed (default: postgres://postgres:postgres@localhost:5432/cryptogive_dev)

# Create database and run migrations
createdb cryptogive_dev   # or use psql
npm run migrate

npm run dev   # starts on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev   # starts on http://localhost:3000
```

Open http://localhost:3000 in your browser.

---

## Quick Start (Docker)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/v1
- PostgreSQL: localhost:5432

Run migrations after containers start:
```bash
docker-compose exec backend npm run migrate
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/health | Health check |
| GET | /v1/organizations | List all active organizations |
| POST | /v1/donations/initiate | Initiate a donation |
| POST | /v1/donations/confirm | Submit transaction hash |
| GET | /v1/donations/:walletAddress | Get donation history |
| GET | /v1/tax-report/:walletAddress?year=2024 | Download PDF/CSV tax report |
| GET | /v1/crypto-price/:token/:date | Get historical crypto price |

---

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cryptogive_dev
ETHEREUM_RPC_URL=https://eth.llamarpc.com
POLYGON_RPC_URL=https://polygon-rpc.com
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/v1
```

---

## Tech Stack

**Backend:** Node.js, Express, PostgreSQL, ethers.js v6, pdfkit, node-cron, axios, winston
**Frontend:** React 18, Vite, Tailwind CSS, React Router v6
**Infrastructure:** Docker Compose, PostgreSQL 14
