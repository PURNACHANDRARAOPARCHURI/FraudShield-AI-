import React, { useState } from 'react';
import { UserCheck, ShieldAlert, CheckCircle2, XCircle, ArrowUpRight, FileText, Search, Filter } from 'lucide-react';
import { submitHumanReview } from '../services/api';

interface HumanReviewConsoleProps {
  transactions: any[];
  onRefresh: () => void;
}

export const HumanReviewConsole: React.FC<HumanReviewConsoleProps> = ({ transactions, onRefresh }) => {
  const [selectedTx, setSelectedTx] = useState<any>(transactions[0] || null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const flagged = transactions.filter(t => t.final_decision === 'HUMAN_REVIEW' || t.human_review_status === 'PENDING');

  const handleAction = async (action: 'APPROVE' | 'REJECT' | 'ESCALATE') => {
    if (!selectedTx) return;
    setLoading(true);
    try {
      await submitHumanReview(selectedTx.transaction_id, action, notes);
      setMsg(`Transaction ${selectedTx.transaction_id} successfully ${action}D.`);
      setNotes('');
      onRefresh();
    } catch (err: any) {
      setMsg(`Action failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-rose-500 dark:text-rose-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Human Review Security Triage</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manual triage queue for transactions exceeding High Risk Threshold (&gt; 0.75).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 text-xs font-bold rounded-full">
            {flagged.length} Pending Review(s)
          </span>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-800 dark:text-cyan-300 font-medium">
          {msg}
        </div>
      )}

      {flagged.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Triage Queue Clear!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zero pending high-risk transactions requiring manual intervention.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LIST OF FLAGGED TRANSACTIONS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Flagged Queue</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {flagged.map((tx) => (
                <div
                  key={tx.transaction_id}
                  onClick={() => setSelectedTx(tx)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTx?.transaction_id === tx.transaction_id
                      ? 'bg-white dark:bg-slate-900 border-rose-500/80 shadow-lg shadow-rose-500/10'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{tx.transaction_id}</span>
                    <span className="text-rose-500 dark:text-rose-400 font-bold">{(tx.overall_risk_score * 100).toFixed(0)}% Risk</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>${tx.amount?.toLocaleString()}</span>
                    <span>{tx.transaction_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAILED INSPECTION & ACTION PANEL */}
          {selectedTx && (
            <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Transaction Detail Audit</h4>
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">{selectedTx.transaction_id}</span>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                  Risk Score: {(selectedTx.overall_risk_score * 100).toFixed(1)}%
                </span>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Amount</span>
                  <span className="font-bold text-slate-900 dark:text-white">${selectedTx.amount?.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Sender Account</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">{selectedTx.sender_account}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Receiver Account</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200">{selectedTx.receiver_account}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Timestamp</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedTx.timestamp}</span>
                </div>
              </div>

              {/* Security Reviewer Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Security Analyst & Triage Audit Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter manual compliance notes or rationale..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => handleAction('APPROVE')}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Manual Approve</span>
                </button>

                <button
                  onClick={() => handleAction('REJECT')}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Transaction</span>
                </button>

                <button
                  onClick={() => handleAction('ESCALATE')}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 flex items-center justify-center space-x-1"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Escalate to Compliance</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
