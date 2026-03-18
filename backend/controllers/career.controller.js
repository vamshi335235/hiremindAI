const aiService = require('../services/aiService');

exports.getSkillGap = async (req, res) => {
    try {
        const { resumeText, jobRole } = req.body;
        const gap = await aiService.analyzeSkillGap(resumeText, jobRole);
        res.json(gap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRoadmap = async (req, res) => {
    try {
        const { resumeText } = req.body;
        const roadmap = await aiService.generateCareerRoadmap(resumeText);
        res.json(roadmap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
