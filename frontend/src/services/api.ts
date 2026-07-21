import { TransactionInput, TransactionResponse, DashboardStats } from '../types';

const API_BASE = '/api/v1';

export async function predictTransaction(data: TransactionInput): Promise<TransactionResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Transaction prediction failed: ${res.statusText}`);
  }
  return res.json();
}

export async function verifyOtp(transactionId: string, otpCode: string): Promise<{ success: boolean; message: string; final_decision: string }> {
  const res = await fetch(`${API_BASE}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_id: transactionId, otp_code: otpCode }),
  });
  if (!res.ok) {
    throw new Error(`OTP Verification failed: ${res.statusText}`);
  }
  return res.json();
}

export async function submitHumanReview(transactionId: string, action: string, notes: string = ''): Promise<any> {
  const res = await fetch(`${API_BASE}/human-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_id: transactionId, action, notes }),
  });
  if (!res.ok) {
    throw new Error(`Human review action failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchDashboardMetrics(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard metrics: ${res.statusText}`);
  }
  return res.json();
}

export async function updateThresholds(initialThreshold: number, humanReviewThreshold: number): Promise<any> {
  const res = await fetch(`${API_BASE}/thresholds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      initial_approval_threshold: initialThreshold,
      high_risk_human_review_threshold: humanReviewThreshold,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update thresholds: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchTransactions(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/transactions`);
  if (!res.ok) {
    throw new Error(`Failed to fetch transactions list`);
  }
  return res.json();
}

export async function downloadPdfReport(transactionId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/generate-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_id: transactionId }),
  });
  if (!res.ok) {
    throw new Error(`Failed to generate PDF report`);
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FraudShield_Audit_Report_${transactionId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
