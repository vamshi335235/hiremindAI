const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: String,
    fileUrl: String,
    resumeText: String,
    analysis: {
        score: Number,
        strengths: [String],
        weaknesses: [String],
        missingSkills: [String],
        suggestions: [String],
        formatting: [String]
    },
    atsScore: {
        score: Number,
        matchedSkills: [String],
        missingSkills: [String],
        keywordSuggestions: [String],
        improvementAdvice: [String],
        jobDescription: String
    }
}, {
    timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
