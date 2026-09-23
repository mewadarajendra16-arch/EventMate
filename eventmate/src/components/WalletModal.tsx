import React, { useState } from 'react';
import { sound } from '../utils/sound';

interface WalletModalProps {
  balance: number;
  onClose: () => void;
  onWithdraw: (amount: number, upiId: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  balance,
  onClose,
  onWithdraw,
}) => {
  const [upiId, setUpiId] = useState('rohansharma@okaxis');
  const [amount, setAmount] = useState(balance > 0 ? balance.toString() : '4000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmt = parseFloat(amount);
    if (isNaN(withdrawAmt) || withdrawAmt <= 0 || withdrawAmt > balance) {
      alert('Please enter a valid withdrawal amount within your available balance.');
      return;
    }

    sound.playPop();
    setIsProcessing(true);

    setTimeout(() => {
      sound.playSuccess();
      setIsProcessing(false);
      onWithdraw(withdrawAmt, upiId);
      setSuccessMessage(
        `Instant UPI Transfer of ₹${withdrawAmt.toLocaleString(
          'en-IN'
        )} sent to ${upiId} (UTR: 328910482910)`
      );
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border-2 border-zinc-200 border-b-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              💰
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-900 leading-tight">
                EventMate Escrow Vault
              </h3>
              <p className="text-[11px] font-bold text-zinc-500">
                Instant UPI Payout System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-md mb-4 border border-amber-600">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-100">
              Withdrawable Balance
            </span>
            <span className="bg-white/20 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
              ⚡ Instant 24x7
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight mt-1">
            ₹{balance.toLocaleString('en-IN')}
          </h2>
          <p className="text-[11px] font-semibold text-amber-100 mt-1 flex items-center gap-1">
            <span>🔒 Protected by Scheduled Escrow Contracts</span>
          </p>
        </div>

        {successMessage ? (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center animate-fadeIn">
            <span className="text-3xl block mb-2">🎉</span>
            <h4 className="text-sm font-black text-emerald-950">
              Payout Disbursed Successfully!
            </h4>
            <p className="text-xs font-semibold text-emerald-800 mt-1">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 mb-1.5">
                UPI ID (GPay, PhonePe, Paytm, BHIM)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@bank"
                  className="w-full h-11 px-3.5 bg-zinc-50 border-2 border-zinc-200 focus:border-[#58CC02] focus:bg-white text-zinc-900 font-bold text-sm rounded-xl outline-none"
                  required
                />
                <span className="absolute right-3 top-2.5 text-[11px] font-extrabold text-[#58CC02] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 mb-1.5">
                Amount to Withdraw (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-black text-zinc-500 text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  max={balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-11 pl-8 pr-3.5 bg-zinc-50 border-2 border-zinc-200 focus:border-[#58CC02] focus:bg-white text-zinc-900 font-black text-base rounded-xl outline-none"
                  required
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] font-bold text-zinc-400">
                  Max available: ₹{balance.toLocaleString('en-IN')}
                </span>
                <button
                  type="button"
                  onClick={() => setAmount(balance.toString())}
                  className="text-[10px] font-extrabold text-[#58CC02] hover:underline"
                >
                  Withdraw All
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || balance <= 0}
              className={`tactile-btn w-full h-12 text-white font-black text-sm uppercase rounded-2xl border-b-4 flex items-center justify-center gap-2 cursor-pointer ${
                balance <= 0
                  ? 'bg-zinc-300 border-zinc-400 cursor-not-allowed text-zinc-500'
                  : 'bg-[#58CC02] hover:bg-[#52be02] border-[#46A302] shadow-[0_4px_0_#46A302]'
              }`}
            >
              {isProcessing ? (
                <span>DISBURSING VIA UPI RAZORPAY ESCROW...</span>
              ) : (
                <span>DISBURSE TO UPI INSTANTLY ⚡</span>
              )}
            </button>
          </form>
        )}

        {/* Security badge */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-center gap-2 text-zinc-500 text-[11px] font-bold">
          <span>🛡️ Powered by RBI Approved Escrow &amp; NPCI UPI</span>
        </div>
      </div>
    </div>
  );
};
