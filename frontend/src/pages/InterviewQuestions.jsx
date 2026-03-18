import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { 
    MessageSquare, 
    Cpu, 
    Users, 
    Briefcase, 
    ChevronRight, 
    Loader2, 
    ShieldCheck,
    ArrowLeft
} from 'lucide-react';

const InterviewQuestions = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [jobRole, setJobRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState(null);
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/resume');
                setResumes(res.data);
                if (id) {
                    const current = res.data.find(r => r._id === id);
                    setResume(current);
                }
            } catch (err) {
                console.error('Failed to fetch data');
            }
        };
        fetchData();
    }, [id]);

    const handleGenerate = async () => {
        if (!resume || !jobRole) return;
        setLoading(true);
        try {
            const res = await api.post('/interview/questions', {
                resumeText: resume.resumeText,
                jobRole: jobRole
            });
            setQuestions(res.data);
        } catch (err) {
            alert('Failed to generate questions');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Interview Prep</h1>
                    <p className="text-slate-500">Generate targeted questions based on your resume and target role.</p>
                </div>
                <Link to="/dashboard" className="flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Setup Coach</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Role</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Senior Fullstack Engineer"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Resume</label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium appearance-none"
                                    value={resume?._id || ''}
                                    onChange={(e) => setResume(resumes.find(r => r._id === e.target.value))}
                                >
                                    <option value="" disabled>Choose a resume...</option>
                                    {resumes.map(r => (
                                        <option key={r._id} value={r._id}>{r.filename}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !resume || !jobRole}
                                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl ${
                                    loading || !resume || !jobRole
                                    ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Generating...
                                    </span>
                                ) : 'Generate Questions'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">AI Tip</h3>
                            <p className="text-indigo-200 text-xs leading-relaxed">
                                Use the behavioral questions to practice your STAR method (Situation, Task, Action, Result) responses.
                            </p>
                        </div>
                        <Cpu className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
                    </div>
                </div>

                {/* Questions Display Area */}
                <div className="lg:col-span-2">
                    {!questions ? (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                                <MessageSquare className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Your question bank is empty</h3>
                            <p className="text-slate-500 text-sm max-w-sm">Enter your target role and select a resume to get a custom list of interview questions.</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Technical Section */}
                            <section>
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-indigo-100 rounded-xl mr-3 text-indigo-600">
                                        <Cpu size={20} />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">Technical Deep-dive</h2>
                                    <span className="ml-auto text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase">10 Questions</span>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {(questions?.technical || []).map((q, i) => (
                                        <div key={i} className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-indigo-300 transition-all shadow-sm">
                                            <div className="flex">
                                                <span className="text-indigo-200 font-black italic mr-4 text-xl group-hover:text-indigo-400 transition-colors">{(i + 1).toString().padStart(2, '0')}</span>
                                                <p className="text-slate-700 font-bold leading-relaxed">{q}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Behavioral Section */}
                            <section>
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-emerald-100 rounded-xl mr-3 text-emerald-600">
                                        <Users size={20} />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">Behavioral Scenarios</h2>
                                    <span className="ml-auto text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase">5 Questions</span>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {(questions?.behavioral || []).map((q, i) => (
                                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-emerald-300 transition-all shadow-sm">
                                            <p className="text-slate-700 font-bold leading-relaxed">{q}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* HR Section */}
                            <section>
                                <div className="flex items-center mb-6">
                                    <div className="p-2 bg-amber-100 rounded-xl mr-3 text-amber-600">
                                        <Briefcase size={20} />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">HR & Strategy</h2>
                                    <span className="ml-auto text-[10px] font-black bg-amber-50 text-amber-600 px-3 py-1 rounded-full uppercase">5 Questions</span>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {(questions?.hr || []).map((q, i) => (
                                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-amber-300 transition-all shadow-sm">
                                            <p className="text-slate-700 font-bold leading-relaxed">{q}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-200">
                                <div>
                                    <h3 className="text-2xl font-black mb-2">Ready for a Mock Interview?</h3>
                                    <p className="text-indigo-100 text-sm">Practice these questions in a real-time voice or text simulation.</p>
                                </div>
                                <Link to={`/mock-interview/${id || ''}`} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-colors shadow-lg shadow-black/10">
                                    Start Mock Sesssion
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewQuestions;
