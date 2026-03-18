import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { Send, User, Bot, RotateCcw, ThumbsUp, ThumbsDown, Star, Loader2, ChevronRight, Mic, MicOff, Volume2, VolumeX, PlayCircle } from 'lucide-react';

const MockInterview = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [jobRole, setJobRole] = useState('');
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [previousAnswers, setPreviousAnswers] = useState([]);
    const [isEnded, setIsEnded] = useState(false);
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    // Timer Logic
    useEffect(() => {
        if (isStarted && !loading && !isEnded && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !loading && !isEnded) {
            // Time's up - auto submit
            setUserInput("Time's up! No answer provided.");
            handleSend(true); // Pass true to indicate auto-submit
        }

        return () => clearInterval(timerRef.current);
    }, [isStarted, loading, isEnded, timeLeft]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                setUserInput(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await api.get('/resume');
                const found = res.data.find(r => r._id === id);
                setResume(found);
            } catch (err) {
                console.error('Failed to fetch resume');
            }
        };
        fetchResume();
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const speakText = (text) => {
        if (isMuted) return;
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find a professional female voice (common for AI)
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Female'));
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const startInterview = async () => {
        if (!jobRole || !resume) return;
        setLoading(true);
        try {
            const res = await api.post('/interview/mock', {
                resumeText: resume.resumeText,
                jobRole,
                questionNumber: 1,
                previousAnswers: [],
                currentAnswer: ""
            });

            const nextQuestion = res.data.nextQuestion;
            setMessages([
                { role: 'assistant', content: nextQuestion }
            ]);
            setQuestionNumber(1);
            setPreviousAnswers([]);
            setTimeLeft(60);
            setIsEnded(false);
            setIsStarted(true);
            speakText(nextQuestion);
        } catch (err) {
            alert('Failed to start interview');
        }
        setLoading(false);
    };

    const handleSend = async (isAutoSubmit = false) => {
        // Prevent empty submits unless it's a timeout auto-submit
        if ((!userInput.trim() && !isListening && !isAutoSubmit) || loading || isEnded) return;

        // If listening, stop it first
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        clearInterval(timerRef.current); // Stop timer while processing

        const currentAnswerText = isAutoSubmit ? "Time's up! No answer provided." : userInput.trim();
        const newUserMessage = { role: 'user', content: currentAnswerText };
        const updatedMessages = [...messages, newUserMessage];
        
        setMessages(updatedMessages);
        setUserInput('');
        setLoading(true);

        // Get the current question (last assistant message before the user answered)
        const lastQuestion = [...messages].reverse().find(m => m.role === 'assistant')?.content || '';
        
        const newPreviousAnswers = [
            ...previousAnswers,
            { question: lastQuestion, answer: currentAnswerText }
        ];

        try {
            const res = await api.post('/interview/mock', {
                resumeText: resume.resumeText,
                jobRole,
                questionNumber: questionNumber,
                previousAnswers: newPreviousAnswers,
                currentAnswer: currentAnswerText
            });

            const assistantResponse = {
                role: 'assistant',
                content: res.data.nextQuestion,
                feedback: res.data.feedback,
                isEnded: res.data.isEnded
            };

            setMessages(prev => [...prev, assistantResponse]);
            setPreviousAnswers(newPreviousAnswers);
            
            if (res.data.isEnded) {
                setIsEnded(true);
                setTimeLeft(0);
            } else {
                setQuestionNumber(prev => prev + 1);
                setTimeLeft(60); // Reset timer for next question
            }
            
            speakText(res.data.nextQuestion);
        } catch (err) {
            alert('Failed to get AI response');
            setTimeLeft(60); // Reset timer on error to allow retry
        }
        setLoading(false);
    };

    if (!resume) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between px-2">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 italic">Interview Bot</h1>
                    <p className="text-slate-500 text-xs">Simulating interview for <span className="text-indigo-600 font-bold">{jobRole || '...'}</span></p>
                </div>
                {/* Timer Display */}
                {isStarted && (
                    <div className={`px-4 py-2 rounded-xl font-bold flex items-center justify-center min-w-[100px] border shadow-sm transition-colors ${
                        timeLeft <= 10 ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse" : "bg-white text-slate-700 border-slate-200"
                    }`}>
                        <div className="w-2 h-2 rounded-full mr-2 bg-current opacity-70"></div>
                        <span>00:{timeLeft.toString().padStart(2, '0')}</span>
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2 rounded-xl transition-all ${isMuted ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-600'}`}
                        title={isMuted ? "Unmute Bot" : "Mute Bot"}
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    {isStarted && (
                        <button 
                            onClick={() => window.location.reload()}
                            className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center"
                        >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Reset Session
                        </button>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden relative">
                {!isStarted ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="max-w-sm w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                                <Bot className="w-12 h-12 text-indigo-600" />
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-white">
                                    <Volume2 size={12} />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">Voice Interview Active</h2>
                                <p className="text-slate-500 text-sm">The bot will speak questions aloud. You can toggle the mic once the interview starts.</p>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Frontend Engineer"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                />
                                <button
                                    onClick={startInterview}
                                    disabled={!jobRole || loading}
                                    className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center space-x-2 disabled:bg-slate-100 disabled:text-slate-300 group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Enter Simulation</span>
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                            {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`max-w-[80%] flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                                            msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-indigo-600'
                                        }`}>
                                            {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                        </div>

                                        <div className="space-y-3 relative group">
                                            {msg.feedback && (
                                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl rounded-tl-none text-emerald-800 text-sm">
                                                    <div className="flex items-center mb-2 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
                                                        <Star size={12} className="mr-1 fill-emerald-600" />
                                                        AI Feedback
                                                    </div>
                                                    <p className="font-medium leading-relaxed">{msg.feedback}</p>
                                                </div>
                                            )}
                                            
                                            <div className={`p-5 rounded-[2rem] relative ${
                                                msg.role === 'user' 
                                                ? 'bg-indigo-600 text-white font-bold rounded-tr-none shadow-lg shadow-indigo-100' 
                                                : 'bg-slate-50 text-slate-800 font-medium rounded-tl-none border border-slate-100 leading-relaxed'
                                            }`}>
                                                {msg.content}
                                                {msg.role === 'assistant' && (
                                                    <button 
                                                        onClick={() => speakText(msg.content)}
                                                        className="absolute -right-12 top-0 p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                                                        title="Play audio"
                                                    >
                                                        <PlayCircle size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start animate-pulse">
                                    <div className="flex items-center space-x-2 bg-slate-50 px-4 py-3 rounded-full border border-slate-100">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-slate-100">
                            <div className="relative group flex items-end gap-3">
                                <div className="relative flex-1">
                                    <textarea
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                                        placeholder={isListening ? "Listening..." : (isEnded ? "Interview complete." : (timeLeft === 0 ? "Time's up!" : "Type or speak your answer..."))}
                                        disabled={isEnded || timeLeft === 0}
                                        className={`w-full bg-slate-50 border-2 rounded-[2rem] px-6 py-5 pr-16 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none h-20 scrollbar-hide ${
                                            (isEnded || timeLeft === 0) ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' :
                                            (isListening ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-50 focus:bg-white focus:border-indigo-100')
                                        }`}
                                    />
                                    <button
                                        onClick={toggleListening}
                                        disabled={isEnded || timeLeft === 0}
                                        className={`absolute right-3 top-3 w-14 h-14 rounded-3xl flex items-center justify-center transition-all shadow-lg ${
                                            (isEnded || timeLeft === 0) ? 'bg-slate-100 text-slate-300 shadow-none cursor-not-allowed' :
                                            (isListening 
                                            ? 'bg-rose-500 text-white animate-pulse' 
                                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100')
                                        }`}
                                        title={isListening ? "Stop Listening" : "Speak Answer"}
                                    >
                                        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleSend(false)}
                                    disabled={(!userInput.trim() && !isListening) || loading || isEnded || timeLeft === 0}
                                    className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all shadow-lg ${
                                        (!userInput.trim() && !isListening) || loading || isEnded || timeLeft === 0
                                        ? 'bg-slate-100 text-slate-300 shadow-none'
                                        : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
                                    }`}
                                >
                                    <Send size={24} />
                                </button>
                            </div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4 text-center">
                                {isListening ? "I'm listening to you... speak now" : 
                                (isEnded ? "Interview complete" : 
                                (timeLeft === 0 ? "Time's up! Loading..." : "Shift + Enter for new line • Enter to send"))}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MockInterview;
