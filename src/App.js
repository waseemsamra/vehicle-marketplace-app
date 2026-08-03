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
import Search from './pages/Search';
import Listings from './pages/Listings';
import VehicleDetail from './pages/VehicleDetail';
import FashionHome from './pages/FashionHome';
import FashionHeader from './components/FashionHeader';
import FashionFooter from './components/FashionFooter';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import VehicleManagement from './pages/admin/VehicleManagement';
import VehicleForm from './pages/admin/VehicleForm';
import SellerManagement from './pages/admin/SellerManagement';
import BuyerManagement from './pages/admin/BuyerManagement';
import Settings from './pages/admin/Settings';
import Roles from './pages/admin/Roles';
import { createRole } from './models/Role';
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
  
  // Authorization is delegated to the role instance (polymorphic canViewAdmin),
  // so staff/subclasses extend the gate automatically.
  if (adminOnly && !createRole(user).canViewAdmin()) {
    return <Navigate to="/" />;
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
          
          {/* Fashion Marketplace */}
          <Route path="/fashion" element={
            <>
              <FashionHeader />
              <FashionHome />
              <FashionFooter />
            </>
          } />
          
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/vehicles" element={
            <>
              <Navbar />
              <Listings />
              <Footer />
            </>
          } />
           <Route path="/vehicle/:id" element={<VehicleDetail />} />
          
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="vehicles/new" element={<VehicleForm />} />
              <Route path="vehicles/:id/edit" element={<VehicleForm />} />
              <Route path="sellers" element={<SellerManagement />} />
              <Route path="buyers" element={<BuyerManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="roles" element={<Roles />} />
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
