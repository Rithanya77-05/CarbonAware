import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Challenges from './pages/Challenges';
import EcoBot from './components/EcoBot';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/challenges" element={<Challenges />} />
        </Routes>
      </main>
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">CarbonAware</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Awareness Today. Sustainability Tomorrow.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">© {new Date().getFullYear()} CarbonAware. All rights reserved.</p>
        </div>
      </footer>
      {/* EcoBot floats on every page */}
      <EcoBot />
    </div>
  );
}

export default App;
