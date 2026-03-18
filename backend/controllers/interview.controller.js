const aiService = require('../services/aiService');

exports.generateQuestions = async (req, res) => {
    try {
        const { resumeText, jobRole } = req.body;
        const questions = await aiService.generateInterviewQuestions(resumeText, jobRole);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.evaluateAnswer = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const evaluation = await aiService.evaluateInterviewAnswer(question, answer);
        res.json(evaluation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.mockInterview = async (req, res) => {
    try {
        const { resumeText, jobRole, questionNumber, previousAnswers, currentAnswer } = req.body;
        const response = await aiService.conductMockInterview(resumeText, jobRole, questionNumber, previousAnswers, currentAnswer);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
