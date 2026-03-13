import React from 'react';

const Footer = () => {
    return (
        <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                    <span className="font-bold text-slate-900 dark:text-white">SplitSmart</span>
                    <span>© 2026. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-8">
                    <a className="hover:text-primary transition-colors no-underline text-slate-500" href="#">Privacy Policy</a>
                    <a className="hover:text-primary transition-colors no-underline text-slate-500" href="#">Terms of Service</a>
                    <a className="hover:text-primary transition-colors no-underline text-slate-500" href="#">Cookie Settings</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
