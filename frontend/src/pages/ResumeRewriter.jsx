import React, { useState, useEffect } from 'react';
import { FileSignature, Search, Edit3, Copy, Download, Loader2, Check } from 'lucide-react';
import api from '../utils/api';

const ResumeRewriter = () => {
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [rewrittenData, setRewrittenData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await api.get('/resume');
                setResumes(res.data);
                if (res.data.length > 0) {
                    setSelectedResumeId(res.data[0]._id);
                }
            } catch (err) {
                console.error("Failed to fetch resumes:", err);
            }
        };
        fetchResumes();
    }, []);

    const handleRewrite = async (e) => {
        e.preventDefault();
        setError('');
        setRewrittenData(null);
        setCopied(false);

        if (!selectedResumeId || !jobRole.trim()) {
            setError("Please select a resume and enter a target job role.");
            return;
        }

        const selectedResume = resumes.find(r => r._id === selectedResumeId);
        if (!selectedResume) return;

        setLoading(true);
        try {
            const res = await api.post('/resume/rewrite', {
                resumeText: selectedResume.resumeText,
                jobRole: jobRole.trim()
            });
            setRewrittenData(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data?.error || "Failed to rewrite resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!rewrittenData?.fullResumeText) return;
        navigator.clipboard.writeText(rewrittenData.fullResumeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!rewrittenData?.fullResumeText) return;
        const blob = new Blob([rewrittenData.fullResumeText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rewritten_Resume_${jobRole.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <FileSignature size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">AI Resume Rewriter</h1>
                    <p className="text-slate-500 mt-1">Optimize and rewrite your resume for a specific job role to bypass ATS and stand out.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <form onSubmit={handleRewrite} className="space-y-6 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resume Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Select Source Resume</label>
                            <select
                                value={selectedResumeId}
                                onChange={(e) => setSelectedResumeId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-700 font-medium"
                                disabled={loading}
                            >
                                {resumes.length === 0 ? (
                                    <option value="">No resumes found. Please upload one.</option>
                                ) : (
                                    resumes.map(r => (
                                        <option key={r._id} value={r._id}>{r.filename || 'Untitled Resume'}</option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Target Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Target Job Role</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    placeholder="e.g., Senior Full Stack Engineer"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-slate-700"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100 flex items-center">
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading || resumes.length === 0 || !jobRole.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-xl font-bold flex items-center transition-all shadow-sm hover:shadow"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Rewriting Resume...
                                </>
                            ) : (
                                <>
                                    <Edit3 className="mr-2" size={20} />
                                    Rewrite Resume
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Display */}
            {rewrittenData && !loading && (
                <div className="mt-8 space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-4">Optimization Results</h2>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleCopy}
                                className="flex items-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-semibold text-slate-700 transition-colors shadow-sm"
                            >
                                {copied ? <Check size={16} className="text-emerald-500 mr-2" /> : <Copy size={16} className="text-slate-500 mr-2" />}
                                {copied ? 'Copied!' : 'Copy Text'}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                            >
                                <Download size={16} className="mr-2" />
                                Download .txt
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Breakdown */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Professional Summary */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-sm">1</span>
                                    Professional Summary
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                                    "{rewrittenData.professionalSummary}"
                                </p>
                            </div>

                            {/* Skills Optimization */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                    <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mr-3 text-sm">2</span>
                                    Targeted Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {rewrittenData.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-violet-50 text-violet-700 text-xs font-semibold rounded-full border border-violet-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Tips */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                    <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-3 text-sm">3</span>
                                    Experience Strategy
                                </h3>
                                <ul className="space-y-3">
                                    {rewrittenData.experienceImprovements.map((tip, index) => (
                                        <li key={index} className="flex items-start text-sm text-slate-600">
                                            <span className="text-orange-500 mr-2">•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: Full Resume Text */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 h-full flex flex-col">
                                <div className="mb-6 pb-6 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Final Rewritten Resume</h3>
                                        <p className="text-slate-500 text-sm mt-1">Ready to be copy-pasted into your template.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex-1 overflow-auto max-h-[800px]">
                                    <pre className="text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
                                        {rewrittenData.fullResumeText}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeRewriter;
