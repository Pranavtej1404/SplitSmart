import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import InviteMemberPage from './pages/InviteMemberPage';
import AddExpensePage from './pages/AddExpensePage';
import ExpenseDetailsPage from './pages/ExpenseDetailsPage';
import EditExpensePage from './pages/EditExpensePage';
import PendingApprovalsPage from './pages/PendingApprovalsPage';
import GroupBalancesPage from './pages/GroupBalancesPage';
import SettleUpPage from './pages/SettleUpPage';
import AdminFraudDashboard from './pages/AdminFraudDashboard';
import Notifications from './pages/Notifications';
import './App.css';

function App() {
    return (
        <div className="App flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/groups/create" element={<CreateGroupPage />} />
                    <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
                    <Route path="/groups/:groupId/invite" element={<InviteMemberPage />} />
                    <Route path="/groups/:groupId/expenses/create" element={<AddExpensePage />} />
                    <Route path="/expenses/:expenseId" element={<ExpenseDetailsPage />} />
                    <Route path="/expenses/:expenseId/edit" element={<EditExpensePage />} />
                    <Route path="/approvals" element={<PendingApprovalsPage />} />
                    <Route path="/groups/:groupId/balances" element={<GroupBalancesPage />} />
                    <Route path="/settle" element={<SettleUpPage />} />
                    <Route path="/admin/fraud" element={<AdminFraudDashboard />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
