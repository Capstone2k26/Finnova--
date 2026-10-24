const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const learningController = require('../controllers/learning.controller');

// Get all modules
router.get('/modules', auth, learningController.getModules);

// Get module by ID
router.get('/modules/:id', auth, learningController.getModuleById);

// Get modules by category
router.get('/modules/category/:category', auth, learningController.getModulesByCategory);

// Get user progress
router.get('/progress', auth, learningController.getUserProgress);

// Update progress
router.put('/progress/:moduleId', auth, learningController.updateProgress);

// Complete module
router.post('/complete/:moduleId', auth, learningController.completeModule);

module.exports = router;
