import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import { 
  FileText, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  MessageSquare,
  Clock,
  ArrowRight,
  Target
} from 'lucide-react';

const Dashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await api.get('/resume');
                setResumes(res.data);
            } catch (err) {
                console.error('Failed to fetch resumes');
            }
            setLoading(false);
        };
        fetchResumes();
    }, []);

    // Derived stats from the most recent resume for the dashboard cards
    const latestResume = resumes.length > 0 ? resumes[0] : null;
    const stats = {
      resumeScore: latestResume?.analysis?.score || 0,
      atsScore: latestResume?.atsScore?.score || 0,
      missingSkills: latestResume?.analysis?.missingSkills?.length || 0
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">General Overview</h1>
                  <p className="text-slate-500 text-sm">Track your career progress and resume insights.</p>
                </div>
                <Link to="/upload" className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200">
                    <Plus className="w-5 h-5 mr-2" />
                    New Analysis
                </Link>
            </div>

            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                  title="Resume Quality" 
                  value={`${stats.resumeScore}/10`}
                  icon={FileText} 
                  color="indigo" 
                  description="Based on latest upload"
                />
                <StatCard 
                  title="ATS Compatibility" 
                  value={`${stats.atsScore}%`}
                  icon={Target} 
                  color="emerald" 
                  description="Average for latest role"
                />
                <StatCard 
                  title="Skill Gaps" 
                  value={stats.missingSkills}
                  icon={AlertTriangle} 
                  color="amber" 
                  description="Skills to acquire"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column: Recent Resumes */}
              <div className="xl:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                    Recent Analyses
                  </h2>
                </div>

                {loading ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-slate-500 animate-pulse">Analyzing results...</p>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                          <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Kickstart your career</h3>
                        <p className="text-slate-500 mb-6 max-w-xs mx-auto text-sm">Upload your resume to get deep AI insights, ATS scoring, and interview training.</p>
                        <Link to="/upload" className="inline-flex items-center px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors">
                            Upload Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resumes.map((resume) => (
                            <div key={resume._id} className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                                    <FileText className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
                                  </div>
                                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                                    Score: {resume.analysis?.score}/10
                                  </span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                                  {resume.filename}
                                </h3>
                                <p className="text-slate-400 text-xs mb-5 flex items-center">
                                  Analyzed on {new Date(resume.createdAt).toLocaleDateString()}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {resume.analysis?.strengths?.length || 0} Strengths
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {resume.analysis?.weaknesses?.length || 0} Gaps
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <Link
                                    to={`/analysis/${resume._id}`}
                                    className="flex items-center justify-center py-2 text-xs font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100"
                                  >
                                    Reports
                                  </Link>
                                  <Link
                                    to={`/ats/${resume._id}`}
                                    className="flex items-center justify-center py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                                  >
                                    ATS Check
                                  </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>

              {/* Right Column: Quick Action/Upgrade */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white overflow-hidden relative group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">HireMind Pro</h3>
                    <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                      Unlock advanced role-specific interview coaching and detailed roadmap tracking.
                    </p>
                    <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center shadow-lg shadow-indigo-900/20">
                      Upgrade Account
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                  {/* Decorative blobs */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6">
                  <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />
                    Latest Features
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Advanced Career Mapping</p>
                        <p className="text-[11px] text-slate-500">Visualize your path to Senior Developer roles.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 opacity-60">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Mock Interview V2</p>
                        <p className="text-[11px] text-slate-500">Video-based interview simulation coming soon.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
};

export default Dashboard;
