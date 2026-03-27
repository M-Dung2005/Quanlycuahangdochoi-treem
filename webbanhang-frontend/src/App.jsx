import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';
import AuthModal from './components/AuthModal/AuthModal';
import Toast from './components/Toast/Toast';

import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminPage from './pages/AdminPage';

function AppLayout() {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const location = useLocation();

    const isAdminRoute = location.pathname.startsWith('/admin');
    const isCheckoutRoute = location.pathname.startsWith('/checkout');

    return (
        <>
            {!isAdminRoute && <Header onOpenAuth={() => setIsAuthOpen(true)} />}
            {!isAdminRoute && !isCheckoutRoute && <Navbar />}

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>

            {!isAdminRoute && !isCheckoutRoute && <Footer />}

            {!isAdminRoute && (
                <>
                    <Cart />
                    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
                </>
            )}
            <Toast />
        </>
    );
}

function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}

export default App;
