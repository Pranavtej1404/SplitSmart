import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateGroupPage = () => {
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userId = "00000000-0000-0000-0000-000000000000"; // Placeholder: In real app, get from auth context
            const response = await axios.post('http://localhost:8080/groups', {
                groupName,
                createdBy: userId
            });
            navigate(`/groups/${response.data.groupId}`);
        } catch (err) {
            setError('Failed to create group. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background-light dark:bg-background-dark">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 lg:p-10 text-left">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                        <span className="material-symbols-outlined text-3xl">group_add</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Create Group</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Start a new shared expense group</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Group Name</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. Goa Trip, Flatmates"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Group'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupPage;
