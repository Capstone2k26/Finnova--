const LearningModule = require('../models/LearningModule');
const UserProgress = require('../models/UserProgress');

exports.getModules = async (req, res) => {
  try {
    const { level, category } = req.query;
    const where = { isActive: true };

    if (level) where.level = level;
    if (category) where.category = category;

    const modules = await LearningModule.findAll({
      where,
      order: [['order', 'ASC']]
    });

    res.json({ modules });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const module = await LearningModule.findByPk(req.params.id);
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const progress = await UserProgress.findOne({
      where: { userId: req.userId, moduleId: req.params.id }
    });

    res.json({ module, progress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch module' });
  }
};

exports.getModulesByCategory = async (req, res) => {
  try {
    const modules = await LearningModule.findAll({
      where: { 
        category: req.params.category,
        isActive: true 
      },
      order: [['order', 'ASC']]
    });

    res.json({ modules });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const progress = await UserProgress.findAll({
      where: { userId: req.userId },
      include: [{ model: LearningModule, as: 'module' }]
    });

    res.json({ progress });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { progress: progressValue, status } = req.body;
    
    const [userProgress, created] = await UserProgress.findOrCreate({
      where: { 
        userId: req.userId, 
        moduleId: req.params.moduleId 
      },
      defaults: { 
        progress: progressValue,
        status: status || 'in_progress'
      }
    });

    if (!created) {
      await userProgress.update({ 
        progress: progressValue,
        status: status || userProgress.status
      });
    }

    res.json({ 
      message: 'Progress updated successfully',
      progress: userProgress 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

exports.completeModule = async (req, res) => {
  try {
    const { score } = req.body;
    
    const [userProgress, created] = await UserProgress.findOrCreate({
      where: { 
        userId: req.userId, 
        moduleId: req.params.moduleId 
      },
      defaults: { 
        progress: 100,
        status: 'completed',
        score,
        completedAt: new Date()
      }
    });

    if (!created) {
      await userProgress.update({ 
        progress: 100,
        status: 'completed',
        score,
        completedAt: new Date()
      });
    }

    res.json({ 
      message: 'Module completed successfully',
      progress: userProgress 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete module' });
  }
};
