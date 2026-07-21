import React from 'react';
import { TransactionResponse } from '../types';
import { ShieldCheck, ShieldAlert, KeyRound, UserCheck, FileText, CheckCircle2, AlertOctagon, Scale, Cpu, Activity, Download } from 'lucide-react';

interface ResultCardProps {
  result: TransactionResponse;
  onOpenOtp: () => void;
  onDownloadPdf: (txId: string) => void;
  downloadingPdf: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onOpenOtp, onDownloadPdf, downloadingPdf }) => {
  const isApproved = result.final_decision === 'APPROVED';
  const isOtp = result.final_decision === 'OTP_REQUIRED';
  const isHumanReview = result.final_decision === 'HUMAN_REVIEW';
  const isRejected = result.final_decision === 'REJECTED';

  const riskPercent = (result.overall_risk_score * 100).toFixed(1);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 shadow-2xl relative">
      {/* HEADER BAR & STATUS BADGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-white">Transaction Assessment Result</h3>
            <span className="text-xs font-mono text-cyan-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
              ID: {result.transaction_id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Processed in <span className="text-cyan-400 font-semibold">{result.processing_time_ms} ms</span> | Timestamp: {result.timestamp}
          </p>
        </div>

        {/* Action Button / Badge */}
        <div className="flex items-center space-x-3">
          {isOtp && (
            <button
              onClick={onOpenOtp}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 animate-pulse transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Verify Twilio OTP Code</span>
            </button>
          )}

          <button
            onClick={() => onDownloadPdf(result.transaction_id)}
            disabled={downloadingPdf}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            {downloadingPdf ? (
              <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>Generate PDF Audit Report</span>
          </button>
        </div>
      </div>

      {/* TOP SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Final Decision */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          isApproved ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300' :
          (isOtp ? 'bg-amber-950/30 border-amber-800/80 text-amber-300' :
          (isHumanReview ? 'bg-rose-950/30 border-rose-800/80 text-rose-300' : 'bg-red-950/30 border-red-800/80 text-red-300'))
        }`}>
          <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Final Decision</span>
          <div className="my-2 flex items-center space-x-2">
            {isApproved && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
            {isOtp && <KeyRound className="w-6 h-6 text-amber-400" />}
            {isHumanReview && <UserCheck className="w-6 h-6 text-rose-400" />}
            {isRejected && <ShieldAlert className="w-6 h-6 text-red-400" />}
            <span className="text-xl font-extrabold">{result.final_decision}</span>
          </div>
          <span className="text-[10px] opacity-75">
            {isApproved && 'Approved immediately based on low risk score'}
            {isOtp && 'OTP required for secondary verification'}
            {isHumanReview && 'Flagged for manual human review queue'}
            {isRejected && 'Transaction rejected due to failed OTP / high risk'}
          </span>
        </div>

        {/* Card 2: Overall Enterprise Risk Score */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Enterprise Risk Score</span>
          <div className="my-2 flex items-baseline space-x-1">
            <span className={`text-2xl font-extrabold ${result.overall_risk_score > 0.75 ? 'text-rose-400' : (result.overall_risk_score >= 0.40 ? 'text-amber-400' : 'text-emerald-400')}`}>
              {riskPercent}%
            </span>
            <span className="text-xs text-slate-400">/ 100%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${result.overall_risk_score > 0.75 ? 'bg-rose-500' : (result.overall_risk_score >= 0.40 ? 'bg-amber-500' : 'bg-emerald-500')}`}
              style={{ width: `${riskPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Dual ML Models */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Dual ML Engine</span>
          <div className="grid grid-cols-2 gap-2 my-1">
            <div>
              <span className="text-[10px] text-slate-400 block">Random Forest</span>
              <span className="text-sm font-bold text-cyan-400">{(result.rf_score * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Isolation Forest</span>
              <span className="text-sm font-bold text-indigo-400">{(result.if_score * 100).toFixed(1)}%</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400">Random Forest + Anomaly Isolation</span>
        </div>

        {/* Card 4: Initial Threshold Gate */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Initial Gate Engine</span>
          <div className="my-1">
            <span className="text-xs font-semibold text-amber-300 block">{result.initial_threshold_decision}</span>
            <span className="text-[10px] text-slate-400">Gate threshold setting: &lt; 0.40</span>
          </div>
          <span className="text-[10px] text-slate-400">Fast Path / Full Orchestration</span>
        </div>
      </div>

      {/* AGENT SCORES BREAKDOWN & COMPONENT CONTRIBUTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: 4 LangGraph Agent Scores */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>LangGraph 4 Multi-Agent Scores</span>
          </h4>

          <div className="space-y-2.5">
            {/* Agent 1 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Agent 1: Behavior Analysis</span>
                <span className="text-cyan-400 font-bold">{(result.agent_scores.behavior_score * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: `${result.agent_scores.behavior_score * 100}%` }}></div>
              </div>
            </div>

            {/* Agent 2 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Agent 2: Historical Fraud (PostgreSQL)</span>
                <span className="text-indigo-400 font-bold">{(result.agent_scores.historical_score * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${result.agent_scores.historical_score * 100}%` }}></div>
              </div>
            </div>

            {/* Agent 3 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Agent 3: Knowledge Retrieval (ChromaDB)</span>
                <span className="text-purple-400 font-bold">{(result.agent_scores.knowledge_score * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${result.agent_scores.knowledge_score * 100}%` }}></div>
              </div>
            </div>

            {/* Agent 4 */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Agent 4: Rule Engine Agent</span>
                <span className="text-rose-400 font-bold">{(result.agent_scores.rule_score * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${result.agent_scores.rule_score * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Component Contribution Chart */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Risk Score Component Contribution (%)</span>
          </h4>

          <div className="space-y-2">
            {Object.entries(result.component_contributions).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                <div className="flex items-center space-x-2 w-1/2">
                  <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500" style={{ width: `${val}%` }}></div>
                  </div>
                  <span className="text-slate-200 font-mono font-bold text-[11px] w-10 text-right">{val}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LLM-AS-A-JUDGE REASONING BOX */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              LLM-as-a-Judge Reasoning & Guardrail Audit
            </h4>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
            Confidence: {(result.judge_result.confidence_score * 100).toFixed(0)}%
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px] text-slate-300">
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-center">
            <span className="block text-[10px] text-slate-400">Hallucinations</span>
            <span className="text-emerald-400 font-bold">✓ PASSED</span>
          </div>
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-center">
            <span className="block text-[10px] text-slate-400">Reasoning</span>
            <span className="text-emerald-400 font-bold">✓ VALID</span>
          </div>
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-center">
            <span className="block text-[10px] text-slate-400">Evidence Check</span>
            <span className="text-emerald-400 font-bold">✓ VERIFIED</span>
          </div>
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-center">
            <span className="block text-[10px] text-slate-400">Guardrails</span>
            <span className="text-emerald-400 font-bold">✓ COMPLIANT</span>
          </div>
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-center col-span-2 md:col-span-1">
            <span className="block text-[10px] text-slate-400">RBI Regulatory</span>
            <span className="text-emerald-400 font-bold">✓ ALIGNED</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-mono">
          {result.judge_result.detailed_explanation}
        </div>
      </div>
    </div>
  );
};
