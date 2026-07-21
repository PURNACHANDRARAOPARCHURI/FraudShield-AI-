import React, { useState, useEffect } from 'react';
import { KeyRound, Smartphone, CheckCircle, AlertTriangle, X, ShieldCheck, RefreshCw } from 'lucide-react';
import { verifyOtp } from '../services/api';

interface OtpModalProps {
  transactionId: string;
  senderAccount: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onFailure: (message: string) => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  transactionId, senderAccount, onClose, onSuccess, onFailure
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(59);

  // Simulated SMS Toast message code
  const mockSmsCode = '123456';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Please enter a valid OTP code.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await verifyOtp(transactionId, otpCode);
      if (res.success) {
        onSuccess(res.message);
      } else {
        setErrorMsg(res.message);
        onFailure(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* SIMULATED SMS NOTIFICATION TOAST */}
      <div className="absolute top-6 right-6 max-w-sm glass-card border border-cyan-500/40 p-3.5 rounded-2xl shadow-2xl animate-bounce flex items-center space-x-3 bg-slate-900/90">
        <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span className="font-bold text-cyan-400">TWILIO SMS GATEWAY</span>
            <span>Just now</span>
          </div>
          <p className="text-white font-medium mt-0.5">
            Your FraudShield verification code is <span className="font-mono font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded">{mockSmsCode}</span>.
          </p>
        </div>
      </div>

      <div className="w-full max-w-md glass-panel border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Secondary OTP Authorization Required</h3>
          <p className="text-xs text-slate-400">
            Transaction risk score (0.40 - 0.75) mandates 2FA OTP verification. An SMS was dispatched to account registered phone.
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">Enter 6-Digit OTP Code</label>
              <span className="text-[11px] text-slate-400 font-mono">Resend in: 00:{timer < 10 ? `0${timer}` : timer}</span>
            </div>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full text-center tracking-widest text-2xl font-mono py-3 bg-slate-900 border border-slate-700 rounded-2xl text-cyan-400 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="123456"
              autoFocus
            />
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-1.5 text-center flex items-center justify-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setOtpCode(mockSmsCode)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white rounded-xl"
            >
              Auto-fill Code
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Approve Transaction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
