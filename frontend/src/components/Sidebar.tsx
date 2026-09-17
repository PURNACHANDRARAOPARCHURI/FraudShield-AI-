import React from 'react';
import { 
  Send, Network, AlertTriangle, LayoutDashboard, Sliders, FileText, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  pendingReviewCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, collapsed, setCollapsed, pendingReviewCount
}) => {
  const navItems = [
    { id: 'analyze', label: 'Transaction Telemetry', icon: Send, badge: null },
    { id: 'workflow', label: 'Inspection Pipeline', icon: Network, badge: '4 Engines' },
    { id: 'human-review', label: 'Security Triage Queue', icon: AlertTriangle, badge: pendingReviewCount > 0 ? pendingReviewCount : null },
    { id: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'thresholds', label: 'Threshold Policies', icon: Sliders, badge: null },
  ];

  return (
    <aside className={`relative flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-30 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-800/80">
        {!collapsed && <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Navigation</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition-colors mx-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`} />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.id === 'human-review' 
                        ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User info */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl glass-card border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-cyan-500/20">
            PC
          </div>
          <div className="flex-1 truncate">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Purna Chandra Rao</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">purnap909@gmail.com</p>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-medium truncate">+91 6304990878</p>
          </div>
        </div>
      )}
    </aside>
  );
};
