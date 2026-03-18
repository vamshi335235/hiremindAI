const express = require('express');
const router = express.Router();
const atsController = require('../controllers/ats.controller');
const auth = require('../middleware/authMiddleware');

router.post('/check', auth, atsController.checkATS);

module.exports = router;
