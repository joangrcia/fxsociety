import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Footer, ErrorBoundary } from './components/shared';
import { MemberLayout } from './components/member';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Lazy load page components for code splitting
// Using named exports requires wrapping with default
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const SupportPage = lazy(() => import('./pages/SupportPage').then(m => ({ default: m.SupportPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const OrdersPage = lazy(() => import('./pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const UserDashboardPage = lazy(() => import('./pages/UserDashboardPage').then(m => ({ default: m.UserDashboardPage })));
const MemberDigitalPage = lazy(() => import('./pages/member/MemberDigitalPage').then(m => ({ default: m.MemberDigitalPage })));
const MemberMerchandisePage = lazy(() => import('./pages/member/MemberMerchandisePage').then(m => ({ default: m.MemberMerchandisePage })));
const MemberSupportPage = lazy(() => import('./pages/member/MemberSupportPage').then(m => ({ default: m.MemberSupportPage })));
const MemberProfilePage = lazy(() => import('./pages/member/MemberProfilePage').then(m => ({ default: m.MemberProfilePage })));
const MemberProductDetailPage = lazy(() => import('./pages/member/MemberProductDetailPage').then(m => ({ default: m.MemberProductDetailPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-slate-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Memuat...</p>
      </div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isMemberArea = location.pathname.startsWith('/member');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const showNavAndFooter = !isMemberArea && !isAuthPage;

  return (
    <div className="min-h-screen flex flex-col">
      {showNavAndFooter && <Navbar />}
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />

            {/* Member Area Routes */}
            <Route path="/member" element={<MemberLayout />}>
              <Route index element={<Navigate to="digital" replace />} />
              <Route path="digital" element={<MemberDigitalPage />} />
              <Route path="digital/:id" element={<MemberProductDetailPage />} />
              <Route path="merchandise" element={<MemberMerchandisePage />} />
              <Route path="support" element={<MemberSupportPage />} />
              <Route path="profile" element={<MemberProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* 404 Catch All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
      {showNavAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
