# Backend Setup Instructions

## Installation

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in backend folder with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/football-betting
   JWT_SECRET=your_super_secret_key_here
   STRIPE_SECRET_KEY=sk_test_...
   FIREBASE_API_KEY=your_firebase_key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables
├── models/                # Database models
│   ├── User.js
│   ├── Game.js
│   └── Bet.js
├── routes/                # API endpoints
│   ├── auth.js
│   ├── games.js
│   ├── bets.js
│   └── users.js
├── controllers/           # Business logic
├── middleware/            # Custom middleware
└── utils/                 # Helper functions
```

## API Endpoints (Coming Soon)

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/games` - Get all games
- `POST /api/bets` - Place a bet
- `GET /api/bets/history` - Betting history

