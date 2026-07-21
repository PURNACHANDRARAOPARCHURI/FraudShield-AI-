import React, { useState } from 'react';
import { DashboardStats } from '../types';
import { 
  BarChart3, Activity, ShieldAlert, CheckCircle2, KeyRound, UserCheck, Sliders, Save, Cpu, Database, Server, RefreshCw, Sparkles 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { updateThresholds } from '../services/api';

interface AdminDashboardProps {
  stats: DashboardStats | null;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, onRefresh }) => {
  if (!stats) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-slate-300">Loading Enterprise Analytics Dashboard...</p>
      </div>
    );
  }

  // Threshold form state
  const [initThresh, setInitThresh] = useState<number>(stats.current_thresholds.initial_approval_threshold);
  const [highThresh, setHighThresh] = useState<number>(stats.current_thresholds.high_risk_human_review_threshold);
  const [savingThresh, setSavingThresh] = useState<boolean>(false);
  const [saveMsg, setSaveMsg] = useState<string>('');

  const handleSaveThresholds = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingThresh(true);
    setSaveMsg('');
    try {
      await updateThresholds(initThresh, highThresh);
      setSaveMsg('Threshold configuration saved successfully!');
      onRefresh();
    } catch (err: any) {
      setSaveMsg(`Failed: ${err.message}`);
    } finally {
      setSavingThresh(false);
    }
  };

  const COLORS = ['#0284c7', '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#eab308'];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Enterprise AI Fraud Analytics & Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring, AI agent contributions, and threshold control configuration.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold rounded-xl transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI METRICS GRID (8 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-xl glass-card border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Processed</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{stats.total_transactions.toLocaleString()}</span>
          <span className="text-[10px] text-cyan-400 mt-1 block">Live API Stream</span>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl glass-card border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Fraudulent Flagged</span>
          <span className="text-2xl font-extrabold text-rose-400 mt-1 block">{stats.fraudulent_transactions}</span>
          <span className="text-[10px] text-rose-400 mt-1 block">{((stats.fraudulent_transactions / (stats.total_transactions || 1)) * 100).toFixed(1)}% Fraud Rate</span>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl glass-card border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Approved Instantly</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{stats.approved_transactions}</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Low Risk Clean Clear</span>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl glass-card border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">OTP Requests</span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block">{stats.otp_requests}</span>
          <span className="text-[10px] text-amber-400 mt-1 block">Twilio 2FA Challenged</span>
        </div>

        {/* Card 5 */}
        <div className="p-4 rounded-xl glass-card border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Human Reviews</span>
          <span className="text-2xl font-extrabold text-indigo-400 mt-1 block">{stats.human_reviews}</span>
          <span className="text-[10px] text-indigo-400 mt-1 block">Manual Security Queue</span>
        </div>

        {/* Card 6 */}
        <div className="p-4 rounded-xl glass-card border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Model Accuracy</span>
          <span className="text-2xl font-extrabold text-cyan-400 mt-1 block">{stats.model_accuracy}%</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Random Forest + Isolation</span>
        </div>

        {/* Card 7 */}
        <div className="p-4 rounded-xl glass-card border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">False Positives</span>
          <span className="text-2xl font-extrabold text-slate-200 mt-1 block">{stats.false_positives}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">&lt; 0.5% Target Rate</span>
        </div>

        {/* Card 8 */}
        <div className="p-4 rounded-xl glass-card border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Risk Score</span>
          <span className="text-2xl font-extrabold text-purple-400 mt-1 block">{(stats.avg_risk_score * 100).toFixed(1)}%</span>
          <span className="text-[10px] text-purple-400 mt-1 block">Enterprise Baseline</span>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Transaction Trends */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Daily Transaction Volume & Fraud Trends</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.daily_trends}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="total" stroke="#0284c7" fillOpacity={1} fill="url(#totalGrad)" name="Total Vol" />
                <Area type="monotone" dataKey="fraud" stroke="#f43f5e" fillOpacity={1} fill="url(#fraudGrad)" name="Fraud" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Risk Score Distribution */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Risk Score Distribution Histogram</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.risk_distribution}>
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]}>
                  {stats.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index > 2 ? '#f43f5e' : (index === 2 ? '#eab308' : '#0284c7')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: THRESHOLD CONFIGURATION & SYSTEM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* THRESHOLD CONFIGURATION PANEL (Interactive Sliders) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Dynamic Threshold Configuration Panel</h3>
            </div>
            <span className="text-xs text-slate-400">Policy Engine Settings</span>
          </div>

          <form onSubmit={handleSaveThresholds} className="space-y-6">
            {/* Slider 1: Initial Approval Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">
                  Initial Fast-Path Approval Threshold
                </label>
                <span className="font-mono font-bold text-cyan-400 text-sm">{initThresh.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.60"
                step="0.05"
                value={initThresh}
                onChange={(e) => setInitThresh(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-[11px] text-slate-400">
                Transactions with risk below <span className="text-cyan-400 font-bold">{initThresh.toFixed(2)}</span> skip LangGraph and approve immediately.
              </p>
            </div>

            {/* Slider 2: High Risk Human Review Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-200">
                  High-Risk Human Review Triage Threshold
                </label>
                <span className="font-mono font-bold text-rose-400 text-sm">{highThresh.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.60"
                max="0.95"
                step="0.05"
                value={highThresh}
                onChange={(e) => setHighThresh(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <p className="text-[11px] text-slate-400">
                Transactions with risk above <span className="text-rose-400 font-bold">{highThresh.toFixed(2)}</span> are dispatched directly to the Human Review Console.
              </p>
            </div>

            {saveMsg && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-xs text-cyan-300">
                {saveMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={savingThresh}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Threshold Policy</span>
            </button>
          </form>
        </div>

        {/* SYSTEM HEALTH CARDS */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
            <Server className="w-4 h-4" />
            <span>Infrastructure Health Status</span>
          </h3>

          <div className="space-y-3 text-xs">
            {Object.entries(stats.system_health).map(([service, healthStr]) => (
              <div key={service} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 capitalize font-medium">{service.replace('_', ' ')}</span>
                <span className="text-emerald-400 font-mono font-bold text-[11px]">{healthStr}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
