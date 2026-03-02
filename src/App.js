import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import MonitoringDashboard from './components/MonitoringDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Home from './pages/Home';
import Listings from './pages/Listings';
import VehicleDetail from './pages/VehicleDetail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import VehicleManagement from './pages/admin/VehicleManagement';
import SellerManagement from './pages/admin/SellerManagement';
import BuyerManagement from './pages/admin/BuyerManagement';
import Settings from './pages/admin/Settings';
import './config/amplify';
import './App.css';

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  
  // Check if admin route
  if (adminOnly) {
    const groups = user.signInUserSession?.accessToken?.payload['cognito:groups'] || [];
    const isAdmin = groups.includes('admin') || user.username === 'waseemsamra@gmail.com' || user.username?.includes('admin');
    if (!isAdmin) {
      return <Navigate to="/" />;
    }
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <div className="bg-slate-950 text-white overflow-x-hidden">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/vehicles" element={
            <>
              <Navbar />
              <Listings />
              <Footer />
            </>
          } />
          <Route path="/vehicle/:id" element={
            <>
              <Navbar />
              <VehicleDetail />
              <Footer />
            </>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="vehicles" element={<VehicleManagement />} />
            <Route path="sellers" element={<SellerManagement />} />
            <Route path="buyers" element={<BuyerManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        {user && <MonitoringDashboard />}
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
