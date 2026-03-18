const mongoose = require('mongoose');
const Resume = require('./models/Resume');
const aiService = require('./services/ai.service');
const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');

        const filePath = path.join(__dirname, 'test_resume.pdf');
        // Create a dummy PDF if it doesn't exist
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
        }

        const buffer = fs.readFileSync(filePath);

        console.log('Starting PDF extraction...');
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        const text = result.text;
        console.log('Extracted text length:', text.length);

        if (!text || text.trim().length === 0) {
            throw new Error('Extracted text is empty');
        }

        console.log('Starting AI analysis...');
        const analysis = await aiService.analyzeResume(text);
        console.log('Analysis result:', JSON.stringify(analysis, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('TEST FAILED');
        console.error(err);
        process.exit(1);
    }
}

test();
