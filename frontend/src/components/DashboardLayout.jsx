import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, User as UserIcon, Bell } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden mr-2"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">Dashboard</h2>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            <div className="flex items-center space-x-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500">Free Tier</p>
              </div>
              <div className="group relative">
                <button className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold hover:bg-indigo-200 transition-colors">
                  {user?.name?.charAt(0) || <UserIcon size={18} />}
                </button>
                
                {/* Dropdown Menu - Simple version */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
