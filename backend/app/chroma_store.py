import os
import logging
from typing import List, Dict, Any

logger = logging.getLogger("fraudshield.chroma")

POLICY_DOCUMENTS = [
    {
        "id": "RBI_AML_001",
        "title": "RBI Master Direction on Anti-Money Laundering (AML) Guidelines",
        "content": "Transactions exceeding $10,000 USD equivalent transferred to newly added third-party payees within 24 hours of account creation mandate mandatory secondary verification (OTP/Biometric) and multi-agent risk scoring under Section 14B.",
        "category": "Regulatory"
    },
    {
        "id": "RBI_FRAUD_002",
        "title": "RBI Guidelines on Digital Banking Fraud Prevention",
        "content": "Rapid cross-border velocity (2 or more transactions originating from distinct geographic IP ranges within a 15-minute window) triggers immediate automated freeze and mandatory Human Triage escalation.",
        "category": "Velocity"
    },
    {
        "id": "INTERNAL_RULE_101",
        "title": "Enterprise Device Novelty & Geolocation Guardrails",
        "content": "Unrecognized Device Fingerprint combined with an Anomaly Score > 0.60 requires immediate OTP authorization. If account balance depletion ratio exceeds 70%, transaction risk score must be elevated by 0.25.",
        "category": "Device & Geo"
    },
    {
        "id": "AML_HIGH_RISK_P2P",
        "title": "P2P Transfer Risk Threshold Protocols",
        "content": "Peer-to-Peer wire transfers during off-peak night hours (00:00 to 05:00 AM) with receiver accounts flagged for prior failed OTP attempts must undergo LLM-as-a-Judge audit validation prior to final clearance.",
        "category": "Timing & History"
    }
]

class ChromaKnowledgeStore:
    def __init__(self):
        self._is_initialized = False
        self.collection = None
        self._setup_store()

    def _setup_store(self):
        try:
            import chromadb
            from chromadb.config import Settings as ChromaSettings

            self.client = chromadb.Client(ChromaSettings(anonymized_telemetry=False, is_persistent=False))
            self.collection = self.client.get_or_create_collection(name="rbi_aml_compliance_rules")
            
            # Populate documents
            documents = [doc["content"] for doc in POLICY_DOCUMENTS]
            metadatas = [{"title": doc["title"], "category": doc["category"]} for doc in POLICY_DOCUMENTS]
            ids = [doc["id"] for doc in POLICY_DOCUMENTS]

            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            self._is_initialized = True
            logger.info("ChromaDB in-memory vector database initialized successfully with policy rules.")
        except Exception as e:
            logger.warning(f"ChromaDB initialization failed ({e}). Using in-memory fallback compliance store.")
            self._is_initialized = False

    def query_policies(self, query_text: str, n_results: int = 2) -> List[Dict[str, Any]]:
        """Queries relevant policy guidelines matching the transaction scenario."""
        if self._is_initialized and self.collection:
            try:
                results = self.collection.query(
                    query_texts=[query_text],
                    n_results=n_results
                )
                retrieved = []
                if results and "documents" in results and len(results["documents"]) > 0:
                    for doc, meta, doc_id in zip(results["documents"][0], results["metadatas"][0], results["ids"][0]):
                        retrieved.append({
                            "id": doc_id,
                            "title": meta.get("title", ""),
                            "content": doc,
                            "category": meta.get("category", "")
                        })
                return retrieved
            except Exception as e:
                logger.error(f"ChromaDB query error: {e}")

        # Fallback keyword matcher
        matched = []
        q = query_text.lower()
        for doc in POLICY_DOCUMENTS:
            if any(term in q or term in doc["content"].lower() for term in ["rbi", "aml", "device", "velocity", "amount", "night", "foreign"]):
                matched.append(doc)
        return matched[:n_results] if matched else POLICY_DOCUMENTS[:2]

chroma_store = ChromaKnowledgeStore()
