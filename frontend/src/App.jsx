import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Navbar from './components/Navbar'; // Keep for public pages if needed
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import ResumeAnalysis from './pages/ResumeAnalysis';
import ATSAnalysis from './pages/ATSAnalysis';
import InterviewQuestions from './pages/InterviewQuestions';
import MockInterview from './pages/MockInterview';
import CareerRoadmap from './pages/CareerRoadmap';
import ResumeRewriter from './pages/ResumeRewriter';
import ResumeBuilder from './pages/ResumeBuilder';

import FeatureRedirect from './components/FeatureRedirect';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes wrapped in DashboardLayout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ResumeUpload />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Generic Feature Routes (Redirects to latest) */}
            <Route
              path="/ats-checker"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <FeatureRedirect feature="ats" />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview-questions"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <FeatureRedirect feature="interview" />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-interview"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <FeatureRedirect feature="mock-interview" />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/career-roadmap"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <FeatureRedirect feature="career" />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Specific Analysis Routes */}
            <Route
              path="/resume-builder"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ResumeBuilder />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume-rewriter"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ResumeRewriter />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ResumeAnalysis />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ats/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ATSAnalysis />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <InterviewQuestions />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-interview/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MockInterview />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/career/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CareerRoadmap />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
