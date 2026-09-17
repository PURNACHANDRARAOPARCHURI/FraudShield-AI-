# FraudShield — Quantitative Financial Telemetry & Statistical Risk Pipeline

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-black?logo=vercel)](https://frontend-alpha-ten-sa8mvm5nup.vercel.app)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg)](https://reactjs.org/)

> **🌐 Live Production Web Application**: [https://frontend-alpha-ten-sa8mvm5nup.vercel.app](https://frontend-alpha-ten-sa8mvm5nup.vercel.app)

An enterprise-grade, full-stack **Quantitative Banking Anomaly Detection System** with modern fintech UI (Stripe / Visa / Mastercard telemetry dashboard). Powered by dual statistical machine learning models (Random Forest probability classifier and Isolation Forest outlier estimator), a 4-subsystem concurrent heuristic inspection pipeline, ChromaDB vector compliance retrieval, multi-criteria algorithmic decision validation, 2FA cryptographic SMS OTP authorization, Security Analyst Triage Queue, and automated PDF audit report generation.

<img width="965" height="652" alt="image" src="https://github.com/user-attachments/assets/59734b55-9744-4945-97ba-a8d0debc0525" />

---

## 👨‍💻 Lead System Architect & Developer

| Detail | Information |
|---|---|
| **Author** | **Purna Chandra Rao** |
| **Email** | [purnap909@gmail.com](mailto:purnap909@gmail.com) |
| **Mobile** | [+91 6304990878](tel:6304990878) |
| **Project** | FraudShield Quantitative Telemetry & Security Engine |
| **Live App** | [https://frontend-alpha-ten-sa8mvm5nup.vercel.app](https://frontend-alpha-ten-sa8mvm5nup.vercel.app) |

---

## 🌟 Key Features

1. **Transaction Input & Preset Scenarios**:
   - **5 Required Telemetry Inputs**: Amount, Transaction Type, Sender Account, Receiver Account, Transaction Time.
   - **7 Contextual Inputs**: Device ID, Device Type, IP Address, Geo Location, Account Balance, Merchant Name, Description.
   - Pre-configured quick-test buttons: Baseline Risk ($25), Medium Risk 2FA ($4.5k), Anomalous Risk ($18.5k).

2. **Dual Statistical Machine Learning Layer**:
   - **Random Forest Classifier**: Probability of Anomaly \(P(\text{Fraud}) \in [0.0, 1.0]\).
   - **Isolation Forest**: Unsupervised Metric Outlier Score [0.0 - 1.0].

3. **Initial Fast-Path Threshold Gate Engine**:
   - Telemetry with composite risk < 0.40 triggers deterministic immediate clearance.

4. **Concurrent Heuristic Subsystem Pipeline**:
   - **Subsystem 1: Behavioral Telemetry Subsystem** (spending velocity, hardware fingerprint, geo shift).
   - **Subsystem 2: Historical Ledger Subsystem** (PostgreSQL chargeback ledger & authentication attempt records).
   - **Subsystem 3: Policy Compliance Matrix Subsystem** (ChromaDB vector embedding search on RBI & AML regulatory policies).
   - **Subsystem 4: Boundary Constraints Engine** (deterministic threshold constraints: $10k limit cap, foreign IP, nocturnal transfer).

5. **Risk Aggregator & Decision Matrix**:
   - Computes weighted Enterprise Risk Score & percentage contribution breakdown.
   - Action Paths: `< 0.40 Cleared` | `0.40–0.75 Secondary 2FA Challenge` | `> 0.75 Security Triage Queue`.

6. **Multi-Criteria Algorithmic Decision Validator**:
   - Audits decision reasoning against 5 formal engineering criteria: Invariance Verification, Reasoning Consistency, Evidence Verification, Guardrail Constraints, Regulatory Compliance.

7. **Cryptographic 2FA OTP Screen**:
   - Interactive verification with simulated SMS toast popover and validation code (`123456`).

8. **Human Review Security Triage Console**:
   - Real-time queue for inspecting anomalous transactions with manual Approve / Reject / Escalate controls.

9. **Enterprise Quantitative Analytics Dashboard**:
   - KPI telemetry counters, Recharts trend area charts, risk distribution histograms, dynamic policy threshold sliders, and infrastructure health monitoring.

10. **Automated PDF Audit Report Generator**:
    - Generates downloadable audit-ready PDF reports with ReportLab and in-browser client generator.

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

- **Live Production Deployment (Vercel)**: [https://frontend-alpha-ten-sa8mvm5nup.vercel.app](https://frontend-alpha-ten-sa8mvm5nup.vercel.app)
- **Alternate Production Alias**: [https://frontend-dtgofloju-purna6.vercel.app](https://frontend-dtgofloju-purna6.vercel.app)
- **GitHub Repository**: [https://github.com/PURNACHANDRARAOPARCHURI/FraudShield-AI-](https://github.com/PURNACHANDRARAOPARCHURI/FraudShield-AI-)

---

## 📜 License

Distributed under the MIT License. Enterprise-ready for banking and financial institutions.
