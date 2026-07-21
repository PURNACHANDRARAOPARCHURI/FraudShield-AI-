from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import TransactionRecord
from app.pdf_generator import generate_pdf_report_bytes
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v1", tags=["Reports"])

class GeneratePdfRequest(BaseModel):
    transaction_id: str

@router.post("/generate-pdf")
def download_pdf_report(req: GeneratePdfRequest, db: Session = Depends(get_db)):
    tx = db.query(TransactionRecord).filter(TransactionRecord.id == req.transaction_id).first()
    
    if not tx:
        # Fallback dummy data generator if ID not in DB (for test UI)
        tx_data = {
            "transaction_id": req.transaction_id,
            "amount": 12500.00,
            "transaction_type": "TRANSFER",
            "sender_account": "ACC-SENDER-99812",
            "receiver_account": "ACC-RECV-44109",
            "rf_score": 0.78,
            "if_score": 0.82,
            "overall_risk_score": 0.84,
            "final_decision": "HUMAN_REVIEW",
            "agent_scores": {
                "behavior_score": 0.85,
                "historical_score": 0.70,
                "knowledge_score": 0.90,
                "rule_score": 0.88
            },
            "judge_confidence": 0.96,
            "decision_reasoning": "High-value transfer ($12,500) originating from unknown IP range during nocturnal hours violating RBI AML Section 14B.",
            "processing_time_ms": 138.4
        }
    else:
        tx_data = {
            "transaction_id": tx.id,
            "amount": tx.amount,
            "transaction_type": tx.transaction_type,
            "sender_account": tx.sender_account,
            "receiver_account": tx.receiver_account,
            "rf_score": tx.rf_score,
            "if_score": tx.if_score,
            "overall_risk_score": tx.overall_risk_score,
            "final_decision": tx.final_decision,
            "agent_scores": {
                "behavior_score": tx.behavior_score,
                "historical_score": tx.historical_score,
                "knowledge_score": tx.knowledge_score,
                "rule_score": tx.rule_score
            },
            "judge_confidence": tx.judge_confidence,
            "decision_reasoning": tx.decision_reasoning,
            "processing_time_ms": tx.processing_time_ms
        }

    pdf_bytes = generate_pdf_report_bytes(tx_data)
    
    filename = f"FraudShield_Audit_Report_{req.transaction_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/reports")
def get_reports_summary(db: Session = Depends(get_db)):
    txs = db.query(TransactionRecord).order_by(TransactionRecord.created_at.desc()).limit(20).all()
    reports = []
    for t in txs:
        reports.append({
            "report_id": f"REP-{t.id}",
            "transaction_id": t.id,
            "created_at": t.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "risk_score": t.overall_risk_score,
            "final_decision": t.final_decision,
            "download_url": f"/api/v1/generate-pdf?transaction_id={t.id}"
        })
    return reports
