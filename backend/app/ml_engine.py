import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from typing import Tuple, Dict, Any

class FraudMLEngine:
    def __init__(self):
        self.rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.if_model = IsolationForest(contamination=0.08, random_state=42)
        self._is_trained = False
        self._train_models()

    def _train_models(self):
        """Generates realistic synthetic banking transaction training dataset and fits both models."""
        np.random.seed(42)
        n_samples = 3000

        # Normal transactions (92%)
        n_normal = int(n_samples * 0.92)
        normal_amount = np.random.exponential(scale=150, size=n_normal) + 5
        normal_hour = np.random.randint(6, 23, size=n_normal)
        normal_velocity = np.random.poisson(lam=1.2, size=n_normal)
        normal_balance_ratio = np.random.uniform(0.001, 0.15, size=n_normal)
        normal_new_device = np.random.choice([0, 1], p=[0.95, 0.05], size=n_normal)
        normal_foreign_ip = np.random.choice([0, 1], p=[0.97, 0.03], size=n_normal)
        normal_geo_dist = np.random.exponential(scale=15, size=n_normal)

        # Fraudulent transactions (8%)
        n_fraud = n_samples - n_normal
        fraud_amount = np.random.exponential(scale=4500, size=n_fraud) + 800
        fraud_hour = np.random.choice([0, 1, 2, 3, 4, 5, 23], size=n_fraud)
        fraud_velocity = np.random.poisson(lam=5.8, size=n_fraud) + 2
        fraud_balance_ratio = np.random.uniform(0.40, 0.98, size=n_fraud)
        fraud_new_device = np.random.choice([0, 1], p=[0.20, 0.80], size=n_fraud)
        fraud_foreign_ip = np.random.choice([0, 1], p=[0.25, 0.75], size=n_fraud)
        fraud_geo_dist = np.random.exponential(scale=850, size=n_fraud) + 200

        # Assemble feature matrices
        X_normal = np.column_stack([
            normal_amount, normal_hour, normal_velocity, normal_balance_ratio,
            normal_new_device, normal_foreign_ip, normal_geo_dist
        ])
        y_normal = np.zeros(n_normal)

        X_fraud = np.column_stack([
            fraud_amount, fraud_hour, fraud_velocity, fraud_balance_ratio,
            fraud_new_device, fraud_foreign_ip, fraud_geo_dist
        ])
        y_fraud = np.ones(n_fraud)

        X = np.vstack([X_normal, X_fraud])
        y = np.hstack([y_normal, y_fraud])

        # Shuffle
        indices = np.arange(X.shape[0])
        np.random.shuffle(indices)
        X, y = X[indices], y[indices]

        # Fit Random Forest (Supervised)
        self.rf_model.fit(X, y)

        # Fit Isolation Forest (Unsupervised Anomaly Detection)
        self.if_model.fit(X)
        self._is_trained = True

    def extract_features(self, tx_data: Dict[str, Any]) -> np.ndarray:
        """Helper to convert transaction JSON into 7-dimensional feature vector."""
        amount = float(tx_data.get("amount", 100.0))
        
        # Parse time or fallback to current hour
        tx_time = str(tx_data.get("transaction_time", "12:00:00"))
        try:
            hour = int(tx_time.split(":")[0])
        except Exception:
            hour = 14
            
        balance = float(tx_data.get("account_balance", 10000.0))
        balance = max(balance, 1.0)
        balance_ratio = min(amount / balance, 1.0)
        
        device_id = str(tx_data.get("device_id", "")).lower()
        is_new_device = 1 if ("new" in device_id or "unrecognized" in device_id or "dev-unknown" in device_id) else 0

        ip = str(tx_data.get("ip_address", ""))
        is_foreign_ip = 1 if (ip.startswith("185.") or ip.startswith("194.") or ip.startswith("103.") or "vpn" in ip) else 0

        geo = str(tx_data.get("geo_location", "")).lower()
        if "foreign" in geo or "russia" in geo or "nigeria" in geo or "unknown" in geo:
            geo_dist = 4500.0
        else:
            geo_dist = 25.0

        # Heuristic velocity estimate based on transaction type and amount
        velocity = 6 if (amount > 5000 and is_new_device) else 1

        return np.array([[amount, hour, velocity, balance_ratio, is_new_device, is_foreign_ip, geo_dist]])

    def predict(self, tx_data: Dict[str, Any]) -> Tuple[float, float]:
        """
        Returns:
            rf_prob (float 0.0 to 1.0): Random Forest Fraud Probability
            if_anomaly_score (float 0.0 to 1.0): Isolation Forest Anomaly Score
        """
        features = self.extract_features(tx_data)
        
        # Random Forest Fraud Probability
        rf_prob = float(self.rf_model.predict_proba(features)[0][1])
        
        # Isolation Forest Raw Decision Function (negative = anomaly)
        raw_if_score = float(self.if_model.decision_function(features)[0])
        # Normalize decision function to [0.0, 1.0] where 1.0 is highest anomaly
        # Typically raw_if_score ranges from -0.35 (extreme anomaly) to +0.35 (normal)
        normalized_if = max(0.0, min(1.0, (0.25 - raw_if_score) / 0.50))

        return round(rf_prob, 4), round(normalized_if, 4)

ml_engine = FraudMLEngine()
