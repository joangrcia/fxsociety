import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/shared';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';

// Lazy load page components for code splitting
// Using named exports requires wrapping with default
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage').then(m => ({ default: m.AdminOrdersPage })));
const AdminTicketsPage = lazy(() => import('./pages/AdminTicketsPage').then(m => ({ default: m.AdminTicketsPage })));
const AdminCustomersPage = lazy(() => import('./pages/AdminCustomersPage').then(m => ({ default: m.AdminCustomersPage })));
const AdminCustomerDetailPage = lazy(() => import('./pages/AdminCustomerDetailPage').then(m => ({ default: m.AdminCustomerDetailPage })));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage').then(m => ({ default: m.AdminProductsPage })));
const AdminNotFoundPage = lazy(() => import('./pages/AdminNotFoundPage').then(m => ({ default: m.AdminNotFoundPage })));

// Loading fallback component with admin styling
function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-slate-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-mono">Memuat...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter basename="/admin">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<AdminLoginPage />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/" element={<ProtectedRoute><Navigate to="/customers" replace /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><AdminCustomersPage /></ProtectedRoute>} />
              <Route path="/customers/:id" element={<ProtectedRoute><AdminCustomerDetailPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
              <Route path="/tickets" element={<ProtectedRoute><AdminTicketsPage /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
              
              {/* Catch all - 404 */}
              <Route path="*" element={<AdminNotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
