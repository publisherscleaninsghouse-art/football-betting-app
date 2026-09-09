# Mobile App Setup Instructions

## Installation

### Option 1: Using Expo (Recommended for Beginners)

1. Install Expo CLI:
   ```bash
   npm install -g expo-cli
   ```

2. Navigate to mobile folder:
   ```bash
   cd mobile
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the app:
   ```bash
   expo start
   ```

5. Scan the QR code with your phone (Expo Go app required)

### Option 2: Using React Native CLI

1. Install React Native CLI:
   ```bash
   npm install -g react-native-cli
   ```

2. Navigate to mobile folder:
   ```bash
   cd mobile
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. For Android:
   ```bash
   npm run android
   ```

5. For iOS (macOS only):
   ```bash
   npm run ios
   ```

## Features Implemented

✅ User Authentication (Register/Login)
✅ Dashboard with Statistics
✅ Browse Games with Live Scores
✅ Place Bets
✅ Bottom Tab Navigation
✅ Socket.io Real-time Updates
✅ Responsive Mobile Design
✅ Persistent Login (AsyncStorage)

## Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DashboardScreen.js
│   │   └── GamesScreen.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── navigation/
│   │   └── RootNavigator.js
│   └── components/
│       └── (Components will go here)
├── App.js
├── index.js
├── app.json
├── package.json
└── README.md
```

## Troubleshooting

**Issue**: Connection refused to localhost:5000
**Solution**: Make sure backend is running on the same machine

**Issue**: Port already in use
**Solution**: Change PORT in backend .env file

**Issue**: AsyncStorage errors
**Solution**: Ensure `@react-native-async-storage/async-storage` is installed

## Next Steps

- Add more screens (Betting, History, Wallet)
- Implement push notifications
- Add payment integration
- Build and deploy to app stores
