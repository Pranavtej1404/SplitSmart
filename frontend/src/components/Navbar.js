import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary text-white p-2 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                    </div>
                    <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white no-underline">SplitSmart</Link>
                </div>

                <nav className="hidden md:flex items-center gap-10">
                    <a className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors no-underline" href="#features">Features</a>
                    <a className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors no-underline" href="#security">Security</a>
                    <a className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors no-underline" href="#pricing">Pricing</a>
                    <Link to="/admin/fraud" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors no-underline">Admin</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link to="/notifications" className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors no-underline flex items-center">
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                        {/* Placeholder for badge - would normally fetch unread count */}
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                    </Link>
                    <Link to="/login" className="hidden sm:flex text-sm font-bold text-slate-700 dark:text-slate-200 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all no-underline">
                        Login
                    </Link>
                    <Link to="/register" className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all no-underline">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
