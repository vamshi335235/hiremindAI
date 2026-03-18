import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Target, CheckCircle, AlertCircle, Bookmark, ArrowRight, Save, Lightbulb } from 'lucide-react';

const ATSAnalysis = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await api.get('/resume');
                const current = res.data.find(r => r._id === id);
                setResume(current);
                if (current.atsScore) setResult(current.atsScore);
            } catch (err) {
                console.error('Failed to fetch resume');
            }
        };
        fetchResume();
    }, [id]);

    const handleAnalyze = async () => {
        if (!jobDescription) return;
        setAnalyzing(true);
        try {
            const res = await api.post('/ats/check', { resumeId: id, jobDescription });
            setResult(res.data);
        } catch (err) {
            alert('ATS Analysis failed');
        }
        setAnalyzing(false);
    };

    if (!resume) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-slate-900 mb-2 italic">ATS Score Checker</h1>
                <p className="text-slate-500">Paste the job description below to see how well <span className="text-indigo-600 font-bold">{resume.filename}</span> matches the role.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Job description input */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 sticky top-24">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Job Description</label>
                        <textarea
                            className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="Paste the job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        ></textarea>
                        <button
                            onClick={handleAnalyze}
                            disabled={!jobDescription || analyzing}
                            className={`w-full mt-4 flex items-center justify-center py-3 rounded-xl font-bold text-white shadow-lg transition-all ${!jobDescription || analyzing ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {analyzing ? 'Analyzing...' : 'Check Compatibility'}
                            {!analyzing && <Target className="ml-2 w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Right side: Results */}
                <div className="lg:col-span-2">
                    {!result ? (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center">
                            <Target className="w-16 h-16 text-slate-300 mb-4" />
                            <h2 className="text-xl font-semibold text-slate-600 mb-2">Ready to analyze</h2>
                            <p className="text-slate-500 max-w-sm">Paste a job description on the left to see how well your resume matches the requirements.</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Score card */}
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-indigo-50 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Compatibility Score</h2>
                                    <p className="text-slate-500">Based on keyword matching and skill requirements.</p>
                                </div>
                                <div className="relative h-24 w-24">
                                    <svg className="h-full w-full" viewBox="0 0 36 36">
                                        <path
                                            className="text-slate-100"
                                            strokeDasharray="100, 100"
                                            strokeWidth="3"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-indigo-600"
                                            strokeDasharray={`${result?.score || 0}, 100`}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-black text-slate-900">{result?.score || 0}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Matched Skills */}
                                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                                    <div className="flex items-center mb-4">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                                        <h3 className="font-bold text-slate-800">Matched Skills</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(result?.matchedSkills || []).map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Missing Skills */}
                                <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                                    <div className="flex items-center mb-4">
                                        <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
                                        <h3 className="font-bold text-slate-800">Missing Skills</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(result?.missingSkills || []).map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Keyword Suggestions */}
                            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                                <div className="flex items-center mb-4">
                                    <Bookmark className="w-5 h-5 text-indigo-500 mr-2" />
                                    <h3 className="font-bold text-slate-800">Recommended Keywords</h3>
                                </div>
                                <p className="text-sm text-slate-600 mb-4">Incorporate these terms to improve your ATS ranking for this role:</p>
                                <div className="flex flex-wrap gap-2">
                                    {(result?.keywordSuggestions || []).map((kw, i) => (
                                        <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Improvement Advice */}
                            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                                <h3 className="font-bold text-indigo-900 mb-4 flex items-center">
                                    <Lightbulb className="w-5 h-5 mr-2" />
                                    How to Improve
                                </h3>
                                <div className="space-y-3">
                                    {(result?.improvementAdvice || []).map((advice, i) => (
                                        <div key={i} className="flex items-start">
                                            <ArrowRight className="w-4 h-4 text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                                            <p className="text-slate-700 text-sm leading-relaxed">{advice}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ATSAnalysis;
