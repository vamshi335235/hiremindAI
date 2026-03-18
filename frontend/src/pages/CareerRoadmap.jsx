import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { Briefcase, GraduationCap, Clock, Award, Rocket, ArrowRight } from 'lucide-react';

const CareerRoadmap = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const res = await api.get('/resume');
                const curr = res.data.find(r => r._id === id);
                setResume(curr);

                const roadRes = await api.post('/career/roadmap', { resumeText: curr.resumeText });
                setRoadmap(roadRes.data);
            } catch (err) {
                console.error('Failed to fetch roadmap');
            }
            setLoading(false);
        };
        fetchRoadmap();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center py-40">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!roadmap) return <div>Failed to load career roadmap</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Career Roadmap</h1>
                <p className="text-slate-500">Curated path based on your current profile and career level.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                    <div className="flex flex-col items-center text-center">
                        <div className="p-4 bg-indigo-100 rounded-full mb-4">
                            <Rocket className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Career Level</h2>
                        <p className="text-xl font-bold text-slate-800">{roadmap.careerLevel}</p>
                    </div>
                </div>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-amber-500" />
                            Key Skills to Improve
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {roadmap.keySkillsToImprove.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                            <GraduationCap className="w-5 h-5 mr-2 text-emerald-500" />
                            Recommended Certifications
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {roadmap.certifications.map((cert, i) => (
                                <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                    <Clock className="w-6 h-6 mr-3 text-indigo-600" />
                    6-Month Growth Plan
                </h2>
                <div className="space-y-4">
                    {roadmap.sixMonthPlan.map((step, i) => (
                        <div key={i} className="flex bg-white p-6 rounded-2xl shadow-sm border border-slate-100 items-start">
                            <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-6 flex-shrink-0">
                                {i + 1}
                            </div>
                            <p className="text-slate-700 leading-relaxed font-medium">{step}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <Briefcase className="w-6 h-6 mr-3 text-indigo-600" />
                    Projects to Build
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roadmap.projectsToBuild.map((project, i) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                            <h4 className="font-bold text-indigo-700 mb-2">{project.split(':')[0]}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{project.split(':')[1] || project}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CareerRoadmap;
