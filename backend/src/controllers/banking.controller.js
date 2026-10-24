const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { v4: uuidv4 } = require('uuid');

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.userId }
    });
    res.json({ accounts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { accountType, isSimulation } = req.body;
    const validAccountTypes = ['savings', 'checking', 'investment', 'simulation'];
    if (!validAccountTypes.includes(accountType)) {
      return res.status(400).json({ error: 'Choose a valid account type' });
    }

    const account = await Account.create({
      userId: req.userId,
      accountType,
      accountNumber: `ACC-${uuidv4()}`,
      isSimulation: Boolean(isSimulation) || accountType === 'simulation',
      balance: Boolean(isSimulation) || accountType === 'simulation' ? 100000.00 : 0.00
    });

    res.status(201).json({ 
      message: 'Account created successfully',
      account 
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Could not create account. Please check the database connection and try again.' });
  }
};

exports.getAccountBalance = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { 
        id: req.params.id,
        userId: req.userId 
      }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ balance: account.balance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
};

exports.transferFunds = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount, description } = req.body;
    const transferAmount = Number(amount);

    if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
      return res.status(400).json({ error: 'Choose two different accounts' });
    }
    if (!Number.isFinite(transferAmount) || transferAmount <= 0 || Number(transferAmount.toFixed(2)) !== transferAmount) {
      return res.status(400).json({ error: 'Transfer amount must be a positive value with at most two decimal places' });
    }

    const transaction = await sequelize.transaction(async (dbTransaction) => {
      const fromAccount = await Account.findOne({
        where: { id: fromAccountId, userId: req.userId },
        transaction: dbTransaction,
        lock: dbTransaction.LOCK.UPDATE
      });

      if (!fromAccount) {
        const error = new Error('Source account not found');
        error.status = 404;
        throw error;
      }

      const toAccount = await Account.findOne({
        where: { id: toAccountId, userId: req.userId },
        transaction: dbTransaction,
        lock: dbTransaction.LOCK.UPDATE
      });
      if (!toAccount) {
        const error = new Error('Destination account not found');
        error.status = 404;
        throw error;
      }
      if (Number(fromAccount.balance) < transferAmount) {
        const error = new Error('Insufficient balance');
        error.status = 400;
        throw error;
      }

      const createdTransaction = await Transaction.create({
        fromAccountId,
        toAccountId,
        transactionType: 'transfer',
        amount: transferAmount,
        description,
        status: 'completed',
        referenceId: uuidv4()
      }, { transaction: dbTransaction });

      await fromAccount.decrement('balance', { by: transferAmount, transaction: dbTransaction });
      await toAccount.increment('balance', { by: transferAmount, transaction: dbTransaction });
      return createdTransaction;
    });

    res.json({ 
      message: 'Transfer successful',
      transaction
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.status ? error.message : 'Transfer failed' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.userId },
      attributes: ['id']
    });

    const accountIds = accounts.map(acc => acc.id);

    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { fromAccountId: accountIds },
          { toAccountId: accountIds }
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

exports.getLedger = async (req, res) => {
  try {
    const { accountId } = req.query;
    
    const account = await Account.findOne({
      where: { id: accountId, userId: req.userId }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { fromAccountId: accountId },
          { toAccountId: accountId }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({ 
      account,
      ledger: transactions 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ledger' });
  }
};
