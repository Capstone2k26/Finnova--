const { Op } = require('sequelize');
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
    
    const accountNumber = `ACC${Date.now()}${Math.floor(Math.random() * 10000)}`;
    
    const account = await Account.create({
      userId: req.userId,
      accountType,
      accountNumber,
      isSimulation: isSimulation || false,
      balance: isSimulation ? 100000.00 : 0.00
    });

    res.status(201).json({ 
      message: 'Account created successfully',
      account 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create account' });
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

    const fromAccount = await Account.findOne({
      where: { id: fromAccountId, userId: req.userId }
    });

    if (!fromAccount) {
      return res.status(404).json({ error: 'Source account not found' });
    }

    if (parseFloat(fromAccount.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const toAccount = await Account.findByPk(toAccountId);
    if (!toAccount) {
      return res.status(404).json({ error: 'Destination account not found' });
    }

    // Create transaction
    const transaction = await Transaction.create({
      fromAccountId,
      toAccountId,
      transactionType: 'transfer',
      amount,
      description,
      status: 'completed',
      referenceId: uuidv4()
    });

    // Update balances (double-entry bookkeeping)
    await fromAccount.decrement('balance', { by: amount });
    await toAccount.increment('balance', { by: amount });

    res.json({ 
      message: 'Transfer successful',
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: 'Transfer failed' });
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
