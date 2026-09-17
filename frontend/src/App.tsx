import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TransactionForm } from './components/TransactionForm';
import { WorkflowVisualizer } from './components/WorkflowVisualizer';
import { ResultCard } from './components/ResultCard';
import { OtpModal } from './components/OtpModal';
import { HumanReviewConsole } from './components/HumanReviewConsole';
import { AdminDashboard } from './components/AdminDashboard';
import { TransactionInput, TransactionResponse, DashboardStats } from './types';
import { predictTransaction, fetchDashboardMetrics, fetchTransactions, downloadPdfReport } from './services/api';
import { ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('analyze');
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<TransactionResponse | null>(null);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);

  // Notification banner state
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      const stats = await fetchDashboardMetrics();
      setDashboardStats(stats);
      const txs = await fetchTransactions();
      setAllTransactions(txs);
    } catch (err) {
      console.warn("API loading fallback:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTransactionSubmit = async (data: TransactionInput) => {
    setLoading(true);
    setCurrentResult(null);
    setToastMsg(null);

    try {
      const response = await predictTransaction(data);
      setCurrentResult(response);
      
      if (response.final_decision === 'OTP_REQUIRED') {
        setShowOtpModal(true);
        setToastMsg({ type: 'info', text: 'Composite risk score mandates secondary 2FA cryptographic verification.' });
      } else if (response.final_decision === 'HUMAN_REVIEW') {
        setToastMsg({ type: 'error', text: 'High Risk Score (> 0.75)! Dispatched to Security Triage Queue.' });
      } else {
        setToastMsg({ type: 'success', text: 'Transaction Cleared successfully with baseline risk score.' });
      }

      loadData();
    } catch (err: any) {
      setToastMsg({ type: 'error', text: err.message || 'Error executing quantitative risk evaluation pipeline.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (txId: string) => {
    setDownloadingPdf(true);
    try {
      await downloadPdfReport(txId);
    } catch (err: any) {
      setToastMsg({ type: 'error', text: `PDF Download failed: ${err.message}` });
    } finally {
      setDownloadingPdf(false);
    }
  };

  const pendingReviewCount = allTransactions.filter(
    t => t.final_decision === 'HUMAN_REVIEW' || t.human_review_status === 'PENDING'
  ).length;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          pendingReviewCount={pendingReviewCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* TOAST BANNER */}
          {toastMsg && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-xl animate-fadeIn ${
              toastMsg.type === 'success' ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' :
              (toastMsg.type === 'info' ? 'bg-amber-950/80 border-amber-800 text-amber-300' : 'bg-rose-950/80 border-rose-800 text-rose-300')
            }`}>
              <div className="flex items-center space-x-3 text-xs font-semibold">
                {toastMsg.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toastMsg.type === 'info' && <Sparkles className="w-5 h-5 text-amber-400" />}
                {toastMsg.type === 'error' && <ShieldAlert className="w-5 h-5 text-rose-400" />}
                <span>{toastMsg.text}</span>
              </div>
              <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white text-xs font-mono">Dismiss</button>
            </div>
          )}

          {/* TAB 1: TRANSACTION ANALYZER */}
          {activeTab === 'analyze' && (
            <div className="space-y-8">
              <TransactionForm onSubmit={handleTransactionSubmit} loading={loading} />
              
              {/* Animated LangGraph Workflow Visualizer */}
              <WorkflowVisualizer response={currentResult} loading={loading} />

              {/* Assessment Result Card */}
              {currentResult && (
                <ResultCard
                  result={currentResult}
                  onOpenOtp={() => setShowOtpModal(true)}
                  onDownloadPdf={handleDownloadPdf}
                  downloadingPdf={downloadingPdf}
                />
              )}
            </div>
          )}

          {/* TAB 2: LANGGRAPH WORKFLOW VISUALIZER ALONE */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <WorkflowVisualizer response={currentResult} loading={loading} />
              {currentResult && (
                <ResultCard
                  result={currentResult}
                  onOpenOtp={() => setShowOtpModal(true)}
                  onDownloadPdf={handleDownloadPdf}
                  downloadingPdf={downloadingPdf}
                />
              )}
            </div>
          )}

          {/* TAB 3: HUMAN REVIEW TRIAGE QUEUE */}
          {activeTab === 'human-review' && (
            <HumanReviewConsole transactions={allTransactions} onRefresh={loadData} />
          )}

          {/* TAB 4: ADMIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <AdminDashboard stats={dashboardStats} onRefresh={loadData} />
          )}

          {/* TAB 5: THRESHOLD POLICIES */}
          {activeTab === 'thresholds' && (
            <AdminDashboard stats={dashboardStats} onRefresh={loadData} />
          )}
        </main>
      </div>

      {/* OTP MODAL SCREEN */}
      {showOtpModal && currentResult && (
        <OtpModal
          transactionId={currentResult.transaction_id}
          senderAccount={currentResult.sender_account}
          onClose={() => setShowOtpModal(false)}
          onSuccess={(msg) => {
            setShowOtpModal(false);
            setCurrentResult({ ...currentResult, final_decision: 'APPROVED', otp_status: 'VERIFIED' });
            setToastMsg({ type: 'success', text: msg });
            loadData();
          }}
          onFailure={(msg) => {
            setShowOtpModal(false);
            setCurrentResult({ ...currentResult, final_decision: 'REJECTED', otp_status: 'FAILED' });
            setToastMsg({ type: 'error', text: msg });
            loadData();
          }}
        />
      )}
    </div>
  );
}

export default App;
