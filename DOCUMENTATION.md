# Football Betting App - Complete Documentation

## 📱 App Features Overview

### For Users
1. **User Accounts**
   - Registration & Login
   - Profile Management
   - Secure Authentication (JWT)

2. **Live Games**
   - Browse all football matches worldwide
   - View live scores in real-time
   - See team formations and player positions
   - Access game statistics

3. **Betting**
   - Place bets on games
   - Multiple bet types (Win/Draw/Lose)
   - Live odds updates
   - Automatic bet settlement
   - Betting history tracking

4. **Wallet**
   - Add funds (via Stripe)
   - Check balance
   - Withdraw winnings
   - Transaction history

5. **Statistics**
   - Total bets placed
   - Win/loss ratio
   - Total winnings
   - Betting performance

### Technical Stack

**Backend**
- Node.js + Express.js
- MongoDB (Database)
- Socket.io (Real-time)
- JWT (Authentication)
- Stripe (Payments)

**Frontend**
- React.js
- React Router
- Axios (HTTP)
- Socket.io Client
- CSS3

**Mobile**
- React Native
- React Navigation
- Axios (HTTP)
- AsyncStorage (Persistence)
- Socket.io Client

## 🎮 User Flow

1. **Registration** → Enter username, email, password
2. **Login** → Authenticate with credentials
3. **Dashboard** → View statistics and balance
4. **Browse Games** → See live matches
5. **View Game Details** → See field with players
6. **Place Bet** → Select odds and stake amount
7. **Payment** → Add funds via Stripe
8. **Settle Bet** → Auto-settle when game ends
9. **View History** → Check past bets

## 🔐 Security Features

- Password hashing (bcryptjs)
- JWT token authentication
- CORS protection
- Input validation
- Error handling
- Secure payment processing

## 📊 Database Schema

**User Collection**
```
- username (unique)
- email (unique)
- password (hashed)
- wallet (balance, totalDeposited)
- totalBets, winningBets, totalWinnings
- createdAt, updatedAt
```

**Game Collection**
```
- gameId (unique)
- homeTeam, awayTeam
- kickOffTime, status
- score, fullTimeScore
- odds (homeWin, draw, awayWin)
- statistics
- createdAt, updatedAt
```

**Bet Collection**
```
- userId, gameId
- prediction, betType
- stake, oddsAtTime
- potentialWinnings, actualWinnings
- status (pending, won, lost)
- placedAt, settledAt
```

## 🔄 Real-time Updates (Socket.io)

**Events:**
- `join_game` - User joins a game room
- `game_update` - Score/status update
- `score_updated` - Broadcast score to all
- `bet_placed` - Notify new bets

## 💳 Payment Flow

1. User clicks "Add Funds"
2. Stripe payment intent created
3. User enters card details
4. Payment processed
5. Wallet balance updated
6. Receipt generated

## 📈 Bet Settlement

1. Game finishes
2. Final score recorded
3. Compare with user prediction
4. Update bet status (won/lost)
5. Add winnings to wallet
6. Update user statistics
7. Notify user

## 🌐 API Authentication

All protected endpoints require:
```
Header: Authorization: Bearer <JWT_TOKEN>
```

## 📱 Mobile App Interface

1. **Login/Register Screen**
   - Email & password input
   - Form validation
   - Error messages

2. **Dashboard Screen**
   - User greeting
   - Current balance
   - Statistics grid
   - Action buttons

3. **Games Screen**
   - Game list
   - Filter (all/live)
   - Live scores
   - Quick bet access

4. **Live Game Screen** (DLS-style)
   - Football field
   - Player positions
   - Live score
   - Odds panel
   - Betting panel

5. **History Screen**
   - Betting history
   - Filter by status
   - Bet details
   - Winnings display

## 🚀 Performance Optimization

- Lazy loading for images
- Pagination for large lists
- Caching with LocalStorage/AsyncStorage
- Debounced API calls
- Optimized socket connections

## 🔔 Notifications

**Planned Features:**
- Bet placement confirmation
- Bet won/lost notification
- Game starting soon
- Score updates
- Payment confirmation

## 📊 Admin Features (Future)

- Manage games
- Update odds
- View user activity
- Process withdrawals
- Generate reports

---

**For detailed setup instructions, see SETUP_GUIDE.md**
