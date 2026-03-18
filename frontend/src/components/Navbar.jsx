import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, MessageSquare, Briefcase } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-white border-b border-slate-200 fixed w-full z-30 top-0">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <Link to="/dashboard" className="flex ml-2 md:mr-24">
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-indigo-600">HireMind AI</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ml-3">
                            <span className="mr-4 text-sm font-medium text-slate-600">Welcome, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
