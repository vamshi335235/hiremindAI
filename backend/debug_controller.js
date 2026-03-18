const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function debugFlow() {
    console.log("--- DEBUG START ---");
    console.log("Key:", process.env.GEMINI_API_KEY ? "FOUND" : "MISSING");

    // 1. Mock PDF extraction (assuming some buffer or just testing the library)
    console.log("\n1. Testing pdf-parse export...");
    console.log("Type of pdfParse:", typeof pdfParse);
    
    // 2. Test AI Service logic
    console.log("\n2. Testing AI Analysis...");
    const prompt = "Analyze this text: 'Senior Software Engineer with 10 years experience' and return JSON with score and strengths.";
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("AI Response Text:", text);
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            console.log("Extracted JSON:", jsonMatch[0]);
            console.log("Parsed JSON:", JSON.parse(jsonMatch[0]));
        } else {
            console.log("No JSON found in response");
        }
    } catch (e) {
        console.error("AI ANALYSIS FAILED:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
        }
    }
    console.log("--- DEBUG END ---");
}

debugFlow();
