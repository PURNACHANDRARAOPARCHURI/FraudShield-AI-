from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import datetime

class TransactionCreate(BaseModel):
    # Required Inputs
    amount: float = Field(..., gt=0, description="Transaction Amount (must be > 0)")
    transaction_type: str = Field(..., description="TRANSFER, WITHDRAWAL, PAYMENT, DEPOSIT")
    sender_account: str = Field(..., min_length=4, description="Sender Account Number")
    receiver_account: str = Field(..., min_length=4, description="Receiver Account Number")
    transaction_time: str = Field(..., description="Timestamp format ISO or HH:MM:SS")

    # Optional Inputs
    device_id: Optional[str] = "DEV-MOBILE-9982"
    device_type: Optional[str] = "iOS Mobile App"
    ip_address: Optional[str] = "192.168.1.45"
    geo_location: Optional[str] = "Mumbai, IN"
    account_balance: Optional[float] = 25000.00
    merchant_name: Optional[str] = "Global Wire Services"
    description: Optional[str] = "Online transfer"

class AgentScores(BaseModel):
    behavior_score: float
    historical_score: float
    knowledge_score: float
    rule_score: float

class ComponentContributions(BaseModel):
    random_forest: float
    isolation_forest: float
    behavior_agent: float
    historical_agent: float
    knowledge_agent: float
    rule_engine: float

class LLMJudgeResult(BaseModel):
    hallucination_passed: bool
    reasoning_passed: bool
    evidence_passed: bool
    guardrail_passed: bool
    regulatory_passed: bool
    confidence_score: float
    final_verdict: str
    detailed_explanation: str

class TransactionResponse(BaseModel):
    transaction_id: str
    timestamp: str
    amount: float
    transaction_type: str
    sender_account: str
    receiver_account: str
    
    rf_score: float
    if_score: float
    agent_scores: AgentScores
    overall_risk_score: float
    component_contributions: ComponentContributions
    
    initial_threshold_decision: str # IMMEDIATE_APPROVE or LANGGRAPH_EVALUATION
    final_decision: str # APPROVED, REJECTED, OTP_REQUIRED, HUMAN_REVIEW
    
    otp_status: str
    human_review_status: str
    
    judge_result: LLMJudgeResult
    processing_time_ms: float

    class Config:
        from_attributes = True

class OtpVerificationRequest(BaseModel):
    transaction_id: str
    otp_code: str

class HumanReviewActionRequest(BaseModel):
    transaction_id: str
    action: str # APPROVE, REJECT, ESCALATE
    notes: Optional[str] = ""

class ThresholdUpdateRequest(BaseModel):
    initial_approval_threshold: float = Field(..., ge=0.0, le=1.0)
    high_risk_human_review_threshold: float = Field(..., ge=0.0, le=1.0)

class DashboardStats(BaseModel):
    total_transactions: int
    fraudulent_transactions: int
    approved_transactions: int
    otp_requests: int
    human_reviews: int
    avg_risk_score: float
    false_positives: int
    false_negatives: int
    model_accuracy: float
    
    risk_distribution: List[Dict[str, Any]]
    daily_trends: List[Dict[str, Any]]
    top_fraud_reasons: List[Dict[str, Any]]
    agent_contributions: Dict[str, float]
    
    current_thresholds: Dict[str, float]
    system_health: Dict[str, str]
