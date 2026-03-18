const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using gemini-1.5-flash-latest or gemini-pro for better compatibility
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const analyzeResume = async (resumeText) => {
    try {
        const prompt = `
            Analyze the following resume text and provide a structured evaluation in JSON format.
            Include:
            1. score (0-10)
            2. strengths (array of strings)
            3. weaknesses (array of strings)
            4. missingSkills (array of strings)
            5. formatting (array of strings)

            Resume Text:
            ${resumeText}

            Return ONLY the raw JSON object.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Robust JSON extraction using regex
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No JSON found in AI response:", text);
            throw new Error("AI response did not contain valid JSON");
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        if (error.message.includes("403") || error.message.includes("404") || error.message.includes("API key")) {
            throw new Error("Gemini AI API Key is invalid or unauthorized. Please update your .env file.");
        }
        throw new Error("Failed to analyze resume with Gemini AI: " + error.message);
    }
};

const generateATSScore = async (resumeText, jobDescription) => {
    try {
        const prompt = `
            Evaluate the compatibility of the following resume with the job description provided.
            Provide a structured evaluation in JSON format including:
            1. score (0-100)
            2. matchedSkills (array of strings)
            3. missingSkills (array of strings)
            4. keywordSuggestions (array of strings)
            5. improvementAdvice (array of strings)

            Resume:
            ${resumeText}

            Job Description:
            ${jobDescription}

            Return ONLY the raw JSON object.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        if (text.includes("```json")) {
            text = text.split("```json")[1].split("```")[0];
        } else if (text.includes("```")) {
            text = text.split("```")[1].split("```")[0];
        }

        return JSON.parse(text.trim());
    } catch (error) {
        console.error("ATS Analysis Error:", error);
        throw new Error("Failed to analyze ATS compatibility with Gemini AI");
    }
};

const generateInterviewQuestions = async (resumeText, jobRole) => {
    try {
        const prompt = `
            Based on the resume and job role provided, generate interview questions.
            Job Role: ${jobRole}
            Resume Text: ${resumeText}

            Please provide exactly:
            - 10 Technical Questions related to the skills/experience in the resume and requirements of the role.
            - 5 Behavioral Questions (e.g., STAR method).
            - 5 HR Questions (e.g., culture fit, salary, availability).

            Return the response in a structured JSON format:
            {
                "technical": ["q1", "q2", ...],
                "behavioral": ["q1", "q2", ...],
                "hr": ["q1", "q2", ...]
            }

            Return ONLY the raw JSON object.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        if (text.includes("```json")) {
            text = text.split("```json")[1].split("```")[0];
        } else if (text.includes("```")) {
            text = text.split("```")[1].split("```")[0];
        }

        return JSON.parse(text.trim());
    } catch (error) {
        console.error("Interview Questions Error:", error);
        throw new Error("Failed to generate interview questions with Gemini AI");
    }
};

const conductMockInterview = async (resumeText, jobRole, questionNumber, previousAnswers, currentAnswer) => {
    try {
        const MAX_QUESTIONS = 5;
        const isLastQuestion = questionNumber >= MAX_QUESTIONS;

        const systemPrompt = `
            You are an expert technical interviewer for the role of ${jobRole}.
            Your goal is to conduct a professional mock interview based on the candidate's resume.
            Candidate's Resume: ${resumeText}

            Instructions:
            1. Evaluate the candidate's current answer.
            2. Provide brief, constructive feedback on their current answer.
            3. ${isLastQuestion ? 'Because this is the final question, DO NOT ask a new question. Instead, provide a concluding summary of their overall performance.' : 'Ask ONE new, relevant interview question.'}
            4. Keep a professional and encouraging tone.

            Format your response exactly as this JSON object:
            {
                "feedback": "Evaluation of their current answer and suggestions (leave empty if it's the very first question)",
                "nextQuestion": "${isLastQuestion ? 'Thank you for your time. That concludes our interview.' : 'The next interview question'}",
                "isEnded": ${isLastQuestion ? 'true' : 'false'}
            }

            Return ONLY the raw valid JSON object.
        `;

        let conversationHistory = "";
        if (previousAnswers && previousAnswers.length > 0) {
            conversationHistory = previousAnswers.map((item, index) =>
                `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`
            ).join('\n\n');
        }

        const currentTurn = currentAnswer
            ? `Current Answer to Evaluate: ${currentAnswer}`
            : `This is the start of the interview. Ask the first question.`;

        const prompt = `
            ${systemPrompt}
            
            Previous Conversation History:
            ${conversationHistory || "None"}

            ${currentTurn}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch[0].trim());
    } catch (error) {
        console.error("Mock Interview Error:", error);
        throw new Error("Failed to conduct mock interview with Gemini AI");
    }
};

const analyzeSkillGap = async (resumeText, jobRole) => {
    try {
        const prompt = `
            You are a career advisor. Analyze the resume and job role and identify the skill gap.
            Candidate Resume: ${resumeText}
            Target Job Role: ${jobRole}

            Provide a structured JSON response:
            {
                "currentSkills": ["list"],
                "missingSkills": ["list"],
                "learningRoadmap": ["steps"],
                "recommendedTools": ["list"],
                "estimatedTime": "approximate time"
            }

            Return ONLY the raw JSON object.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch[0].trim());
    } catch (error) {
        console.error("Skill Gap Analysis Error:", error);
        throw new Error("Failed to analyze skill gap with Gemini AI");
    }
};

const generateCareerRoadmap = async (resumeText) => {
    try {
        const prompt = `
            You are a senior career mentor. Based on the candidate's resume, generate a career improvement roadmap.
            Resume: ${resumeText}

            Provide a structured JSON response:
            {
                "careerLevel": "Current level",
                "keySkillsToImprove": ["list"],
                "projectsToBuild": ["list"],
                "certifications": ["list"],
                "sixMonthPlan": ["milestones"]
            }

            Return ONLY the raw JSON object.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch[0].trim());
    } catch (error) {
        console.error("Career Roadmap Error:", error);
        throw new Error("Failed to generate career roadmap with Gemini AI");
    }
};

const rewriteResume = async (resumeText, jobRole) => {
    try {
        const prompt = `
            You are an elite executive resume writer and ATS optimization expert.
            Rewrite the following resume to be highly professional, grammatically perfect, and optimized for the target job role: ${jobRole}
            
            Key objectives:
            - Use strong action verbs.
            - Focus on quantifiable impact and achievements in the experience section.
            - Ensure ATS compatibility by naturally integrating keywords relevant to ${jobRole}.
            - Maintain a clean, executive tone.

            Original Resume:
            ${resumeText}

            Provide the output structured strictly as JSON with the following keys:
            {
                "professionalSummary": "A powerful 3-4 sentence summary tailored to the role",
                "skills": ["list of highly relevant, optimized skills"],
                "projects": [
                    { "name": "Project Name", "description": "Enhanced, action-oriented description" }
                ],
                "experienceImprovements": ["Specific actionable tips on how the user can further improve their experience section"],
                "fullResumeText": "The complete, fully rewritten resume in a clean text format ready to be copy-pasted"
            }

            Return ONLY the raw JSON object.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch[0].trim());
    } catch (error) {
        console.error("Resume Rewrite Error:", error);
        throw new Error("Failed to rewrite resume with Gemini AI");
    }
};

const buildResumeWithAI = async (resumeText, jobRole) => {
    try {
        const prompt = `
            You are an expert resume writer.

            Rewrite the resume based on the target job role.

            Rules:
            * Do NOT add fake experience
            * Only enhance existing content
            * Use strong action verbs
            * Improve clarity and grammar
            * Add measurable impact

            Resume:
            ${resumeText}

            Target Job Role:
            ${jobRole}

            Return STRICT JSON:
            {
                "name": "Applicant Full Name",
                "contact": "Email, Phone, Location, Links",
                "summary": "Professional Summary",
                "skills": ["Skill 1", "Skill 2"],
                "projects": [
                    { "title": "Project Title", "description": "Project Description" }
                ],
                "experience": [
                    { "company": "Company Name", "role": "Role Title", "description": "Experience Description" }
                ],
                "education": "Education Details (Degree, University, Year)"
            }

            Return ONLY the raw JSON object.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Invalid output from AI, JSON not found.");
        }
        return JSON.parse(jsonMatch[0].trim());
    } catch (error) {
        console.error("Resume Build Error:", error);
        throw new Error("Failed to build resume with Gemini AI");
    }
};

module.exports = {
    analyzeResume,
    generateATSScore,
    generateInterviewQuestions,
    conductMockInterview,
    analyzeSkillGap,
    generateCareerRoadmap,
    rewriteResume,
    buildResumeWithAI
};
