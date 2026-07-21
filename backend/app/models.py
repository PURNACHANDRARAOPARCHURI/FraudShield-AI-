import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, JSON, Integer, Boolean
from app.database import Base

class TransactionRecord(Base):
    __tablename__ = "transactions"

    id = Column(String(50), primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Required Inputs
    amount = Column(Float, nullable=False)
    transaction_type = Column(String(50), nullable=False)
    sender_account = Column(String(100), nullable=False, index=True)
    receiver_account = Column(String(100), nullable=False, index=True)
    transaction_time = Column(String(50), nullable=False)

    # Optional Inputs
    device_id = Column(String(100), nullable=True)
    device_type = Column(String(50), nullable=True)
    ip_address = Column(String(50), nullable=True)
    geo_location = Column(String(100), nullable=True)
    account_balance = Column(Float, nullable=True)
    merchant_name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    # ML & Agent Analysis Results
    rf_score = Column(Float, default=0.0)
    if_score = Column(Float, default=0.0)
    behavior_score = Column(Float, default=0.0)
    historical_score = Column(Float, default=0.0)
    knowledge_score = Column(Float, default=0.0)
    rule_score = Column(Float, default=0.0)
    
    overall_risk_score = Column(Float, default=0.0)
    initial_decision = Column(String(50), default="PENDING")
    final_decision = Column(String(50), default="APPROVED") # APPROVED, REJECTED, OTP_REQUIRED, HUMAN_REVIEW
    
    otp_status = Column(String(50), default="NOT_REQUIRED") # NOT_REQUIRED, SENT, VERIFIED, FAILED
    otp_code = Column(String(10), nullable=True)
    
    human_review_status = Column(String(50), default="NONE") # NONE, PENDING, APPROVED, REJECTED, ESCALATED
    human_reviewer_notes = Column(Text, nullable=True)
    
    # LLM-as-a-Judge Validation
    judge_hallucination_passed = Column(Boolean, default=True)
    judge_reasoning_passed = Column(Boolean, default=True)
    judge_guardrail_passed = Column(Boolean, default=True)
    judge_confidence = Column(Float, default=0.95)
    decision_reasoning = Column(Text, nullable=True)
    processing_time_ms = Column(Float, default=120.0)

class SystemThreshold(Base):
    __tablename__ = "system_thresholds"

    id = Column(Integer, primary_key=True, index=True)
    initial_approval_threshold = Column(Float, default=0.40)
    high_risk_human_review_threshold = Column(Float, default=0.75)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class HistoricalFraudLog(Base):
    __tablename__ = "historical_fraud_logs"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String(100), index=True)
    chargeback_count = Column(Integer, default=0)
    failed_otp_count = Column(Integer, default=0)
    previous_fraud_count = Column(Integer, default=0)
    risk_tag = Column(String(50), default="LOW")
