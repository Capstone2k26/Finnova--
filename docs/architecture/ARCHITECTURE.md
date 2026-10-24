# FINNOVA Architecture

## System Overview

FINNOVA follows a modern three-tier architecture:

```
┌─────────────────────────────────────────────────────┐
│                   Frontend Layer                     │
│         React + Vite + TailwindCSS                  │
│   (Web & Mobile Responsive Interface)               │
└─────────────────────────────────────────────────────┘
                        ↓ HTTPS/REST
┌─────────────────────────────────────────────────────┐
│                   Backend Layer                      │
│         Node.js + Express RESTful API               │
│   (Business Logic & Request Processing)             │
└─────────────────────────────────────────────────────┘
                        ↓ SQL
┌─────────────────────────────────────────────────────┐
│                    Data Layer                        │
│           PostgreSQL Database                        │
│   (ACID-compliant Relational Storage)               │
└─────────────────────────────────────────────────────┘
```

## Technology Decisions

### Frontend: React + Vite
- **React 18**: Modern component-based UI development
- **Vite**: Lightning-fast development server and build tool
- **TailwindCSS**: Utility-first CSS for rapid UI development
- **React Query**: Server state management and caching
- **Zustand**: Lightweight client state management
- **React Router**: Client-side routing

### Backend: Node.js + Express
- **Express**: Minimal and flexible Node.js framework
- **Sequelize**: Promise-based ORM for PostgreSQL
- **JWT**: Stateless authentication
- **bcrypt**: Password hashing
- **helmet**: Security headers
- **express-rate-limit**: API rate limiting

### Database: PostgreSQL
- **ACID compliance**: Ensures data integrity for financial transactions
- **Double-entry bookkeeping**: Native support for complex queries
- **JSONB support**: Flexible storage for module content
- **Scalability**: Handles millions of transactions

## Security Architecture

### Data Encryption
```
┌──────────────┐    AES-256     ┌──────────────┐
│ Client Data  │ ───────────>   │  Encrypted   │
│ (Plaintext)  │                │   Storage    │
└──────────────┘                └──────────────┘
```

### Authentication Flow
```
1. User Login
   ↓
2. Server validates credentials
   ↓
3. Generate JWT token
   ↓
4. Client stores token
   ↓
5. Subsequent requests include token in Authorization header
   ↓
6. Server validates token on each request
```

### Authorization Levels
- **User**: Basic account access
- **Admin**: Full system access and management

## Database Schema

### Core Tables

**users**
- id (UUID, PK)
- email (unique)
- password (hashed)
- firstName, lastName
- role (user/admin)
- financialLiteracyLevel
- kycVerified
- isActive
- timestamps

**accounts**
- id (UUID, PK)
- userId (FK → users)
- accountType (savings/checking/investment/simulation)
- accountNumber (unique)
- balance (decimal)
- currency
- isSimulation
- status
- timestamps

**transactions**
- id (UUID, PK)
- fromAccountId (FK → accounts)
- toAccountId (FK → accounts)
- transactionType
- amount
- description
- status
- referenceId
- metadata (JSONB)
- timestamps

**stocks**
- id (UUID, PK)
- symbol (unique)
- companyName
- exchange
- currentPrice
- openPrice, closePrice, highPrice, lowPrice
- volume
- marketCap
- sector
- timestamps

**portfolios**
- id (UUID, PK)
- userId (FK → users)
- stockId (FK → stocks)
- assetType
- quantity
- averagePurchasePrice
- currentValue
- profitLoss
- profitLossPercentage
- timestamps

**learning_modules**
- id (UUID, PK)
- title
- description
- category
- level (beginner/intermediate/advanced)
- content (JSONB)
- duration
- order
- isActive
- timestamps

**user_progress**
- id (UUID, PK)
- userId (FK → users)
- moduleId (FK → learning_modules)
- status (not_started/in_progress/completed)
- progress (0-100)
- score
- completedAt
- timestamps

## API Design Principles

### RESTful Conventions
- **GET**: Retrieve resources
- **POST**: Create resources
- **PUT/PATCH**: Update resources
- **DELETE**: Remove resources

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API design allows multiple server instances
- Load balancer distributes requests
- Session data stored in Redis (shared cache)

### Database Optimization
- Indexed columns for frequent queries
- Connection pooling
- Query optimization with proper JOINs
- Pagination for large datasets

### Caching Strategy
- Redis for session management
- API response caching for frequently accessed data
- Client-side caching with React Query

## Monitoring & Logging

### Application Logging
- Morgan for HTTP request logging
- Winston for application logs
- Error tracking and alerting

### Audit Trail
- All financial transactions logged
- Immutable audit records
- Compliance reporting capabilities

## Deployment Architecture

### Development
- Local PostgreSQL instance
- Vite dev server with HMR
- Nodemon for backend auto-restart

### Production (Recommended)
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: AWS EC2, Heroku, or DigitalOcean
- **Database**: AWS RDS PostgreSQL or managed PostgreSQL
- **CDN**: CloudFront or similar for static assets
- **Monitoring**: Datadog, New Relic, or AWS CloudWatch
