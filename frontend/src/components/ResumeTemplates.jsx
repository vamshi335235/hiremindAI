import React from 'react';

// Format skills array for display if it's passed as a single string occasionally
const getSkillsArray = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') return skills.split(',').map(s => s.trim()).filter(Boolean);
    return [];
};

export const ModernTemplate = ({ data }) => {
    const skills = getSkillsArray(data?.skills);
    
    return (
        <div id="resume-preview" className="bg-white text-slate-900 p-8 w-full max-w-[210mm] min-h-[297mm] shadow-lg mx-auto font-sans box-border" style={{ aspectRatio: '210/297' }}>
            <div className="border-b-4 border-slate-900 pb-6 mb-6 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase mb-2">{data?.name || 'Your Name'}</h1>
                <p className="text-sm font-semibold text-slate-600 tracking-wider">
                    {data?.contact || 'email@example.com • (555) 123-4567 • linkedin.com/in/yourprofile'}
                </p>
            </div>

            {data?.summary && (
                <div className="mb-6">
                    <p className="text-sm leading-relaxed text-slate-700">{data.summary}</p>
                </div>
            )}

            {skills.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1 mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-800 px-3 py-1 rounded-sm text-xs font-semibold">{skill}</span>
                        ))}
                    </div>
                </div>
            )}

            {data?.experience?.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1 mb-3">Experience</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-800 text-base">{exp.role || 'Role Title'}</h3>
                                    <span className="font-semibold text-slate-600 text-sm">{exp.company || 'Company Name'}</span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data?.projects?.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1 mb-3">Projects</h2>
                    <div className="space-y-4">
                        {data.projects.map((proj, idx) => (
                            <div key={idx}>
                                <h3 className="font-bold text-slate-800 text-base mb-1">{proj.title || 'Project Title'}</h3>
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data?.education && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-200 pb-1 mb-3">Education</h2>
                    <p className="text-sm font-semibold text-slate-800">{data.education}</p>
                </div>
            )}
        </div>
    );
};

export const SidebarTemplate = ({ data }) => {
    const skills = getSkillsArray(data?.skills);

    return (
        <div id="resume-preview" className="bg-white flex w-full max-w-[210mm] min-h-[297mm] shadow-lg mx-auto font-sans overflow-hidden box-border" style={{ aspectRatio: '210/297' }}>
            {/* Left Sidebar */}
            <div className="w-[30%] bg-slate-900 text-slate-100 p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2 leading-none">{data?.name || 'Your Name'}</h1>
                </div>

                <div className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-700 pb-2 mb-3">Contact</h2>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap breakdown break-all">
                        {data?.contact ? data.contact.replace(/\s*[•|,]\s*/g, '\n') : 'email@example.com\n(555) 123-4567\nlinkedin.com/in/you'}
                    </p>
                </div>

                {skills.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-700 pb-2 mb-3">Skills</h2>
                        <ul className="space-y-2">
                            {skills.map((skill, idx) => (
                                <li key={idx} className="text-xs font-semibold">{skill}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {data?.education && (
                    <div className="mt-auto">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-700 pb-2 mb-3">Education</h2>
                        <p className="text-xs font-medium leading-relaxed">{data.education}</p>
                    </div>
                )}
            </div>

            {/* Right Content */}
            <div className="w-[70%] p-8 bg-white text-slate-800 flex flex-col">
                {data?.summary && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-2">Profile</h2>
                        <p className="text-sm leading-relaxed">{data.summary}</p>
                    </div>
                )}

                {data?.experience?.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-slate-100 pb-2 mb-4">Experience</h2>
                        <div className="space-y-5">
                            {data.experience.map((exp, idx) => (
                                <div key={idx}>
                                    <h3 className="font-bold text-slate-900 text-base">{exp.role || 'Role'}</h3>
                                    <p className="font-semibold text-slate-500 text-xs mb-2 uppercase tracking-wide">{exp.company || 'Company'}</p>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {data?.projects?.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-slate-100 pb-2 mb-4">Projects</h2>
                        <div className="space-y-5">
                            {data.projects.map((proj, idx) => (
                                <div key={idx}>
                                    <h3 className="font-bold text-slate-900 text-base mb-1">{proj.title || 'Project'}</h3>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const MinimalTemplate = ({ data }) => {
    const skills = getSkillsArray(data?.skills);

    return (
        <div id="resume-preview" className="bg-white text-black p-10 w-full max-w-[210mm] min-h-[297mm] shadow-lg mx-auto font-serif box-border" style={{ aspectRatio: '210/297' }}>
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2">{data?.name || 'Your Name'}</h1>
                <p className="text-sm">{data?.contact || 'email@email.com | (555) 555-5555 | LinkedIn | GitHub'}</p>
            </div>

            {data?.summary && (
                <div className="mb-4">
                    <p className="text-sm">{data.summary}</p>
                </div>
            )}

            {data?.experience?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Experience</h2>
                    {data.experience.map((exp, idx) => (
                        <div key={idx} className="mb-3">
                            <div className="flex justify-between items-baseline font-bold text-sm">
                                <span>{exp.company || 'Company'}</span>
                                <span>{exp.role || 'Role'}</span>
                            </div>
                            <p className="text-sm mt-1 whitespace-pre-line">{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {data?.projects?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Projects</h2>
                    {data.projects.map((proj, idx) => (
                        <div key={idx} className="mb-3 flex flex-col gap-1">
                            <span className="font-bold text-sm">{proj.title || 'Project Title'}:</span>
                            <span className="text-sm whitespace-pre-line">{proj.description}</span>
                        </div>
                    ))}
                </div>
            )}

            {skills.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Skills</h2>
                    <p className="text-sm"><span className="font-bold">Technical Skills:</span> {skills.join(', ')}</p>
                </div>
            )}

            {data?.education && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Education</h2>
                    <p className="text-sm">{data.education}</p>
                </div>
            )}
        </div>
    );
};
