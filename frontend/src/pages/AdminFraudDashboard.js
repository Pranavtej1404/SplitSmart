import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminFraudDashboard = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [testStatus, setTestStatus] = useState(null);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await axios.get('http://localhost:8080/fraud/records');
            setRecords(response.data);
        } catch (err) {
            console.error("Error fetching fraud records:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleTestConnection = async () => {
        setTesting(true);
        setTestStatus(null);
        try {
            const response = await axios.get('http://localhost:8080/fraud/test-ai');
            setTestStatus({ success: true, message: response.data });
        } catch (err) {
            setTestStatus({ success: false, message: err.response?.data || "Connection failed" });
        } finally {
            setTesting(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-slate-500">Loading dashboard...</div>;

    const highRiskCount = records.filter(r => r.riskLevel === 'HIGH').length;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Fraud Intelligence</h1>
                    <p className="text-slate-500 font-medium">Platform-wide risk monitoring & AI verification</p>
                </div>
                <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${testing ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20'
                        }`}
                >
                    <span className={`material-symbols-outlined ${testing ? 'animate-spin' : ''}`}>
                        {testing ? 'sync' : 'bolt'}
                    </span>
                    {testing ? 'Testing Connection...' : 'Verify Gemini Connection'}
                </button>
            </div>

            {testStatus && (
                <div className={`mb-12 p-6 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-top-4 duration-300 ${testStatus.success ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                    }`}>
                    <span className="material-symbols-outlined shrink-0">
                        {testStatus.success ? 'check_circle' : 'error'}
                    </span>
                    <div className="font-bold">{testStatus.message}</div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Analyses</p>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">{records.length}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">High Risk Items</p>
                    <div className="text-4xl font-black text-red-600">{highRiskCount}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">System Status</p>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-2xl font-black text-green-600 uppercase">Active</span>
                    </div>
                </div>
            </div>

            {/* Records Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <h3 className="font-bold text-slate-900 dark:text-white">Recent Analyses</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <th className="px-6 py-4">Expense ID</th>
                                <th className="px-6 py-4">Group</th>
                                <th className="px-6 py-4 text-center">Score</th>
                                <th className="px-6 py-4">Risk Level</th>
                                <th className="px-6 py-4">Findings Snippet</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {records.map(record => (
                                <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{record.expenseId.slice(0, 8)}...</td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{record.groupId.slice(0, 8)}...</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-xs ${record.riskScore >= 70 ? 'bg-red-100 text-red-600' :
                                                    record.riskScore >= 30 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                                                }`}>
                                                {record.riskScore}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${record.riskLevel === 'HIGH' ? 'bg-red-600 text-white' :
                                                record.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                                            }`}>
                                            {record.riskLevel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 italic">
                                        "{record.findings.slice(0, 60)}..."
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminFraudDashboard;
