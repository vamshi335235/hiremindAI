const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resume.controller');
const auth = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', auth, upload.single('resume'), resumeController.uploadResume);
router.post('/analyze', auth, resumeController.uploadResume); // Reusing uploadResume as it contains analysis logic
router.get('/', auth, resumeController.getResumes);
router.post('/ats', auth, resumeController.analyzeATS);
router.post('/rewrite', auth, resumeController.rewriteResume);
router.post('/build', auth, resumeController.buildResumeAI);

module.exports = router;
