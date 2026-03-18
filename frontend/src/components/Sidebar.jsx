import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Target,
  FileText,
  MessageSquare,
  TrendingUp,
  FileSignature,
  X,
  LayoutTemplate
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Resume Builder', icon: LayoutTemplate, path: '/resume-builder' },
    { title: 'Upload Resume', icon: Upload, path: '/upload' },
    { title: 'Resume Rewriter', icon: FileSignature, path: '/resume-rewriter' },
    { title: 'ATS Checker', icon: Target, path: '/ats-checker' }, // Updated to generic path if ID not available
    { title: 'Interview Qs', icon: FileText, path: '/interview-questions' },
    { title: 'Mock Interview', icon: MessageSquare, path: '/mock-interview' },
    { title: 'Career Roadmap', icon: TrendingUp, path: '/career-roadmap' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                HireMind AI
              </span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-1 text-slate-500 hover:bg-slate-50 rounded-md">
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}
                `}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
              >
                <item.icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pro Plan</p>
              <p className="text-sm text-slate-600 mb-3">Get unlimited AI resume analysis</p>
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
