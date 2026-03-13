import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddExpensePage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        splitType: 'EQUAL',
        participants: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/groups/${groupId}/members`);
                setMembers(response.data);
                // By default, everyone is included in equal split
                setFormData(prev => ({
                    ...prev,
                    participants: response.data.map(m => m.userId)
                }));
            } catch (err) {
                console.error("Error fetching members:", err);
            }
        };
        fetchMembers();
    }, [groupId]);

    const handleParticipantToggle = (userId) => {
        setFormData(prev => {
            const isSelected = prev.participants.includes(userId);
            const updatedParticipants = isSelected
                ? prev.participants.filter(id => id !== userId)
                : [...prev.participants, userId];
            return { ...prev, participants: updatedParticipants };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.participants.length === 0) {
            setError("Please select at least one participant.");
            setLoading(false);
            return;
        }

        try {
            const amount = parseFloat(formData.amount);
            let participants = [];

            if (formData.splitType === 'EQUAL') {
                const share = amount / formData.participants.length;
                participants = formData.participants.map(userId => ({
                    userId,
                    shareAmount: share
                }));
            } else {
                // Custom split: use manual amount from state
                participants = formData.participants.map(userId => ({
                    userId,
                    shareAmount: parseFloat(document.getElementById(`share-${userId}`).value) || 0
                }));

                const totalSplit = participants.reduce((sum, p) => sum + p.shareAmount, 0);
                if (Math.abs(totalSplit - amount) > 0.01) {
                    setError(`Total shares ($${totalSplit.toFixed(2)}) must equal total amount ($${amount.toFixed(2)})`);
                    setLoading(false);
                    return;
                }
            }

            const userId = "00000000-0000-0000-0000-000000000000"; // Placeholder
            await axios.post('http://localhost:8080/expenses', {
                groupId,
                createdBy: userId,
                title: formData.title,
                description: formData.description,
                amount: amount,
                participants: participants
            });
            navigate(`/groups/${groupId}`);
        } catch (err) {
            setError('Failed to add expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 text-left">
            <div className="mb-10 text-center">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                    <span className="material-symbols-outlined text-3xl">add_shopping_cart</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Add Expense</h1>
                <p className="text-slate-500 mt-2">Log a new transaction for the group</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Expense Title</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. Dinner at Marina"
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
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description (Optional)</label>
                    <textarea
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24"
                        placeholder="What was this for?"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Who's Involved?</label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, splitType: 'EQUAL' })}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${formData.splitType === 'EQUAL' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}
                            >
                                EQUAL
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, splitType: 'CUSTOM' })}
                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${formData.splitType === 'CUSTOM' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}
                            >
                                CUSTOM
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {members.map(member => (
                            <div
                                key={member.id}
                                className={`flex flex-col p-3 rounded-xl border transition-all ${formData.participants.includes(member.userId)
                                    ? 'bg-primary/5 border-primary'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <button
                                        type="button"
                                        onClick={() => handleParticipantToggle(member.userId)}
                                        className="flex items-center gap-3 flex-1"
                                    >
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${formData.participants.includes(member.userId) ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                            {member.userId.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className={`text-sm font-bold ${formData.participants.includes(member.userId) ? 'text-primary' : 'text-slate-500'}`}>
                                            User {member.userId.slice(0, 4)}
                                        </span>
                                    </button>
                                    {formData.participants.includes(member.userId) && (
                                        <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                    )}
                                </div>

                                {formData.splitType === 'CUSTOM' && formData.participants.includes(member.userId) && (
                                    <div className="mt-3 pt-3 border-t border-primary/10">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-400">$</span>
                                            <input
                                                id={`share-${member.userId}`}
                                                type="number"
                                                step="0.01"
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-1 px-2 text-sm font-bold text-slate-900 dark:text-white"
                                                placeholder="Amount"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-lg"
                        disabled={loading}
                    >
                        {loading ? 'Adding Expense...' : 'Create Expense'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/groups/${groupId}`)}
                        className="px-8 py-4 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition-all font-bold"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddExpensePage;
