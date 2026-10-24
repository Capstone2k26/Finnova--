const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bankingController = require('../controllers/banking.controller');

// Get all accounts for user
router.get('/accounts', auth, bankingController.getAccounts);

// Create new account
router.post('/accounts', auth, bankingController.createAccount);

// Get account balance
router.get('/accounts/:id/balance', auth, bankingController.getAccountBalance);

// Transfer funds
router.post('/transfer', auth, bankingController.transferFunds);

// Get transaction history
router.get('/transactions', auth, bankingController.getTransactions);

// Get ledger entries (double-entry bookkeeping)
router.get('/ledger', auth, bankingController.getLedger);

module.exports = router;
