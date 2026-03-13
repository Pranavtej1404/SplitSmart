import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const GroupDetailsPage = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [groupRes, membersRes, expensesRes] = await Promise.all([
                    axios.get(`http://localhost:8080/groups/${groupId}`),
                    axios.get(`http://localhost:8080/groups/${groupId}/members`),
                    axios.get(`http://localhost:8080/expenses/group/${groupId}`)
                ]);
                setGroup(groupRes.data);
                setNewGroupName(groupRes.data.groupName);
                setMembers(membersRes.data);
                setExpenses(expensesRes.data);
            } catch (err) {
                console.error("Error fetching group details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId]);

    const handleUpdateGroupName = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/groups/${groupId}`, {
                groupName: newGroupName
            });
            setGroup(response.data);
            setIsEditingName(false);
        } catch (err) {
            alert("Failed to update group name.");
        }
    };

    if (loading) return <div className="p-20 text-center text-slate-500">Loading group details...</div>;
    if (!group) return <div className="p-20 text-center text-red-500">Group not found.</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 text-left">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <span className="material-symbols-outlined text-2xl">groups</span>
                        </div>
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Group Finance</span>
                    </div>
                    {isEditingName ? (
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                className="text-3xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-primary rounded-xl px-4 py-2 focus:outline-none"
                            />
                            <button onClick={handleUpdateGroupName} className="p-2 bg-green-500 text-white rounded-lg">
                                <span className="material-symbols-outlined">check</span>
                            </button>
                            <button onClick={() => setIsEditingName(false)} className="p-2 bg-slate-400 text-white rounded-lg">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 group/title">
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{group.groupName}</h1>
                            <button
                                onClick={() => setIsEditingName(true)}
                                className="opacity-0 group-hover/title:opacity-100 p-2 text-slate-400 hover:text-primary transition-all"
                            >
                                <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex gap-3">
                    <Link to={`/groups/${groupId}/invite`} className="flex items-center gap-2 px-5 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-all no-underline">
                        <span className="material-symbols-outlined text-xl">person_add</span>
                        Invite
                    </Link>
                    <Link to={`/groups/${groupId}/expenses/create`} className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all no-underline">
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        Add Expense
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Expenses */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Expenses</h2>
                            <span className="text-sm font-medium text-slate-500">{expenses.length} total</span>
                        </div>

                        <div className="space-y-4">
                            {expenses.length === 0 ? (
                                <div className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-500">
                                    No expenses yet. Start by adding one!
                                </div>
                            ) : (
                                expenses.map(expense => (
                                    <Link key={expense.expenseId} to={`/expenses/${expense.expenseId}`} className="block p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all no-underline group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">receipt_long</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{expense.title}</h3>
                                                    <p className="text-sm text-slate-500 mt-1">{new Date(expense.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-black text-slate-900 dark:text-white">${expense.amount.toFixed(2)}</div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${expense.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {expense.status}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Members & Summary */}
                <div className="space-y-10">
                    <section className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">groups_3</span>
                            Group Members
                        </h3>
                        <div className="space-y-4">
                            {members.map(member => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                                            {member.userId.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            User {member.userId.slice(0, 4)}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                        {member.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default GroupDetailsPage;
