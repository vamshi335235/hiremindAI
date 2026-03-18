const express = require('express');
const router = express.Router();
const careerController = require('../controllers/career.controller');
const auth = require('../middleware/authMiddleware');

router.post('/skill-gap', auth, careerController.getSkillGap);
router.post('/roadmap', auth, careerController.getRoadmap);

module.exports = router;
