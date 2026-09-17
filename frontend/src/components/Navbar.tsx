import React from 'react';
import { ShieldCheck, Cpu, Database, Sun, Moon, Bell, Activity } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Left Branding */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('analyze')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-cyan-600 dark:from-white dark:via-slate-200 dark:to-cyan-400 bg-clip-text text-transparent">
                FraudShield<span className="text-cyan-500"> Engine</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/60 rounded-full uppercase">
                Telemetry v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Concurrent Heuristic & Statistical Anomaly Detection System
            </p>
          </div>
        </div>

        {/* Center Live System Status */}
        <div className="hidden lg:flex items-center space-x-6 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>FastAPI: Online</span>
          </div>
          <div className="w-px h-3 bg-slate-300 dark:bg-slate-800"></div>
          <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-medium">
            <Cpu className="w-3.5 h-3.5" />
            <span>Pipeline: 4 Concurrent Engines Active</span>
          </div>
          <div className="w-px h-3 bg-slate-300 dark:bg-slate-800"></div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-medium">
            <Database className="w-3.5 h-3.5" />
            <span>Vectorized Compliance Matrix</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Developer Contact Pill */}
          <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Purna Chandra Rao</span>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <a href="tel:6304990878" className="text-cyan-600 dark:text-cyan-400 font-mono font-medium hover:underline">6304990878</a>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`hidden md:flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/50'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            <span>Live Metrics</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:border-slate-800"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
