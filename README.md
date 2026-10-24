# FINNOVA

**A financial learning and personal finance simulator** built with React, Express, and PostgreSQL.

FINNOVA brings account simulations, sample stock trading, portfolio tracking, financial lessons, and learning calculators together in one web application. It is an educational capstone project, not a bank, broker, or source of live market data.

## Features

- **Authentication** — user registration and login with hashed passwords and JWT sessions.
- **Banking simulator** — create accounts, transfer demo funds between accounts, and view transaction history.
- **Stock trading simulator** — sample stock quotes and simulated buy/sell orders using a selected account.
- **Portfolio** — view holdings, allocation, and portfolio totals.
- **Learning hub** — browse financial lessons and track per-user learning progress.
- **Financial calculators** — estimate mutual-fund SIP growth and bond yields.
- **Personal accounting demo** — record income and expenses in the current page session and compare expenses against a budget.
- **Dashboard** — account balances, recent transactions, learning progress, and portfolio summary.

> **Educational use only:** stock prices are static sample data. Trades, accounts, and calculator results are simulations—not real financial transactions, investment advice, or guaranteed returns. Accounting entries are currently stored only in browser memory and reset when the page reloads.

## Technology

- Frontend: React 18, Vite, Tailwind CSS, React Router, React Query, Zustand, Recharts
- Backend: Node.js, Express, Sequelize
- Database: PostgreSQL
- Authentication: bcryptjs and JSON Web Tokens

## Requirements

- Node.js 18 or newer and npm
- PostgreSQL installed and running locally
- Git (to clone the project)

Redis and a market-data API key are not required for the current demo.

## Setup on Windows

### 1. Clone the repository

```powershell
git clone https://github.com/luckyrewatkar12-create/finnova-learn.git
Set-Location .\finnova-learn
```

### 2. Create the PostgreSQL database

Using pgAdmin, create a database named `finnova_db`. Alternatively, with `psql`:

```sql
CREATE DATABASE finnova_db;
```

### 3. Configure the backend

```powershell
Set-Location .\backend
Copy-Item .env.example .env
notepad .env
```

Set `DB_PASSWORD` to the password for your local PostgreSQL `postgres` user. Set `JWT_SECRET` to a long, private random value. Do not commit `.env`.

### 4. Configure the frontend

Open a second PowerShell window:

```powershell
Set-Location .\finnova-learn\frontend
Copy-Item .env.example .env
```

The example frontend configuration points to `http://localhost:5000/api`.

### 5. Install dependencies, prepare the database, and start the backend

In the backend PowerShell window:

```powershell
Set-Location .\finnova-learn\backend
npm install
npm run migrate
npm run dev
```

The backend API listens on `http://localhost:5000`. The first start creates missing Sequelize tables and inserts sample stocks and learning modules.

### 6. Start the frontend

In the frontend PowerShell window:

```powershell
Set-Location .\finnova-learn\frontend
npm install
npm run dev
```

Open the URL Vite prints (this project is configured for `http://localhost:3000`). Register an account, create a simulation account in Banking, then use that account to try a sample stock trade.

## Useful commands

| Location | Command | Purpose |
|---|---|---|
| `backend` | `npm run migrate` | Create missing tables and add sample data |
| `backend` | `npm run dev` | Start the API with nodemon |
| `backend` | `npm test` | Run Jest tests (tests are not currently included) |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Build the production frontend |
| `frontend` | `npm run lint` | Run ESLint (an ESLint configuration is not currently included) |

## Project layout

```text
backend/
  src/
    config/       Database setup and demo data
    controllers/  API request handlers
    middleware/   Authentication middleware
    models/       Sequelize models and associations
    routes/       Express API routes
frontend/
  src/
    components/   Shared application layout and controls
    pages/        Dashboard and feature screens
    services/     API clients
    stores/       Zustand authentication state
database/         Database-related project resources
docs/             Project documentation
shared/           Shared resources
```

## Current limitations

- Mutual funds and bond pages currently provide calculators; they are not investment marketplaces.
- Market data is static demonstration data; chart history and watchlist operations are not implemented.
- Personal accounting entries are not persisted to the backend.
- Some analytics endpoints and learning interactions remain incomplete.
- Database credentials and JWT secrets must be configured locally before registration and other API-backed features work.

## License

This project is provided for educational and capstone demonstration purposes.
