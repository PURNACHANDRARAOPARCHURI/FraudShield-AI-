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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
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
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                FraudShield<span className="text-cyan-500"> Engine</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 rounded-full uppercase">
                Telemetry v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Concurrent Heuristic & Statistical Anomaly Detection System
            </p>
          </div>
        </div>

        {/* Center Live System Status */}
        <div className="hidden lg:flex items-center space-x-6 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>FastAPI: Online</span>
          </div>
          <div className="w-px h-3 bg-slate-800"></div>
          <div className="flex items-center space-x-2 text-cyan-400 font-medium">
            <Cpu className="w-3.5 h-3.5" />
            <span>Pipeline: 4 Concurrent Engines Active</span>
          </div>
          <div className="w-px h-3 bg-slate-800"></div>
          <div className="flex items-center space-x-2 text-indigo-400 font-medium">
            <Database className="w-3.5 h-3.5" />
            <span>Vectorized Compliance Matrix</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`hidden md:flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/50'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Metrics</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Toggle Light/Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
