import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PendingApprovalsPage = () => {
    const [pendingExpenses, setPendingExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPending = async () => {
            try {
                // Placeholder: In real app, we would have an endpoint GET /approvals/pending/{userId}
                // For now, let's fetch all expenses and filter for status 'CREATED' or 'PENDING_APPROVAL'
                // This is a simplification for the demo.
                const response = await axios.get('http://localhost:8080/expenses/group/00000000-0000-0000-0000-000000000000'); // Dummy group ID
                setPendingExpenses(response.data.filter(e => e.status === 'CREATED' || e.status === 'PENDING_APPROVAL'));
            } catch (err) {
                console.error("Error fetching approvals:", err);
                setError('Could not load pending approvals.');
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    const handleVote = async (expenseId, vote) => {
        try {
            const userId = "00000000-0000-0000-0000-000000000000"; // Placeholder
            await axios.post('http://localhost:8080/approvals/vote', {
                expenseId,
                userId,
                vote
            });
            // Refresh list
            setPendingExpenses(prev => prev.filter(e => e.expenseId !== expenseId));
        } catch (err) {
            alert("Failed to cast vote.");
        }
    };

    if (loading) return <div className="p-20 text-center text-slate-500">Scanning for pending actions...</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 text-left">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                        <span className="material-symbols-outlined text-2xl">how_to_vote</span>
                    </div>
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">Decision Center</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Pending Approvals</h1>
                <p className="text-slate-500 mt-2 text-lg">Review and authorize shared expenses</p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-2xl mb-8 font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingExpenses.length === 0 ? (
                    <div className="md:col-span-2 p-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 font-light">task_alt</span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">You're all caught up!</h3>
                        <p className="text-slate-500">No expenses currently requiring your approval.</p>
                    </div>
                ) : (
                    pendingExpenses.map(expense => (
                        <div key={expense.expenseId} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col justify-between group hover:border-primary/30 transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">receipt_long</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">${expense.amount.toFixed(2)}</div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
                                    </div>
                                </div>
                                <Link to={`/expenses/${expense.expenseId}`} className="block no-underline">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{expense.title}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-6">{expense.description || "No description provided."}</p>
                                </Link>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => handleVote(expense.expenseId, 'APPROVE')}
                                    className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleVote(expense.expenseId, 'REJECT')}
                                    className="flex-1 bg-amber-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-xl">close</span>
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PendingApprovalsPage;
