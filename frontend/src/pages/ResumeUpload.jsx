import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Upload, File, X, CheckCircle, ArrowRight } from 'lucide-react';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0] || e.dataTransfer?.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setSuccess(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setSuccess(false);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await api.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess(true);
            setTimeout(() => {
                navigate(`/analysis/${res.data._id}`);
            }, 1500);
        } catch (err) {
            alert(err.response?.data?.error || err.message || 'Upload failed');
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-indigo-600 px-8 py-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white">Upload Your Resume</h2>
                        <p className="text-indigo-100 mt-1">Get AI-powered insights, ATS scores, and interview preparation.</p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl font-bold"></div>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-12 text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Resume uploaded successfully!</h3>
                            <p className="text-slate-500 mb-0">Redirecting to your AI analysis...</p>
                        </div>
                    ) : (
                        <>
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-4 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${
                                    isDragging 
                                    ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
                                    : file 
                                        ? 'border-emerald-200 bg-emerald-50/30' 
                                        : 'border-slate-200 hover:border-indigo-300'
                                }`}
                            >
                                {!file ? (
                                    <>
                                        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                            <Upload className="w-10 h-10 text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-700 mb-2">Drag and drop your file here</h3>
                                        <p className="text-slate-500 mb-8 text-sm">Supported formats: PDF, DOCX (Max 5MB)</p>
                                        <label className="cursor-pointer bg-slate-900 border border-transparent px-8 py-3 rounded-xl text-sm font-bold text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all inline-block">
                                            Browse Files
                                            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                                        </label>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 mb-6 relative">
                                            <File className="w-16 h-16 text-emerald-500" />
                                            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                                                <CheckCircle size={16} />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-1">{file.name}</h3>
                                        <p className="text-slate-500 text-sm mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <div className="flex space-x-6">
                                            <button
                                                onClick={() => setFile(null)}
                                                className="flex items-center text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-wider"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Remove File
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10 flex justify-center">
                                <button
                                    onClick={handleUpload}
                                    disabled={!file || uploading}
                                    className={`relative group flex items-center justify-center px-12 py-4 rounded-2xl font-black text-white shadow-2xl transition-all h-16 w-full max-w-sm ${
                                        !file || uploading 
                                        ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/40 active:scale-95'
                                    }`}
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-4 border-white/20 border-t-white mr-4"></div>
                                            <span className="uppercase tracking-widest text-sm">Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="uppercase tracking-widest text-sm">Analyze Resume</span>
                                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6">
                    <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto shadow-md mb-4">
                        <span className="text-indigo-600 font-bold">1</span>
                    </div>
                    <h4 className="font-bold text-slate-800">Upload</h4>
                    <p className="text-sm text-slate-500 mt-2">Securely upload your resume in PDF or DOCX format.</p>
                </div>
                <div className="p-6">
                    <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto shadow-md mb-4">
                        <span className="text-indigo-600 font-bold">2</span>
                    </div>
                    <h4 className="font-bold text-slate-800">Analyze</h4>
                    <p className="text-sm text-slate-500 mt-2">AI extracts and analyzes your skills and experience.</p>
                </div>
                <div className="p-6">
                    <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto shadow-md mb-4">
                        <span className="text-indigo-600 font-bold">3</span>
                    </div>
                    <h4 className="font-bold text-slate-800">Improve</h4>
                    <p className="text-sm text-slate-500 mt-2">Get personalized feedback to nail your next interview.</p>
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;
