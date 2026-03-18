const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const auth = require('../middleware/authMiddleware');

router.post('/questions', auth, interviewController.generateQuestions);
router.post('/evaluate', auth, interviewController.evaluateAnswer);
router.post('/mock', auth, interviewController.mockInterview);

module.exports = router;
