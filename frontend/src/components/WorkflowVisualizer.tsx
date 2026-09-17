import React from 'react';
import { TransactionResponse } from '../types';
import { Network, Cpu, Database, CheckCircle2, ShieldAlert, KeyRound, UserCheck, Scale, ArrowRight, Activity, Zap } from 'lucide-react';

interface WorkflowVisualizerProps {
  response: TransactionResponse | null;
  loading: boolean;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ response, loading }) => {
  const isEvaluated = !!response;
  const isFastPath = response?.initial_threshold_decision === 'IMMEDIATE_APPROVE';

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Concurrent Multi-Stage Heuristic Inspection Graph</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-ping' : (isEvaluated ? 'bg-emerald-400' : 'bg-slate-600')}`}></span>
          <span className="text-slate-400">{loading ? 'PIPELINE EXECUTING...' : (isEvaluated ? 'EXECUTION COMPLETE' : 'STANDBY MODE')}</span>
        </div>
      </div>

      {/* NODE GRAPH CANVAS */}
      <div className="mt-6 space-y-6">
        {/* ROW 1: INPUT -> ML LAYER -> INITIAL THRESHOLD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Step 1: Input */}
          <div className={`p-4 rounded-xl border transition-all ${loading ? 'border-cyan-500/50 bg-cyan-950/20' : 'border-slate-800 bg-slate-900/60'}`}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold text-cyan-400 uppercase tracking-wider">Step 1 & 2</span>
              <span>Feature Normalization</span>
            </div>
            <h4 className="text-sm font-semibold text-white">Transaction Telemetry Input</h4>
            <p className="text-[11px] text-slate-400 mt-1">5 Mandatory + 7 Contextual features normalized into 7D metric vector</p>
          </div>

          {/* Step 2: Dual Statistical Models */}
          <div className={`p-4 rounded-xl border transition-all ${isEvaluated ? 'border-cyan-500/80 bg-slate-900 shadow-lg shadow-cyan-500/10' : 'border-slate-800 bg-slate-900/60'}`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-indigo-400 uppercase tracking-wider">Step 3: Statistical Layer</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Random Forest (P(Fraud))</span>
                <span className="text-xs font-bold text-cyan-400">{isEvaluated ? (response.rf_score * 100).toFixed(1) + '%' : '--'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Isolation Forest (Outlier)</span>
                <span className="text-xs font-bold text-indigo-400">{isEvaluated ? (response.if_score * 100).toFixed(1) + '%' : '--'}</span>
              </div>
            </div>
          </div>

          {/* Step 3: Initial Threshold Gate */}
          <div className={`p-4 rounded-xl border transition-all ${isFastPath ? 'border-emerald-500 bg-emerald-950/20' : 'border-amber-500/60 bg-slate-900/60'}`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-amber-400 uppercase tracking-wider">Step 4: Initial Gate</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-xs font-semibold text-white">Threshold Engine (&lt; 0.40)</h4>
            <p className="text-[11px] text-slate-300 mt-1">
              {isFastPath ? '⚡ Fast Path: Risk < 0.40 (Instant Clearance)' : '⚠️ Risk \u2265 0.40: Dispatched to Multi-Stage Inspection Graph'}
            </p>
          </div>
        </div>

        {/* ROW 2: CONCURRENT 4 SUBSYSTEMS CONTAINER */}
        <div className={`p-5 rounded-2xl border transition-all ${loading ? 'border-cyan-500 bg-cyan-950/10 animate-pulse' : 'border-slate-800 bg-slate-950/60'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 rounded-full">
                PARALLEL PIPELINE
              </span>
              <h4 className="text-sm font-bold text-white">Concurrent Heuristic Inspection Graph</h4>
            </div>
            <span className="text-xs text-slate-400 font-mono">4 Subsystems</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Subsystem 1 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-cyan-400">Subsystem 1</span>
                <span className="text-xs font-bold text-white">{isEvaluated ? (response.agent_scores.behavior_score * 100).toFixed(0) + '%' : '--'}</span>
              </div>
              <h5 className="text-xs font-semibold text-slate-200">Behavioral Telemetry</h5>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">Velocity metrics, hardware fingerprint, geo shift</p>
            </div>

            {/* Subsystem 2 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-indigo-400">Subsystem 2</span>
                <span className="text-xs font-bold text-white">{isEvaluated ? (response.agent_scores.historical_score * 100).toFixed(0) + '%' : '--'}</span>
              </div>
              <h5 className="text-xs font-semibold text-slate-200">Historical Ledger</h5>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">PostgreSQL chargeback ledger & failed auth history</p>
            </div>

            {/* Subsystem 3 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-purple-400">Subsystem 3</span>
                <span className="text-xs font-bold text-white">{isEvaluated ? (response.agent_scores.knowledge_score * 100).toFixed(0) + '%' : '--'}</span>
              </div>
              <h5 className="text-xs font-semibold text-slate-200">Compliance Matrix</h5>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">Vectorized compliance search on RBI & AML rules</p>
            </div>

            {/* Subsystem 4 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-rose-400">Subsystem 4</span>
                <span className="text-xs font-bold text-white">{isEvaluated ? (response.agent_scores.rule_score * 100).toFixed(0) + '%' : '--'}</span>
              </div>
              <h5 className="text-xs font-semibold text-slate-200">Boundary Constraints</h5>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">$10k limit cap, midnight transfer, foreign IP</p>
            </div>
          </div>
        </div>

        {/* ROW 3: RISK AGGREGATOR -> DECISION VALIDATOR -> DECISION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Aggregator */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold text-cyan-400 uppercase tracking-wider">Step 9: Risk Matrix</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-xs font-semibold text-white">Weighted Factor Matrix</h4>
            <div className="mt-2 text-center py-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block">Composite Risk Score</span>
              <span className="text-lg font-extrabold text-cyan-400">{isEvaluated ? (response.overall_risk_score * 100).toFixed(1) + '%' : '--'}</span>
            </div>
          </div>

          {/* Decision Validator */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold text-purple-400 uppercase tracking-wider">Step 11: Decision Validator</span>
              <Scale className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-xs font-semibold text-white">Invariance & Constraint Audit</h4>
            <p className="text-[11px] text-emerald-400 mt-2 font-medium">
              {isEvaluated ? `\u2713 Confidence ${(response.judge_result.confidence_score * 100).toFixed(0)}% (Passed 5 Audit Checks)` : 'Standby for verdict'}
            </p>
          </div>

          {/* Final Action Gate */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between ${
            response?.final_decision === 'APPROVED' ? 'border-emerald-500/80 bg-emerald-950/20' :
            (response?.final_decision === 'OTP_REQUIRED' ? 'border-amber-500/80 bg-amber-950/20' :
            (response?.final_decision === 'HUMAN_REVIEW' ? 'border-rose-500/80 bg-rose-950/20' : 'border-slate-800 bg-slate-900'))
          }`}>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Step 12: Action Gate</span>
            <div className="my-2">
              <span className="text-xs text-slate-400 block">Final Action</span>
              <span className="text-base font-extrabold text-white">
                {response ? response.final_decision : 'PENDING'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {response?.final_decision === 'APPROVED' && 'Risk < 0.40 -> Cleared'}
              {response?.final_decision === 'OTP_REQUIRED' && '0.40 - 0.75 -> Secondary 2FA Challenge'}
              {response?.final_decision === 'HUMAN_REVIEW' && 'Risk > 0.75 -> Security Triage Queue'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
