export interface TransactionInput {
  amount: number;
  transaction_type: string;
  sender_account: string;
  receiver_account: string;
  transaction_time: string;
  
  device_id?: string;
  device_type?: string;
  ip_address?: string;
  geo_location?: string;
  account_balance?: number;
  merchant_name?: string;
  description?: string;
}

export interface AgentScores {
  behavior_score: number;
  historical_score: number;
  knowledge_score: number;
  rule_score: number;
}

export interface ComponentContributions {
  random_forest: number;
  isolation_forest: number;
  behavior_agent: number;
  historical_agent: number;
  knowledge_agent: number;
  rule_engine: number;
}

export interface LLMJudgeResult {
  hallucination_passed: boolean;
  reasoning_passed: boolean;
  evidence_passed: boolean;
  guardrail_passed: boolean;
  regulatory_passed: boolean;
  confidence_score: number;
  final_verdict: string;
  detailed_explanation: string;
}

export interface TransactionResponse {
  transaction_id: string;
  timestamp: string;
  amount: number;
  transaction_type: string;
  sender_account: string;
  receiver_account: string;
  
  rf_score: number;
  if_score: number;
  agent_scores: AgentScores;
  overall_risk_score: number;
  component_contributions: ComponentContributions;
  
  initial_threshold_decision: 'IMMEDIATE_APPROVE' | 'LANGGRAPH_EVALUATION' | string;
  final_decision: 'APPROVED' | 'REJECTED' | 'OTP_REQUIRED' | 'HUMAN_REVIEW';
  
  otp_status: string;
  human_review_status: string;
  
  judge_result: LLMJudgeResult;
  processing_time_ms: number;
}

export interface DashboardStats {
  total_transactions: number;
  fraudulent_transactions: number;
  approved_transactions: number;
  otp_requests: number;
  human_reviews: number;
  avg_risk_score: number;
  false_positives: number;
  false_negatives: number;
  model_accuracy: number;
  
  risk_distribution: Array<{ range: string; count: number }>;
  daily_trends: Array<{ date: string; total: number; fraud: number; otp: number }>;
  top_fraud_reasons: Array<{ reason: string; percentage: number }>;
  agent_contributions: Record<string, number>;
  
  current_thresholds: {
    initial_approval_threshold: number;
    high_risk_human_review_threshold: number;
  };
  system_health: Record<string, string>;
}
