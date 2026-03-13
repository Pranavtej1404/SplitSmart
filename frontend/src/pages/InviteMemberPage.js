import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InviteMemberPage = () => {
    const { groupId } = useParams();
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('MEMBER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post(`http://localhost:8080/groups/${groupId}/members`, {
                userId,
                role
            });
            navigate(`/groups/${groupId}`);
        } catch (err) {
            setError('Failed to invite member. Ensure the User ID is valid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background-light dark:bg-background-dark text-left">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 lg:p-10">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                        <span className="material-symbols-outlined text-3xl">person_add</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Invite Member</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Add a collaborator to your group</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">User ID (UUID)</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono text-sm"
                            placeholder="00000000-0000-0000-0000-000000000000"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Assign Role</label>
                        <select
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Inviting...' : 'Invite to Group'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/groups/${groupId}`)}
                        className="w-full text-slate-500 font-bold py-2 hover:text-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberPage;
