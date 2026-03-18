import React, { useState, useEffect } from 'react';
import { LayoutTemplate, Sparkles, PenTool, Download, Trash2, Plus, Minus, FileText, Smartphone, Briefcase, GraduationCap, Link2, Copy, Check, Loader2 } from 'lucide-react';
import api from '../utils/api';
import html2pdf from 'html2pdf.js';
import { ModernTemplate, SidebarTemplate, MinimalTemplate } from '../components/ResumeTemplates';

const defaultData = {
    name: "",
    contact: "",
    summary: "",
    skills: "",
    projects: [{ title: "", description: "" }],
    experience: [{ company: "", role: "", description: "" }],
    education: ""
};

const ResumeBuilder = () => {
    // Mode & UI State
    const [activeTab, setActiveTab] = useState('manual');
    const [activeTemplate, setActiveTemplate] = useState('modern');
    const [copied, setCopied] = useState(false);
    
    // AI Form State
    const [aiInputText, setAiInputText] = useState('');
    const [aiJobRole, setAiJobRole] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState('');

    // Resume Data State (Load from localStorage if available)
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('hiremind_resume_builder');
        return saved ? JSON.parse(saved) : defaultData;
    });

    // Save to LocalStorage on change
    useEffect(() => {
        localStorage.setItem('hiremind_resume_builder', JSON.stringify(resumeData));
    }, [resumeData]);

    const handleClear = () => {
        if(window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
            setResumeData(defaultData);
            localStorage.removeItem('hiremind_resume_builder');
        }
    };

    const handleCopyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(resumeData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('resume-preview-container');
        // We clone the preview to adjust styling for print if needed, but direct works well if styled right
        const opt = {
            margin:       0,
            filename:     `${resumeData.name.replace(/\s+/g, '_') || 'My'}_Resume.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save();
    };

    const handleAIGenerate = async (e) => {
        e.preventDefault();
        if (!aiInputText.trim() || !aiJobRole.trim()) {
            setAiError("Please provide both resume text and a job role.");
            return;
        }

        setIsGenerating(true);
        setAiError('');

        try {
            const res = await api.post('/resume/build', {
                resumeText: aiInputText,
                jobRole: aiJobRole
            });
            
            // Expected strict JSON back from our AI Prompt
            if (res.data) {
                // Ensure arrays format correctly for UI state if AI didn't pass exact layout
                // Convert skills array to comma separated string for manual edit box
                const formattedData = {
                    ...defaultData,
                    ...res.data,
                    skills: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : res.data.skills
                };
                setResumeData(formattedData);
                setActiveTab('manual'); // Switch to manual tab to see/edit the filled form
            }
        } catch (err) {
            console.error("AI Generation Error:", err);
            setAiError(err.response?.data?.message || err.response?.data?.error || "Failed to generate resume. Try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const updateField = (field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const updateArrayField = (type, index, field, value) => {
        const newArray = [...resumeData[type]];
        newArray[index] = { ...newArray[index], [field]: value };
        setResumeData(prev => ({ ...prev, [type]: newArray }));
    };

    const addArrayItem = (type) => {
        const emptyItem = type === 'projects' 
            ? { title: "", description: "" } 
            : { company: "", role: "", description: "" };
        setResumeData(prev => ({ ...prev, [type]: [...prev[type], emptyItem] }));
    };

    const removeArrayItem = (type, index) => {
        setResumeData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="max-w-[1600px] mx-auto h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
            
            {/* LEFT PANEL: Controls & Forms */}
            <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* Header & Tabs */}
                <div className="border-b border-slate-100 p-4">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center mb-4">
                        <LayoutTemplate className="text-indigo-600 mr-2" />
                        Resume Builder
                    </h1>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('manual')}
                            className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'manual' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <PenTool size={16} className="mr-2" /> Manual Edit
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Sparkles size={16} className="mr-2" /> AI Generator
                        </button>
                    </div>
                </div>

                {/* Form Content Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    
                    {activeTab === 'ai' ? (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-indigo-800 text-sm leading-relaxed">
                                <span className="font-bold">AI Magic:</span> Paste your old resume or rough notes here, give us a target job role, and Gemini 1.5 Flash will instantly restructure, rewrite, and format it into a professional JSON schema that fills the manual builder!
                            </div>
                            
                            <form onSubmit={handleAIGenerate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block">Target Job Role</label>
                                    <input 
                                        type="text" 
                                        value={aiJobRole}
                                        onChange={(e) => setAiJobRole(e.target.value)}
                                        placeholder="e.g. Senior Frontend Developer" 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block">Old Resume / Notes Text</label>
                                    <textarea 
                                        value={aiInputText}
                                        onChange={(e) => setAiInputText(e.target.value)}
                                        placeholder="Paste your unformatted resume here..." 
                                        className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                                        required
                                    />
                                </div>
                                
                                {aiError && <div className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-lg">{aiError}</div>}
                                
                                <button
                                    type="submit"
                                    disabled={isGenerating}
                                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? <><Loader2 className="animate-spin mr-2" size={20} /> Generating Magic...</> : <><Sparkles className="mr-2" size={20} /> Build Resume with AI</>}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in duration-300 pb-10">
                            
                            {/* Personal Details */}
                            <section className="space-y-4">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center border-b border-slate-100 pb-2"><UserIcon className="mr-2 text-indigo-500" size={20}/> Personal Details</h3>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Full Name" value={resumeData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                                    <input type="text" placeholder="Contact Info (Email • Phone • Location)" value={resumeData.contact} onChange={(e) => updateField('contact', e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                                </div>
                            </section>

                            {/* Summary */}
                            <section className="space-y-4">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center border-b border-slate-100 pb-2"><FileText className="mr-2 text-indigo-500" size={20}/> Professional Summary</h3>
                                <textarea placeholder="A brief summary of your expertise..." value={resumeData.summary} onChange={(e) => updateField('summary', e.target.value)} className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none" />
                            </section>

                            {/* Skills */}
                            <section className="space-y-4">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center border-b border-slate-100 pb-2"><PenTool className="mr-2 text-indigo-500" size={20}/> Skills</h3>
                                <textarea placeholder="Comma separated skills (e.g. React, Node.js, Python)" value={resumeData.skills} onChange={(e) => updateField('skills', e.target.value)} className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none" />
                            </section>

                            {/* Experience */}
                            <section className="space-y-4">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between border-b border-slate-100 pb-2">
                                    <span className="flex items-center"><Briefcase className="mr-2 text-indigo-500" size={20}/> Experience</span>
                                    <button onClick={() => addArrayItem('experience')} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors"><Plus size={18} /></button>
                                </h3>
                                <div className="space-y-4">
                                    {resumeData.experience.map((exp, idx) => (
                                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative group">
                                            <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateArrayField('experience', idx, 'company', e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm bg-white" />
                                                <input type="text" placeholder="Role Title" value={exp.role} onChange={(e) => updateArrayField('experience', idx, 'role', e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm bg-white" />
                                            </div>
                                            <textarea placeholder="Description & Achievements..." value={exp.description} onChange={(e) => updateArrayField('experience', idx, 'description', e.target.value)} className="w-full h-20 p-2 border border-slate-200 rounded-lg text-sm bg-white resize-none" />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Projects */}
                            <section className="space-y-4">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between border-b border-slate-100 pb-2">
                                    <span className="flex items-center"><Smartphone className="mr-2 text-indigo-500" size={20}/> Projects</span>
                                    <button onClick={() => addArrayItem('projects')} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors"><Plus size={18} /></button>
                                </h3>
                                <div className="space-y-4">
                                    {resumeData.projects.map((proj, idx) => (
                                        <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative group">
                                            <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                                            <input type="text" placeholder="Project Name" value={proj.title} onChange={(e) => updateArrayField('projects', idx, 'title', e.target.value)} className="w-full p-2 mb-3 border border-slate-200 rounded-lg text-sm bg-white" />
                                            <textarea placeholder="Project Description..." value={proj.description} onChange={(e) => updateArrayField('projects', idx, 'description', e.target.value)} className="w-full h-20 p-2 border border-slate-200 rounded-lg text-sm bg-white resize-none" />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Education */}
                            <section className="space-y-4">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center border-b border-slate-100 pb-2"><GraduationCap className="mr-2 text-indigo-500" size={20}/> Education</h3>
                                <textarea placeholder="B.S. Computer Science, University Name, 2024" value={resumeData.education} onChange={(e) => updateField('education', e.target.value)} className="w-full h-16 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none" />
                            </section>

                        </div>
                    )}
                </div>

                {/* Left Panel Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                    <button onClick={handleClear} className="text-slate-500 hover:text-red-500 text-sm font-bold transition-colors flex items-center">
                        <Trash2 size={16} className="mr-1" /> Clear Data
                    </button>
                    <button onClick={handleCopyJson} className="text-slate-600 hover:text-indigo-600 border border-slate-300 hover:border-indigo-300 bg-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center">
                        {copied ? <Check size={16} className="mr-2 text-emerald-500" /> : <Copy size={16} className="mr-2" />} 
                        {copied ? 'Copied Data' : 'Copy JSON'}
                    </button>
                </div>

            </div>

            {/* RIGHT PANEL: Live Preview */}
            <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col h-full">
                
                {/* View Controls */}
                <div className="bg-white rounded-t-2xl border border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-bold text-slate-500">Template Engine:</span>
                        <select 
                            value={activeTemplate} 
                            onChange={(e) => setActiveTemplate(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-4 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                            <option value="modern">Modern Clean</option>
                            <option value="sidebar">Dark Sidebar</option>
                            <option value="minimal">ATS Minimal</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={handleDownloadPDF}
                        className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center"
                    >
                        <Download size={16} className="mr-2" /> Download PDF
                    </button>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 bg-slate-200/50 rounded-b-2xl border border-t-0 border-slate-200 overflow-y-auto p-4 md:p-8 flex items-start justify-center pattern-isometric pattern-slate-200 pattern-bg-white pattern-size-6 pattern-opacity-20 custom-scrollbar">
                    
                    {/* The A4 Container to be captured by html2pdf */}
                    <div id="resume-preview-container" className="w-full flex justify-center transform origin-top transition-all" style={{ minWidth: '210mm' }}>
                        {activeTemplate === 'modern' && <ModernTemplate data={resumeData} />}
                        {activeTemplate === 'sidebar' && <SidebarTemplate data={resumeData} />}
                        {activeTemplate === 'minimal' && <MinimalTemplate data={resumeData} />}
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ResumeBuilder;

// Missing a simple User icon fallback for imports
const UserIcon = ({ className, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
