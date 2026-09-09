# Production Environment Setup

## 1. Backend Production Configuration

### .env.production

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://admin:securepassword@cluster0.mongodb.net/football-betting-prod?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_very_long_random_production_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# Stripe (Production Keys)
STRIPE_SECRET_KEY=sk_live_your_production_key
STRIPE_PUBLIC_KEY=pk_live_your_production_key

# Client URL
CLIENT_URL=https://your-domain.com
MOBILE_CLIENT_URL=https://football-betting-app.expo.dev

# Email
SMTP_EMAIL=noreply@your-domain.com
SMTP_PASSWORD=your_smtp_password

# Logging
LOG_LEVEL=error
LOG_FILE=./logs/production.log

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Redis (Optional - for session management)
REDIS_URL=redis://localhost:6379
```

### server.js - Production Configuration

```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

const app = express();

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Data sanitization against NoSQL injection

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// CORS with production domains
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    process.env.MOBILE_CLIENT_URL
  ],
  credentials: true
}));

// Logging
const winston = require('winston');
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Trust proxy for Heroku/production
app.set('trust proxy', 1);

// Export configured app
module.exports = app;
```

---

## 2. Frontend Production Configuration

### .env.production

```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_SOCKET_URL=https://your-backend-domain.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_key
REACT_APP_ENVIRONMENT=production
```

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-domain.com/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 3. Mobile Production Configuration

### app.json (Production)

```json
{
  "expo": {
    "name": "Football Betting App",
    "slug": "football-betting-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/your-expo-id"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.yourcompany.footballbetting",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.footballbetting",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

---

## 4. Database Production Configuration

### MongoDB Atlas Setup

1. Create cluster in MongoDB Atlas
2. Enable IP Whitelist (or allow all for development)
3. Create database user
4. Get connection string
5. Add to .env.production

### MongoDB Backup

```bash
# Automated daily backups
# In MongoDB Atlas:
# Project → Backup → Enable backup
# Point-in-time restore enabled
```

---

## 5. Error Tracking Setup

### Sentry Integration

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## 6. Monitoring & Logging

### Uptime Monitoring

- Use Uptime Robot (Free)
- Monitor URL: https://your-backend.herokuapp.com/health
- Alert email on downtime

### Performance Monitoring

- Use New Relic or Datadog
- Monitor response times
- Monitor database performance
- Monitor error rates

---

## 7. Stripe Production Setup

1. Upgrade Stripe account to production
2. Get production API keys
3. Add to environment variables
4. Update webhook endpoints
5. Test payment flow

---

## 8. SSL/TLS Certificate

- Heroku: Automatic with *.herokuapp.com
- Custom domain: Enable in Heroku settings
- Auto-renewal: Handled by Heroku
