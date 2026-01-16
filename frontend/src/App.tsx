import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Footer } from './components/shared';
import { MemberLayout } from './components/member';
import { AuthProvider } from './context/AuthContext';
import { 
  HomePage, 
  ShopPage, 
  HowItWorksPage, 
  SupportPage, 
  AboutPage, 
  LoginPage,
  RegisterPage,
  ProductDetailPage,
  OrdersPage,
  UserDashboardPage,
  MemberDigitalPage,
  MemberMerchandisePage,
  MemberSupportPage,
  MemberProfilePage,
  MemberProductDetailPage,
  NotFoundPage,
} from './pages';

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
      </div>
      {showNavAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
