# FINNOVA Setup Guide

## Quick Start

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Database Setup

#### Install PostgreSQL
- Download from: https://www.postgresql.org/download/
- Install and remember your postgres password

#### Create Database
```bash
# Open PostgreSQL command line (psql)
psql -U postgres

# Create database
CREATE DATABASE finnova_db;

# Exit psql
\q
```

### 3. Environment Configuration

#### Backend (.env)
```bash
Set-Location "D:\capstone\finnova\backend"
Copy-Item .env.example .env
```

Edit `backend/.env` with your settings:
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finnova_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Secret (generate a random string)
JWT_SECRET=your_secret_key_here_use_random_string
JWT_EXPIRE=24h

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```bash
Set-Location "D:\capstone\finnova\frontend"
Copy-Item .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

#### Terminal 1 - Backend
```bash
Set-Location "D:\capstone\finnova\backend"
npm run migrate
npm run dev
```

Backend will start on http://localhost:5000. On startup, it connects to PostgreSQL
creates any missing tables from the Sequelize models, and adds static demo stocks
and learning modules for the presentation. The market quotes are not live.

#### Terminal 2 - Frontend
```bash
Set-Location "D:\capstone\finnova\frontend"
npm run dev
```

Vite will print the frontend URL, normally http://localhost:3000.

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## First-Time Setup

### Create Admin Account
1. Go to http://localhost:3000/register
2. Fill in your details
3. Select financial literacy level
4. Click "Register"

### Create a Simulation Account
1. Login with your credentials
2. Navigate to "Banking" section
3. Click "New Account"
4. Select "Simulation Account" (starts with $100,000 demo funds)
5. Start trading!

## Project Structure Overview

```
finnova/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database config
│   │   ├── controllers/       # Business logic
│   │   ├── models/           # Database models
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth & validation
│   │   └── server.js         # Entry point
│   └── package.json
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API calls
│   │   ├── stores/          # State management
│   │   └── main.jsx         # Entry point
│   └── package.json
│
├── database/                   # Database files
│   ├── migrations/           # DB migrations
│   └── schemas/             # DB schemas
│
└── docs/                      # Documentation
    └── architecture/         # System architecture
```

## Available Features

### ✅ Implemented
- User Authentication (Register/Login)
- Banking System (Accounts, Transfers, Ledger)
- Stock Trading (Buy/Sell, Order Management)
- Portfolio Tracking
- Learning Modules
- Dashboard Analytics
- Profile Management

### 🚧 Incomplete / Demo placeholders
- Mutual Funds with SIP Calculator
- Bonds Marketplace
- Complete Accounting Module
- Several dashboard analytics and watchlist endpoints

## Common Issues & Troubleshooting

### Database Connection Error
**Problem**: Cannot connect to PostgreSQL
**Solution**: 
- Ensure PostgreSQL is running
- Verify credentials in `.env`
- Check if database exists: `psql -U postgres -l`

### Port Already in Use
**Problem**: Port 5000 or 3000 already in use
**Solution**:
- Change PORT in backend `.env`
- Change port in frontend `vite.config.js`

### Module Not Found
**Problem**: Missing node modules
**Solution**:
```bash
cd backend && npm install
cd frontend && npm install
```

### CORS Error
**Problem**: Frontend can't connect to backend
**Solution**:
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend `.env`

## Development Commands

### Backend
```bash
npm run dev       # Start development server with nodemon
npm start         # Start production server
npm test          # Run tests
npm run migrate   # Create any missing database tables
```

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- GET `/auth/me` - Get current user (requires token)

### Banking Endpoints
- GET `/banking/accounts` - Get user accounts
- POST `/banking/accounts` - Create new account
- POST `/banking/transfer` - Transfer funds

### Trading Endpoints
- GET `/trading/stocks` - Get available stocks
- POST `/trading/orders` - Place buy/sell order
- GET `/trading/orders` - Get user orders

### Learning Endpoints
- GET `/learning/modules` - Get all modules
- GET `/learning/progress` - Get user progress
- POST `/learning/complete/:moduleId` - Complete module

## Production Deployment

### Backend (Heroku/DigitalOcean)
```bash
# Build
npm install --production

# Set environment variables
# Start with: npm start
```

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy dist/ folder
```

### Database (AWS RDS/Heroku Postgres)
- Set up managed PostgreSQL instance
- Update DB credentials in production environment

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong JWT secrets** (32+ characters random string)
3. **Enable HTTPS** in production
4. **Rate limit** all API endpoints
5. **Validate all inputs** on both client and server
6. **Hash passwords** with bcrypt (already implemented)
7. **Keep dependencies updated** regularly

## Support & Resources

### Documentation
- `/docs/architecture/` - System architecture
- `/docs/api/` - API documentation (coming soon)
- `/docs/user-guides/` - User manuals (coming soon)

### Getting Help
- Check README.md for project overview
- Review this SETUP.md for installation issues
- Check GitHub Issues for known problems

## Next Steps

1. ✅ Complete setup following this guide
2. 📝 Create your first account
3. 💰 Create a simulation banking account
4. 📈 Try stock trading with demo funds
5. 🎓 Complete learning modules
6. 📊 Track your portfolio performance

---

**Happy Trading & Learning with FINNOVA! 🚀**
