const aiService = require('./services/ai.service');
require('dotenv').config();

async function testAI() {
    try {
        console.log('Testing AI Service with simulated resume text...');
        const resumeText = `
      Vamshi Krishna
      Software Engineer
      Experience:
      - Developed AI Resume Analyzer using React and Node.js.
      - Integrated Google Gemini API for automated analysis.
      - Skills: JavaScript, Node.js, React, MongoDB, Gemini AI.
    `;

        console.log('Calling analyzeResume...');
        const analysis = await aiService.analyzeResume(resumeText);
        console.log('Analysis Success:', JSON.stringify(analysis, null, 2));

        console.log('Testing generateATSScore...');
        const atsResult = await aiService.generateATSScore(resumeText, 'Software Engineer specializing in AI');
        console.log('ATS Result Success:', JSON.stringify(atsResult, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('AI SERVICE TEST FAILED');
        console.error(err);
        process.exit(1);
    }
}

testAI();
