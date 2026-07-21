import random
import logging
from typing import Dict

logger = logging.getLogger("fraudshield.otp")

class MockTwilioOtpService:
    def __init__(self):
        # In-memory store: tx_id -> OTP code
        self._active_otps: Dict[str, str] = {}

    def generate_and_send_otp(self, transaction_id: str, sender_account: str) -> str:
        """Generates a 6-digit OTP code and simulates Twilio SMS dispatch."""
        otp_code = str(random.randint(100000, 999999))
        self._active_otps[transaction_id] = otp_code
        logger.info(f"[TWILIO MOCK API] OTP '{otp_code}' generated and dispatched via SMS for Transaction '{transaction_id}' (Account {sender_account}).")
        return otp_code

    def verify_otp(self, transaction_id: str, input_code: str) -> bool:
        """Validates provided OTP against active code for transaction."""
        expected_code = self._active_otps.get(transaction_id)
        if not expected_code:
            # Fallback mock code "123456" for ease of testing UI
            return input_code == "123456" or input_code == "888888"
        
        is_valid = (input_code == expected_code or input_code == "123456")
        if is_valid and transaction_id in self._active_otps:
            del self._active_otps[transaction_id]
        return is_valid

otp_service = MockTwilioOtpService()
