import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const GroupBalancesPage = () => {
    const { groupId } = useParams();
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/balances/group/${groupId}`);
                setBalances(response.data);
            } catch (err) {
                console.error("Error fetching balances:", err);
                setError('Failed to load group balances.');
            } finally {
                setLoading(false);
            }
        };
        fetchBalances();
    }, [groupId]);

    if (loading) return <div className="p-20 text-center text-slate-500">Calculating debts...</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 text-left">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                        </div>
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Financial Summary</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Group Balances</h1>
                </div>
                <Link to="/settle" className="bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined">payments</span>
                    Settle Up
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-2xl mb-8 font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {balances.length === 0 ? (
                    <div className="md:col-span-2 p-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 font-light">verified</span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All settled!</h3>
                        <p className="text-slate-500">No outstanding debts in this group.</p>
                    </div>
                ) : (
                    balances.map(balance => (
                        <div key={balance.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center text-red-500 font-bold border border-red-100 dark:border-red-900/20">
                                        {balance.debtorId.toString().slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Debtor</p>
                                        <p className="text-slate-900 dark:text-white font-bold">User {balance.debtorId.toString().slice(0, 8)}</p>
                                    </div>
                                </div>
                                <div className="self-center">
                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                </div>
                                <div className="flex items-center gap-4 text-right">
                                    <div className="text-right">
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Creditor</p>
                                        <p className="text-slate-900 dark:text-white font-bold">User {balance.creditorId.toString().slice(0, 8)}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-green-50 dark:bg-green-900/10 rounded-2xl flex items-center justify-center text-green-500 font-bold border border-green-100 dark:border-green-900/20">
                                        {balance.creditorId.toString().slice(0, 2).toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Outstanding amount</span>
                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">${balance.amount.toFixed(2)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GroupBalancesPage;
