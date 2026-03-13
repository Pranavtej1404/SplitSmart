import React, { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import {
    Bell,
    CheckCircle,
    AlertTriangle,
    DollarSign,
    Trash2,
    Clock,
    Filter
} from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications();
            setNotifications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'EXPENSE_CREATED':
                return <DollarSign className="text-blue-500" />;
            case 'EXPENSE_APPROVED':
                return <CheckCircle className="text-green-500" />;
            case 'FRAUD_DETECTED':
                return <AlertTriangle className="text-red-500" />;
            case 'SETTLEMENT_RECORDED':
                return <CheckCircle className="text-purple-500" />;
            default:
                return <Bell className="text-gray-500" />;
        }
    };

    const filteredNotifications = filter === 'ALL'
        ? notifications
        : filter === 'UNREAD'
            ? notifications.filter(n => !n.read)
            : notifications.filter(n => n.type === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Bell className="text-indigo-600" />
                    Notifications
                </h1>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-1.5 rounded-md transition-all ${filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('UNREAD')}
                        className={`px-4 py-1.5 rounded-md transition-all ${filter === 'UNREAD' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Unread
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
                        <Bell className="mx-auto h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg">No notifications found.</p>
                    </div>
                ) : (
                    filteredNotifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-md flex gap-4 ${notif.read ? 'bg-white opacity-75' : 'bg-white border-l-4 border-l-indigo-500 shadow-sm ring-1 ring-indigo-50/50'}`}
                        >
                            <div className="bg-gray-50 p-3 rounded-lg h-fit">
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        {notif.type.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className={`text-gray-700 ${notif.read ? '' : 'font-medium'}`}>
                                    {notif.message}
                                </p>
                                {!notif.read && (
                                    <button
                                        onClick={() => handleMarkRead(notif.id)}
                                        className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
