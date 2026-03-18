const Resume = require('../models/Resume');
const aiService = require('../services/aiService');

exports.checkATS = async (req, res) => {
    try {
        const { resumeId, jobDescription } = req.body;
        
        // Find the resume
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Generate ATS Score using AI Service
        const atsResult = await aiService.generateATSScore(resume.resumeText, jobDescription);
        
        // Save the result to the resume model
        resume.atsScore = {
            ...atsResult,
            jobDescription
        };
        await resume.save();

        res.json(resume.atsScore);
    } catch (error) {
        console.error('ATS Check Error:', error);
        res.status(500).json({ error: error.message });
    }
};
