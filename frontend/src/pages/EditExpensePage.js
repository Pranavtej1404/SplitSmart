import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditExpensePage = () => {
    const { expenseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: ''
    });

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/expenses/${expenseId}`);
                const { expense } = response.data;
                setFormData({
                    title: expense.title,
                    description: expense.description || '',
                    amount: expense.amount
                });
            } catch (err) {
                console.error("Error fetching expense:", err);
                setError('Failed to load expense data.');
            } finally {
                setLoading(false);
            }
        };
        fetchExpense();
    }, [expenseId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await axios.put(`http://localhost:8080/expenses/${expenseId}`, {
                title: formData.title,
                description: formData.description,
                amount: parseFloat(formData.amount)
            });
            navigate(`/expenses/${expenseId}`);
        } catch (err) {
            setError('Failed to update expense. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-slate-500">Loading expense...</div>;

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 text-left">
            <div className="mb-10 text-center">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                    <span className="material-symbols-outlined text-3xl">edit_note</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Edit Expense</h1>
                <p className="text-slate-500 mt-2">Update transaction details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Expense Title</label>
                    <input
                        type="text"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Amount ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                    <textarea
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-32"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-lg"
                        disabled={submitting}
                    >
                        {submitting ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/expenses/${expenseId}`)}
                        className="px-8 py-4 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all font-bold"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditExpensePage;
