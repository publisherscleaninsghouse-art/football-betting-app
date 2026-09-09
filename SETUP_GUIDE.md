# COMPLETE SETUP GUIDE

## 🚀 Football Betting App - Full Installation & Deployment

This is a complete football betting application with Web and Mobile versions.

---

## 📋 Prerequisites

- **Node.js** v16+ (https://nodejs.org/)
- **MongoDB** (https://www.mongodb.com/)
- **Git** (https://git-scm.com/)
- **VS Code** (Recommended IDE)
- **Stripe Account** (for payments)

---

## 🔧 Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Create `.env` file

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/football-betting
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLIC_KEY=pk_test_your_key
CLIENT_URL=http://localhost:3000
```

### Step 3: Start MongoDB

```bash
# If using MongoDB locally
mongod

# Or use MongoDB Atlas (cloud)
# Get connection string and add to .env
```

### Step 4: Run Backend

```bash
npm run dev
```

✅ Backend running at: `http://localhost:5000`

---

## 💻 Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Create `.env` file

```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 3: Run Frontend

```bash
npm start
```

✅ Frontend running at: `http://localhost:3000`

---

## 📱 Mobile Setup

### Option A: Using Expo (Easiest)

```bash
cd mobile
npm install -g expo-cli
npm install
expo start
```

Scan QR code with Expo Go app on your phone.

### Option B: Using React Native CLI

#### For Android:
```bash
cd mobile
npm install
npm run android
```

#### For iOS (macOS only):
```bash
cd mobile
npm install
npm run ios
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Games
- `GET /api/games` - Get all games
- `GET /api/games/live` - Get live games
- `GET /api/games/:id` - Get game details

### Bets
- `POST /api/bets` - Place a bet
- `GET /api/bets/history` - Betting history
- `GET /api/bets/pending` - Pending bets

### Users
- `GET /api/users/profile` - User profile
- `GET /api/users/wallet/balance` - Wallet balance
- `POST /api/users/wallet/add-funds` - Add funds
- `GET /api/users/stats` - User statistics

### Payments
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment

---

## 🎮 Features

✅ User Authentication (Register/Login)
✅ Live Football Games Display
✅ Real-time Score Updates (Socket.io)
✅ Place Bets with Odds
✅ Wallet Management
✅ Betting History & Statistics
✅ Payment Integration (Stripe)
✅ Responsive Design
✅ Mobile App (iOS & Android)
✅ Dream League Soccer-like Interface

---

## 🗂️ Project Structure

```
football-betting-app/
├── backend/              # Node.js Express server
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── controllers/      # Business logic
│   ├── middleware/       # Authentication & validation
│   └── server.js        # Main server file
│
├── frontend/            # React web app
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   └── App.js       # Main app component
│   └── package.json
│
└── mobile/              # React Native app
    ├── src/
    │   ├── screens/     # Screen components
    │   ├── context/     # Auth context
    │   ├── navigation/  # Navigation setup
    │   └── App.js       # Main app component
    └── package.json
```

---

## 🚀 Deployment

### Backend (Heroku)

1. Install Heroku CLI
2. Create Heroku app: `heroku create`
3. Set environment variables: `heroku config:set KEY=value`
4. Deploy: `git push heroku main`

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy to Vercel: `vercel`
3. Or Netlify: `netlify deploy`

### Mobile (App Stores)

1. Build APK: `expo build:android`
2. Build IPA: `expo build:ios`
3. Upload to Google Play & App Store

---

## ⚠️ Legal & Compliance

⚡ **IMPORTANT**: This is for educational purposes only.

Before launching a real betting app:
- ✅ Obtain gambling licenses
- ✅ Implement KYC/AML
- ✅ Add responsible gambling features
- ✅ Comply with local regulations
- ✅ Use proper payment gateways
- ✅ Implement fraud detection

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB is running
- Verify connection string in `.env`
- Check network access in MongoDB Atlas

### "Port already in use"
- Change PORT in `.env`
- Kill process: `kill -9 $(lsof -t -i:5000)`

### "CORS errors"
- Ensure backend CORS is configured
- Check CLIENT_URL in backend .env

### "Mobile app can't connect to backend"
- Use your computer's IP instead of localhost
- Example: `http://192.168.1.100:5000`

---

## 📞 Support

For questions or issues:
1. Check the README files in each folder
2. Review the code comments
3. Check GitHub Issues

---

## 📝 License

MIT License - Feel free to use for learning and development

---

**Happy Coding! ⚽🎉**
