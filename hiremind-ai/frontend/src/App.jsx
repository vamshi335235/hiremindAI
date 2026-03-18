import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-blue-600 mb-4">HireMind AI</h1>
                    <p className="text-gray-600">Resume Analyzer & Interview Coach</p>
                    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
                        <p className="text-green-500 font-medium">Base Setup Complete!</p>
                        <p className="text-sm text-gray-500 mt-2">Frontend: Port 3000 | Backend: Port 5000</p>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
