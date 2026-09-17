import React, { useState } from 'react';
import { TransactionInput } from '../types';
import { Send, Sparkles, AlertCircle, ShieldAlert, CreditCard, Clock, UserCheck, DollarSign, Laptop, MapPin, Hash } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (data: TransactionInput) => void;
  loading: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<TransactionInput>({
    amount: 1450.00,
    transaction_type: 'TRANSFER',
    sender_account: 'ACC-8829-4109',
    receiver_account: 'ACC-1102-9941',
    transaction_time: '14:30:00',
    device_id: 'DEV-IPHONE-15-PRO',
    device_type: 'iOS Mobile App',
    ip_address: '103.24.18.99',
    geo_location: 'Mumbai, IN',
    account_balance: 15400.00,
    merchant_name: 'FastPay Wire Transfer',
    description: 'Invoice payment #88412'
  });

  const [showOptional, setShowOptional] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.amount || formData.amount <= 0) errs.amount = 'Amount must be greater than 0';
    if (!formData.sender_account || formData.sender_account.length < 4) errs.sender_account = 'Valid sender account required';
    if (!formData.receiver_account || formData.receiver_account.length < 4) errs.receiver_account = 'Valid receiver account required';
    if (!formData.transaction_time) errs.transaction_time = 'Transaction time required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Preset Scenario Loaders
  const applyPreset = (type: 'low' | 'med' | 'high') => {
    if (type === 'low') {
      setFormData({
        amount: 25.50,
        transaction_type: 'PAYMENT',
        sender_account: 'ACC-TRUSTED-1002',
        receiver_account: 'ACC-MERCHANT-8821',
        transaction_time: '12:15:00',
        device_id: 'DEV-TRUSTED-MACBOOK',
        device_type: 'macOS Web Browser',
        ip_address: '157.34.12.8',
        geo_location: 'Mumbai, IN',
        account_balance: 8900.00,
        merchant_name: 'Starbucks Coffee',
        description: 'Daily morning coffee'
      });
    } else if (type === 'med') {
      setFormData({
        amount: 4500.00,
        transaction_type: 'TRANSFER',
        sender_account: 'ACC-8829-4109',
        receiver_account: 'ACC-PAYEE-7762',
        transaction_time: '19:45:00',
        device_id: 'DEV-NEW-ANDROID',
        device_type: 'Android App',
        ip_address: '185.220.101.4',
        geo_location: 'Dubai, UAE',
        account_balance: 12000.00,
        merchant_name: 'International Remittance',
        description: 'Vendor payment'
      });
    } else if (type === 'high') {
      setFormData({
        amount: 18500.00,
        transaction_type: 'TRANSFER',
        sender_account: 'ACC-VIP-9990',
        receiver_account: 'ACC-SUSPECT-6661',
        transaction_time: '02:40:00',
        device_id: 'DEV-UNKNOWN-HARDWARE-99',
        device_type: 'Unrecognized Linux Script',
        ip_address: '194.26.29.112',
        geo_location: 'Moscow, RU (VPN)',
        account_balance: 21000.00,
        merchant_name: 'Offshore Escrow Ltd',
        description: 'Urgent midnight crypto escrow transfer'
      });
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transaction Telemetry & Vector Analysis</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Input transaction parameters for real-time Dual Statistical Models & Multi-Stage Concurrent Heuristic Evaluation.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">Quick Scenarios:</span>
          <button
            type="button"
            onClick={() => applyPreset('low')}
            className="px-2.5 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/80 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors"
          >
            Low Risk ($25)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('med')}
            className="px-2.5 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/80 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
          >
            Medium OTP ($4.5k)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('high')}
            className="px-2.5 py-1 text-xs font-medium bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800/80 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors"
          >
            High Risk ($18.5k)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* REQUIRED INPUTS SECTION */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Required Transaction Inputs (5)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                1. Transaction Amount ($) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className={`w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                    errors.amount ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="text-[11px] text-rose-400 mt-1">{errors.amount}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                2. Transaction Type <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.transaction_type}
                onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              >
                <option value="TRANSFER">WIRE TRANSFER</option>
                <option value="PAYMENT">MERCHANT PAYMENT</option>
                <option value="WITHDRAWAL">ATM / CASH WITHDRAWAL</option>
                <option value="DEPOSIT">DEPOSIT / REFUND</option>
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                3. Transaction Time <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.transaction_time}
                  onChange={(e) => setFormData({ ...formData, transaction_time: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  placeholder="HH:MM:SS (e.g. 14:30:00)"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Sender */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                4. Sender Account Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.sender_account}
                onChange={(e) => setFormData({ ...formData, sender_account: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="ACC-xxxx-xxxx"
              />
            </div>

            {/* Receiver */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                5. Receiver Account Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.receiver_account}
                onChange={(e) => setFormData({ ...formData, receiver_account: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="ACC-xxxx-xxxx"
              />
            </div>
          </div>
        </div>

        {/* OPTIONAL INPUTS TOGGLE */}
        <div className="pt-2">
          <div className="flex items-center justify-between cursor-pointer py-2 border-t border-slate-200 dark:border-slate-800" onClick={() => setShowOptional(!showOptional)}>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Optional Contextual Inputs (7)
              </h3>
            </div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              {showOptional ? 'Collapse Optional' : 'Expand Optional'}
            </span>
          </div>

          {showOptional && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 bg-slate-100/70 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Device ID</label>
                <input
                  type="text"
                  value={formData.device_id || ''}
                  onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Device Type</label>
                <input
                  type="text"
                  value={formData.device_type || ''}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">IP Address</label>
                <input
                  type="text"
                  value={formData.ip_address || ''}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Geo Location</label>
                <input
                  type="text"
                  value={formData.geo_location || ''}
                  onChange={(e) => setFormData({ ...formData, geo_location: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Sender Account Balance ($)</label>
                <input
                  type="number"
                  value={formData.account_balance || 0}
                  onChange={(e) => setFormData({ ...formData, account_balance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Merchant / Institution Name</label>
                <input
                  type="text"
                  value={formData.merchant_name || ''}
                  onChange={(e) => setFormData({ ...formData, merchant_name: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">Transaction Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Executing Multi-Stage Heuristic Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Execute Quantitative Risk Assessment Pipeline</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
