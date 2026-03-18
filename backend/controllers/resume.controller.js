const Resume = require('../models/Resume');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const aiService = require('../services/aiService');

exports.uploadResume = async (req, res) => {
    try {
        console.log('File received:', req.file ? req.file.originalname : 'No file');
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Extract text from the resume
        let text = '';
        try {
            if (req.file.mimetype === 'application/pdf') {
                console.log('Step 1: Extracting PDF text...');
                if (typeof pdfParse === 'function') {
                    const result = await pdfParse(req.file.buffer);
                    text = result.text;
                } else if (pdfParse.PDFParse && typeof pdfParse.PDFParse === 'function') {
                    // This version (v2+) uses a class constructor and expects data in the config object
                    const parser = new pdfParse.PDFParse({ data: req.file.buffer });
                    try {
                        const data = await parser.getText();
                        text = data.text || '';
                    } finally {
                        await parser.destroy();
                    }
                } else if (pdfParse.default && typeof pdfParse.default === 'function') {
                    const result = await pdfParse.default(req.file.buffer);
                    text = result.text;
                } else {
                    console.error('pdf-parse export is invalid:', typeof pdfParse, 'Keys:', Object.keys(pdfParse));
                    throw new Error('PDF extraction library configuration error');
                }
            } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                console.log('Step 1: Extracting DOCX text...');
                const result = await mammoth.extractRawText({ buffer: req.file.buffer });
                text = result.value;
            } else {
                console.log('Step 1: Unsupported file format:', req.file.mimetype);
                return res.status(400).json({ message: 'Unsupported file format' });
            }
        } catch (extractError) {
            console.error('Text extraction failed:', extractError);
            return res.status(500).json({ error: 'Failed to extract text from file: ' + extractError.message });
        }

        if (!text || text.trim().length === 0) {
            console.log('Step 1: Extraction empty');
            return res.status(400).json({ error: 'Could not extract text from the file.' });
        }

        console.log('Step 2: Extracted text length:', text.length);

        // AI Analysis
        let analysis;
        try {
            console.log('Step 3: Starting AI analysis...');
            analysis = await aiService.analyzeResume(text);
            console.log('Step 4: AI analysis complete.');
        } catch (aiError) {
            console.error('AI analysis failed:', aiError);
            return res.status(500).json({ error: 'AI analysis failed: ' + aiError.message });
        }

        try {
            console.log('Step 5: Saving to database...');
            const newResume = new Resume({
                userId: req.user._id,
                filename: req.file.originalname,
                resumeText: text,
                analysis
            });

            await newResume.save();
            console.log('Step 6: Database save successful.');
            res.status(201).json(newResume);
        } catch (dbError) {
            console.error('Database save failed:', dbError);
            return res.status(500).json({ error: 'Database save failed: ' + dbError.message });
        }
    } catch (error) {
        console.error('GLOBAL UPLOAD ERROR:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

exports.getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.analyzeATS = async (req, res) => {
    try {
        const { resumeId, jobDescription } = req.body;
        const resume = await Resume.findById(resumeId);
        if (!resume) return res.status(404).json({ message: 'Resume not found' });

        const atsResult = await aiService.generateATSScore(resume.resumeText, jobDescription);
        resume.atsScore = { ...atsResult, jobDescription };
        await resume.save();

        res.json(resume.atsScore);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.rewriteResume = async (req, res) => {
    try {
        const { resumeText, jobRole } = req.body;
        
        if (!resumeText || !jobRole) {
            return res.status(400).json({ message: 'Resume text and target job role are required' });
        }

        const rewrittenResume = await aiService.rewriteResume(resumeText, jobRole);
        res.json(rewrittenResume);
    } catch (error) {
        console.error("Resume Rewrite Controller Error:", error);
        res.status(500).json({ error: error.message });
    }
};
