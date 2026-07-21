# Enterprise AI Fraud Detection System (FraudShield AI)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg)](https://reactjs.org/)
[![LangGraph](https://img.shields.io/badge/AI-LangGraph_Orchestrator-FF6F61.svg)](https://langchain.com/)

An enterprise-grade, full-stack **AI-Powered Banking Fraud Detection System** with modern fintech UI (Stripe / Visa / Mastercard dashboard style). Powered by dual Machine Learning models, a 4-Agent LangGraph Orchestration Engine, ChromaDB Vector DB compliance retrieval, LLM-as-a-Judge validation, 2FA Twilio OTP authorization, Human Security Triage, and automated PDF audit report generation.

---

## 🌟 Key Features

1. **Transaction Input & Preset Scenarios**:
   - **5 Required Inputs**: Amount, Transaction Type, Sender Account, Receiver Account, Transaction Time.
   - **7 Optional Inputs**: Device ID, Device Type, IP Address, Geo Location, Account Balance, Merchant Name, Description.
   - Pre-configured quick-test buttons: Low Risk ($25), Medium Risk OTP ($4.5k), High Risk ($18.5k).

2. **Dual Machine Learning Layer**:
   - **Random Forest Classifier**: Predicts Fraud Probability [0.0 - 1.0].
   - **Isolation Forest**: Calculates Unsupervised Anomaly Distance Score [0.0 - 1.0].

3. **Initial Threshold Gate**:
   - Scores < 0.40 bypass complex agent pipelines for fast-path instant clearance.

4. **LangGraph Parallel Multi-Agent Orchestrator**:
   - **Agent 1: Behavior Analysis Agent** (spending velocity, device trust, geo shift).
   - **Agent 2: Historical Fraud Agent** (PostgreSQL chargebacks & failed OTP logs).
   - **Agent 3: Knowledge Retrieval Agent** (ChromaDB vector search on RBI & AML policy rules).
   - **Agent 4: Rule Engine Agent** (deterministic policy validation like $10k+ limit, foreign IP, nocturnal transfer).

5. **Risk Aggregator & Decision Engine**:
   - Calculates weighted Enterprise Risk Score & percentage contribution breakdown.
   - Actions: `< 0.40 Approve` | `0.40–0.75 OTP` | `> 0.75 Human Review`.

6. **LLM-as-a-Judge**:
   - Validates decision reasoning against 5 criteria: Hallucination Check, Reasoning Consistency, Evidence Verification, Guardrails, Regulatory Compliance.

7. **Twilio 2FA OTP Screen**:
   - Interactive modal with simulated SMS toast popover and code validation (`123456`).

8. **Human Review Security Console**:
   - Queue for inspecting high-risk transactions with manual Approve / Reject / Escalate actions.

9. **Admin Analytics Dashboard**:
   - KPI metric counters, Recharts trend area charts, risk distribution histograms, dynamic threshold policy sliders, and system health status.

10. **Automated PDF Audit Report Generator**:
    - Generates downloadable professional audit-ready PDF reports with ReportLab.

---

## 🏗️ Architecture Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Vite.
- **Backend**: FastAPI, Uvicorn, Python 3.10+, Pydantic v2.
- **AI & ML**: LangGraph, LangChain, OpenAI GPT, scikit-learn (Random Forest & Isolation Forest).
- **Databases**: PostgreSQL (`postgresql+psycopg://postgrel:6304990878purna@localhost:5432/BankFraudSystem`) with automatic SQLite fallback, ChromaDB Vector DB.
- **PDF & OTP**: ReportLab, Twilio Mock API.
- **Containerization**: Docker & Docker Compose.

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API will run at `http://localhost:8000` (Docs: `http://localhost:8000/docs`).

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend Web Application will run at `http://localhost:5173`.

### 3. Docker Deployment

```bash
docker-compose up --build
```

---

## 🔗 Repository & Links

- **GitHub Repository**: [https://github.com/PURNACHANDRARAOPARCHURI/FraudShield-AI-](https://github.com/PURNACHANDRARAOPARCHURI/FraudShield-AI-)

---

## 📜 License

Distributed under the MIT License. Enterprise-ready for banking and financial institutions.
