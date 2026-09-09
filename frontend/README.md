# Frontend Setup Instructions

## Installation

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. Start the app:
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## Features Implemented

✅ User Authentication (Register/Login)
✅ Dashboard with Statistics
✅ Browse Games with Live Scores
✅ Place Bets
✅ Wallet Management
✅ Real-time Socket.io updates
✅ Responsive Design

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   └── Games.js
│   ├── components/
│   │   └── Navigation.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── App.js
│   ├── index.js
│   └── styles/
│       ├── index.css
│       ├── Auth.css
│       └── Games.css
├── package.json
└── README.md
```
