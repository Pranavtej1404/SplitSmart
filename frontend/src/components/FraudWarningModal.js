import React from 'react';

const FraudWarningModal = ({ isOpen, onClose, fraudData }) => {
    if (!isOpen || !fraudData) return null;

    const { riskScore, riskLevel, findings } = fraudData;

    const getRiskColor = () => {
        if (riskLevel === 'HIGH') return 'text-red-600 bg-red-50 border-red-100';
        if (riskLevel === 'MEDIUM') return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-green-600 bg-green-50 border-green-100';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-amber-900/10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined shrink-0">warning</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">Fraud Warning</h2>
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Unanimous Approval Required</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Score</p>
                            <div className="text-4xl font-black text-slate-900 dark:text-white">{riskScore}/100</div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl border font-black text-sm ${getRiskColor()}`}>
                            {riskLevel} RISK
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-primary">analytics</span>
                            AI & Rule Findings
                        </h4>
                        <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                            {findings}
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-600 text-lg">info</span>
                        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                            <strong className="block mb-1">Recommendation:</strong>
                            We strongly suggest the payer uploads a valid receipt to verify this expense.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FraudWarningModal;
