import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FraudWarningModal from '../components/FraudWarningModal';

const ExpenseDetailsPage = () => {
    const { expenseId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fraudData, setFraudData] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [showFraudModal, setShowFraudModal] = useState(false);

    useEffect(() => {
        const fetchExpenseData = async () => {
            try {
                const [expenseRes, votesRes, auditRes] = await Promise.all([
                    axios.get(`http://localhost:8080/expenses/${expenseId}`),
                    axios.get(`http://localhost:8080/approvals/expense/${expenseId}/votes`),
                    axios.get(`http://localhost:8080/expenses/${expenseId}/audit`)
                ]);
                setData(expenseRes.data);
                setVotes(votesRes.data);
                setAuditLogs(auditRes.data);

                // Fetch fraud data if applicable
                if (expenseRes.data.expense.status === 'FRAUD_WARNING') {
                    try {
                        const fraudRes = await axios.get(`http://localhost:8080/fraud/expense/${expenseId}`);
                        setFraudData(fraudRes.data);
                        setShowFraudModal(true); // Show modal automatically if flagged
                    } catch (err) {
                        console.error("Error fetching fraud data:", err);
                    }
                }
            } catch (err) {
                console.error("Error fetching expense data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExpenseData();
    }, [expenseId]);

    const handleVote = async (vote) => {
        try {
            const userId = "00000000-0000-0000-0000-000000000000"; // Placeholder
            const response = await axios.post('http://localhost:8080/approvals/vote', {
                expenseId,
                userId,
                vote
            });
            setVotes([...votes, response.data]);
        } catch (err) {
            alert("Failed to cast vote.");
        }
    };

    if (loading) return <div className="p-20 text-center text-slate-500">Loading expense details...</div>;
    if (!data) return <div className="p-20 text-center text-red-500">Expense not found.</div>;

    const { expense, participants } = data;

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 text-left">
            <button
                onClick={() => navigate(`/groups/${expense.groupId}`)}
                className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-bold"
            >
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Group
            </button>

            <div className="space-y-8">
                {/* Main Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${expense.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {expense.status}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">ID: {expense.expenseId.slice(0, 8)}</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{expense.title}</h1>
                            <p className="text-slate-500">{expense.description || "No description provided."}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                            <div className="text-5xl font-black text-slate-900 dark:text-white">${expense.amount.toFixed(2)}</div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Splits ({participants.length})</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {participants.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                                            {p.userId.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-700 dark:text-slate-200">User {p.userId.slice(0, 4)}</span>
                                    </div>
                                    <div className="text-lg font-black text-slate-900 dark:text-white">${p.shareAmount.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => handleVote('APPROVE')}
                        className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">check_circle</span>
                        Approve
                    </button>
                    <button
                        onClick={() => handleVote('REJECT')}
                        className="flex-1 bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">cancel</span>
                        Reject
                    </button>
                    <button
                        onClick={() => navigate(`/expenses/${expenseId}/edit`)}
                        className="flex-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">edit</span>
                        Edit
                    </button>
                </div>

                {/* History/Audit Log */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">history</span>
                        Activity History
                    </h4>
                    <div className="space-y-6 relative">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                        {auditLogs.map((log, idx) => (
                            <div key={log.id} className="relative pl-10">
                                <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 bg-primary rounded-full border-4 border-white dark:border-slate-900"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-primary uppercase tracking-widest">{log.action.replace('_', ' ')}</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{log.details}</p>
                                    <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vote Status */}
                {votes.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Current Votes ({votes.length})</h4>
                        <div className="flex flex-wrap gap-2">
                            {votes.map(v => (
                                <div key={v.voteId} className={`text-[10px] font-bold px-2 py-1 rounded-lg ${v.vote === 'APPROVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    User {v.userId.slice(0, 4)}: {v.vote}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <FraudWarningModal
                isOpen={showFraudModal}
                onClose={() => setShowFraudModal(false)}
                fraudData={fraudData}
            />
        </div>
    );
};

export default ExpenseDetailsPage;
