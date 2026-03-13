import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="flex flex-col gap-8 text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Next-Gen Fintech
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] text-slate-900 dark:text-white tracking-tight">
                                Split Expenses, <span className="text-primary">Not Trust.</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                                Experience the future of fair sharing with our automated, secure fintech platform. Perfect for roommates, travel buddies, and partners.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link to="/register" className="bg-primary text-white text-lg font-bold px-8 py-4 rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all text-center no-underline">
                                    Get Started Now
                                </Link>
                                <button className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-lg font-bold px-8 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                    <span className="material-symbols-outlined">play_circle</span>
                                    How it works
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full"></div>
                            <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden aspect-video lg:aspect-square flex items-center justify-center">
                                <div className="p-8 w-full h-full flex flex-col gap-6">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                        <div className="h-8 w-8 bg-primary/20 rounded-full"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-20 w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center gap-4">
                                            <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-600">
                                                <span className="material-symbols-outlined">check_circle</span>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                                <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            </div>
                                            <div className="text-slate-900 dark:text-white font-bold">$420.00</div>
                                        </div>
                                        <div className="h-20 w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center gap-4 opacity-60">
                                            <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined">sync</span>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                                <div className="h-2 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                            </div>
                                            <div className="text-slate-900 dark:text-white font-bold">$12.50</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fraud Protection Highlight */}
                <section id="security" className="py-24 bg-white dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
                            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Fraud Protection Highlight</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400">Advanced security layers designed to keep your group transactions transparent and tamper-proof.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Shield Feature */}
                            <div className="group p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all text-left">
                                <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                                    <span className="material-symbols-outlined !text-4xl">verified_user</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Shield Protection</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Our proprietary AI-driven Shield monitoring system identifies suspicious patterns before they reach your wallet. Every split is authenticated with multi-factor biometric checks.
                                </p>
                                <div className="mt-8 flex items-center gap-2 text-primary font-bold cursor-pointer">
                                    Learn about our AI
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </div>
                            </div>
                            {/* Audit Feature */}
                            <div className="group p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all text-left">
                                <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                                    <span className="material-symbols-outlined !text-4xl">search_insights</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Smart Audit</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Full transparency with automated magnifying glass audits. Every participant can view a real-time ledger of receipts and approvals, ensuring no "convenient" mistakes ever happen.
                                </p>
                                <div className="mt-8 flex items-center gap-2 text-primary font-bold cursor-pointer">
                                    View audit logs
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: "Active Users", val: "500K+" },
                                { label: "Trust Score", val: "99.9%" },
                                { label: "Processed", val: "$2B+" },
                                { label: "Fraud Monitoring", val: "24/7" }
                            ].map((stat, i) => (
                                <div key={i} className="p-8 text-center border-r border-slate-200 dark:border-slate-800 last:border-0">
                                    <div className="text-4xl font-black text-primary mb-2">{stat.val}</div>
                                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-24 px-6">
                    <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900 dark:bg-primary/20 p-12 lg:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] -ml-32 -mb-32"></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">Ready to split smarter?</h2>
                            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                                Join thousands of users who trust SplitSmart for their group expenses. No hidden fees, no stress, just pure transparency.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link to="/register" className="bg-primary text-white text-lg font-bold px-10 py-4 rounded-xl shadow-2xl shadow-primary/40 hover:scale-105 transition-all no-underline">
                                    Create Free Account
                                </Link>
                                <button className="bg-white/10 text-white border border-white/20 text-lg font-bold px-10 py-4 rounded-xl hover:bg-white/20 transition-all">
                                    Talk to Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;
