import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle, XCircle, Lightbulb, Layout, Trophy, ArrowRight } from 'lucide-react';

const ResumeAnalysis = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const res = await api.get('/resume');
                const current = res.data.find(r => r._id === id);
                setResume(current);
            } catch (err) {
                console.error('Failed to fetch analysis');
            }
            setLoading(false);
        };
        fetchAnalysis();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center py-40">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!resume) return <div>Analysis not found</div>;

    const analysis = resume?.analysis || {};
    const strengths = analysis?.strengths || [];
    const weaknesses = analysis?.weaknesses || [];
    const missingSkills = analysis?.missingSkills || [];
    const formatting = analysis?.formatting || [];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header / Score Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Analysis Results</h1>
                    <p className="text-slate-500">Comprehensive AI review for <span className="font-semibold text-indigo-600">{resume.filename}</span></p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-tighter">AI Evaluated</span>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-tighter">Gemini 1.5 Flash</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-6 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 border-b-4 border-indigo-700">
                    <span className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Resume Score</span>
                    <div className="flex items-baseline">
                        <span className="text-5xl font-black text-white">{analysis?.score || 0}</span>
                        <span className="text-indigo-300 text-xl font-bold ml-1">/10</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Strengths Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-emerald-50 px-6 py-4 flex items-center border-b border-emerald-100">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                        <h2 className="font-bold text-slate-800">Key Strengths</h2>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            {strengths.map((item, i) => (
                                <li key={i} className="flex group">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black mr-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Weaknesses Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-amber-50 px-6 py-4 flex items-center border-b border-amber-100">
                        <XCircle className="w-5 h-5 text-amber-600 mr-2" />
                        <h2 className="font-bold text-slate-800">Areas for Improvement</h2>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            {weaknesses.map((item, i) => (
                                <li key={i} className="flex group">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-black mr-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Missing Skills Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden md:col-span-2">
                    <div className="bg-indigo-50 px-6 py-4 flex items-center border-b border-indigo-100">
                        <Lightbulb className="w-5 h-5 text-indigo-600 mr-2" />
                        <h2 className="font-bold text-slate-800">Identified Skill Gaps</h2>
                    </div>
                    <div className="p-8">
                        <div className="flex flex-wrap gap-3">
                            {missingSkills.map((skill, i) => (
                                <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl text-sm font-bold flex items-center shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>
                                    {skill}
                                </div>
                            ))}
                        </div>
                        {missingSkills.length === 0 && (
                            <p className="text-center text-slate-400 text-sm italic">No major skills gaps identified for the current profile.</p>
                        )}
                    </div>
                </div>

                {/* Suggestions Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden md:col-span-2">
                    <div className="bg-slate-50 px-6 py-4 flex items-center border-b border-slate-100">
                        <Layout className="w-5 h-5 text-slate-600 mr-2" />
                        <h2 className="font-bold text-slate-800">Formatting & Structure Suggestions</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {formatting.map((item, i) => (
                            <div key={i} className="flex items-start text-sm text-slate-500">
                                <ArrowRight className="w-4 h-4 text-slate-300 mr-2 mt-0.5" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-slate-100">
                <Link to={`/ats/${id}`} className="group w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:-translate-y-1">
                    Check ATS Score
                    <Trophy className="ml-3 w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                </Link>
                <Link to={`/interview/${id}`} className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-indigo-50 text-indigo-600 font-black rounded-2xl hover:bg-indigo-100 transition-all border border-indigo-100">
                    Practice Interview
                </Link>
            </div>
        </div>
    );
};

export default ResumeAnalysis;
