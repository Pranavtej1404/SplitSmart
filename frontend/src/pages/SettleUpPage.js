import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SettleUpPage = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        groupId: '',
        fromUser: '',
        toUser: '',
        amount: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await axios.post('http://localhost:8080/balances/settle', {
                groupId: formData.groupId,
                fromUser: formData.fromUser,
                toUser: formData.toUser,
                amount: parseFloat(formData.amount)
            });
            navigate(`/groups/${formData.groupId}/balances`);
        } catch (err) {
            console.error("Settlement error:", err);
            setError('Failed to record settlement. Verify your inputs.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-left">
            <div className="mb-12 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-green-500/10 text-green-600 mb-4">
                    <span className="material-symbols-outlined text-3xl">payments</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Settle Up</h1>
                <p className="text-slate-500 mt-2">Record a payment to clear shared debts</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl max-w-2xl mx-auto">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-8 text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Group ID</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-mono text-sm"
                            value={formData.groupId}
                            onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                            placeholder="Enter group UUID"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Who Paid?</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-mono text-sm"
                                value={formData.fromUser}
                                onChange={(e) => setFormData({ ...formData, fromUser: e.target.value })}
                                placeholder="Your User ID"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Paid To?</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-mono text-sm"
                                value={formData.toUser}
                                onChange={(e) => setFormData({ ...formData, toUser: e.target.value })}
                                placeholder="Recipient User ID"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Amount Paid ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-xl py-6 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500/50 transition-all text-3xl font-black text-center"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-green-600/20 hover:shadow-green-600/40 hover:-translate-y-0.5 transition-all text-xl"
                            disabled={submitting}
                        >
                            {submitting ? 'Recording...' : 'Record Payment'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettleUpPage;
