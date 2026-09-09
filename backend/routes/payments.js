// Payments Routes
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment
} = require('../controllers/paymentController');

// All payment routes require authentication
router.use(authMiddleware);

router.post('/intent', createPaymentIntent);
router.post('/confirm', confirmPayment);

module.exports = router;
