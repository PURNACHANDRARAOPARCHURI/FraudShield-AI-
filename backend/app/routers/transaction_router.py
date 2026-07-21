import time
import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas import (
    TransactionCreate, TransactionResponse, AgentScores, ComponentContributions,
    LLMJudgeResult, OtpVerificationRequest, HumanReviewActionRequest
)
from app.models import TransactionRecord, SystemThreshold
from app.ml_engine import ml_engine
from app.langgraph_agents import langgraph_orchestrator
from app.llm_judge import llm_judge
from app.otp_service import otp_service

router = APIRouter(prefix="/api/v1", tags=["Transactions"])

def get_current_thresholds(db: Session):
    record = db.query(SystemThreshold).first()
    if not record:
        record = SystemThreshold(
            initial_approval_threshold=settings.INITIAL_APPROVAL_THRESHOLD,
            high_risk_human_review_threshold=settings.HIGH_RISK_HUMAN_REVIEW_THRESHOLD
        )
        db.add(record)
        db.commit()
        db.refresh(record)
    return record.initial_approval_threshold, record.high_risk_human_review_threshold

@router.post("/predict", response_model=TransactionResponse)
async def process_transaction(tx_in: TransactionCreate, db: Session = Depends(get_db)):
    start_time = time.time()
    tx_id = f"TXN-{uuid.uuid4().hex[:8].upper()}"

    tx_dict = tx_in.dict()

    # Step 1 & 2: Feature Engineering & Dual ML Models
    rf_score, if_score = ml_engine.predict(tx_dict)

    # Step 3 & 4: Initial Threshold Engine Evaluation
    init_thresh, high_thresh = get_current_thresholds(db)

    # Quick approval path if both RF and IF scores are low
    initial_decision = "PENDING"
    if rf_score < init_thresh and if_score < init_thresh:
        initial_decision = "IMMEDIATE_APPROVE"
        final_decision = "APPROVED"
        otp_status = "NOT_REQUIRED"
        human_status = "NONE"
        overall_risk = round((rf_score + if_score) / 2.0, 4)
        
        agent_scores = AgentScores(behavior_score=0.10, historical_score=0.05, knowledge_score=0.15, rule_score=0.05)
        contributions = ComponentContributions(
            random_forest=50.0, isolation_forest=50.0, behavior_agent=0.0,
            historical_agent=0.0, knowledge_agent=0.0, rule_engine=0.0
        )
        judge_res = LLMJudgeResult(
            hallucination_passed=True, reasoning_passed=True, evidence_passed=True,
            guardrail_passed=True, regulatory_passed=True, confidence_score=0.98,
            final_verdict="APPROVED", detailed_explanation="Fast-path clear: Risk scores below initial threshold gate (0.40). Immediate approval granted."
        )
    else:
        initial_decision = "LANGGRAPH_EVALUATION"

        # Step 5: Execute LangGraph Orchestrator with 4 Parallel Agents
        lg_result = await langgraph_orchestrator.run_parallel_agents(tx_dict, rf_score, if_score, db)
        
        overall_risk = lg_result["overall_risk_score"]
        agent_scores_dict = lg_result["agent_scores"]
        agent_notes_dict = lg_result["agent_notes"]
        contributions_dict = lg_result["component_contributions"]

        agent_scores = AgentScores(**agent_scores_dict)
        contributions = ComponentContributions(**contributions_dict)

        # Step 6: Decision Engine Logic
        if overall_risk > high_thresh:
            final_decision = "HUMAN_REVIEW"
            otp_status = "NOT_REQUIRED"
            human_status = "PENDING"
        elif overall_risk >= init_thresh:
            final_decision = "OTP_REQUIRED"
            otp_code = otp_service.generate_and_send_otp(tx_id, tx_in.sender_account)
            otp_status = "SENT"
            human_status = "NONE"
        else:
            final_decision = "APPROVED"
            otp_status = "NOT_REQUIRED"
            human_status = "NONE"

        # Step 7: LLM-as-a-Judge Evaluation
        judge_eval = await llm_judge.evaluate_decision(
            tx_dict, rf_score, if_score, overall_risk,
            agent_scores_dict, agent_notes_dict, final_decision
        )
        
        judge_res = LLMJudgeResult(**judge_eval)

    elapsed_ms = round((time.time() - start_time) * 1000, 2)

    # Save to DB
    db_record = TransactionRecord(
        id=tx_id,
        created_at=datetime.datetime.utcnow(),
        amount=tx_in.amount,
        transaction_type=tx_in.transaction_type,
        sender_account=tx_in.sender_account,
        receiver_account=tx_in.receiver_account,
        transaction_time=tx_in.transaction_time,
        device_id=tx_in.device_id,
        device_type=tx_in.device_type,
        ip_address=tx_in.ip_address,
        geo_location=tx_in.geo_location,
        account_balance=tx_in.account_balance,
        merchant_name=tx_in.merchant_name,
        description=tx_in.description,
        rf_score=rf_score,
        if_score=if_score,
        behavior_score=agent_scores.behavior_score,
        historical_score=agent_scores.historical_score,
        knowledge_score=agent_scores.knowledge_score,
        rule_score=agent_scores.rule_score,
        overall_risk_score=overall_risk,
        initial_decision=initial_decision,
        final_decision=final_decision,
        otp_status=otp_status,
        human_review_status=human_status,
        judge_hallucination_passed=judge_res.hallucination_passed,
        judge_reasoning_passed=judge_res.reasoning_passed,
        judge_guardrail_passed=judge_res.guardrail_passed,
        judge_confidence=judge_res.confidence_score,
        decision_reasoning=judge_res.detailed_explanation,
        processing_time_ms=elapsed_ms
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return TransactionResponse(
        transaction_id=tx_id,
        timestamp=db_record.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        amount=tx_in.amount,
        transaction_type=tx_in.transaction_type,
        sender_account=tx_in.sender_account,
        receiver_account=tx_in.receiver_account,
        rf_score=rf_score,
        if_score=if_score,
        agent_scores=agent_scores,
        overall_risk_score=overall_risk,
        component_contributions=contributions,
        initial_threshold_decision=initial_decision,
        final_decision=final_decision,
        otp_status=otp_status,
        human_review_status=human_status,
        judge_result=judge_res,
        processing_time_ms=elapsed_ms
    )

@router.post("/verify-otp")
def verify_otp_endpoint(req: OtpVerificationRequest, db: Session = Depends(get_db)):
    tx = db.query(TransactionRecord).filter(TransactionRecord.id == req.transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    is_valid = otp_service.verify_otp(req.transaction_id, req.otp_code)
    if is_valid:
        tx.otp_status = "VERIFIED"
        tx.final_decision = "APPROVED"
        db.commit()
        return {"success": True, "message": "OTP Verified Successfully. Transaction Approved!", "final_decision": "APPROVED"}
    else:
        tx.otp_status = "FAILED"
        tx.final_decision = "REJECTED"
        db.commit()
        return {"success": False, "message": "Invalid OTP Code. Transaction Flagged & Rejected.", "final_decision": "REJECTED"}

@router.post("/human-review")
def human_review_endpoint(req: HumanReviewActionRequest, db: Session = Depends(get_db)):
    tx = db.query(TransactionRecord).filter(TransactionRecord.id == req.transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    act = req.action.upper()
    if act == "APPROVE":
        tx.human_review_status = "APPROVED"
        tx.final_decision = "APPROVED"
    elif act == "REJECT":
        tx.human_review_status = "REJECTED"
        tx.final_decision = "REJECTED"
    elif act == "ESCALATE":
        tx.human_review_status = "ESCALATED"
        tx.final_decision = "HUMAN_REVIEW"

    tx.human_reviewer_notes = req.notes
    db.commit()
    return {"success": True, "transaction_id": tx.id, "final_decision": tx.final_decision, "human_review_status": tx.human_review_status}

@router.get("/transactions")
def list_transactions(limit: int = 50, db: Session = Depends(get_db)):
    records = db.query(TransactionRecord).order_by(TransactionRecord.created_at.desc()).limit(limit).all()
    results = []
    for r in records:
        results.append({
            "transaction_id": r.id,
            "timestamp": r.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "amount": r.amount,
            "transaction_type": r.transaction_type,
            "sender_account": r.sender_account,
            "receiver_account": r.receiver_account,
            "overall_risk_score": r.overall_risk_score,
            "rf_score": r.rf_score,
            "if_score": r.if_score,
            "final_decision": r.final_decision,
            "otp_status": r.otp_status,
            "human_review_status": r.human_review_status,
            "processing_time_ms": r.processing_time_ms
        })
    return results
